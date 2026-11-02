"""Estimation maison, volontairement simple et transparente.

Méthode (résumé en 3 lignes, repris dans le rapport) :
1. Ratings blend 60 % saison / 40 % 10 derniers matchs ; possessions = pace_dom × pace_ext / pace_ligue ;
   points = possessions × (ORtg équipe + DRtg adverse − ORtg ligue) / 100.
2. Ajustements en points : domicile +2,5 ; back-to-back −1,5 ; 3+ matchs sur les 5 jours précédents −1 ;
   voyage > 1 500 km −0,5 ; absences pondérées par l'impact on/off du joueur (Out 100 %, Doubtful 75 %, Questionable 50 %).
3. Probabilités via une loi normale centrée sur la projection : écart-type 12 pts (écart) et 18 pts (total).
"""
from __future__ import annotations

import datetime as dt
import math
from dataclasses import dataclass, field

import pandas as pd

from . import equipes as eq

AVANTAGE_DOMICILE = 2.5
MALUS_B2B = 1.5
MALUS_CHARGE = 1.0        # 3+ matchs dans les 5 jours précédents
MALUS_VOYAGE = 0.5        # > 1 500 km depuis le dernier match
SEUIL_VOYAGE_KM = 1500
POIDS_SAISON, POIDS_L10 = 0.6, 0.4
ECART_TYPE_MARGE = 12.0
ECART_TYPE_TOTAL = 18.0
POIDS_STATUT = {"OUT": 1.0, "DOUBTFUL": 0.75, "QUESTIONABLE": 0.5, "PROBABLE": 0.0}
PLAFOND_ABSENCES = 10.0
MATCHS_REGRESSION = 10    # poids de la moyenne de ligue, en « matchs fictifs »

METHODE = [
    "Ratings mélangés 60 % saison / 40 % 10 derniers matchs, puis ramenés vers la moyenne de la ligue "
    "(poids = matchs joués / (matchs joués + 10), utile en début de saison) ; possessions = pace dom. × pace ext. / pace ligue ; "
    "points = possessions × (ORtg équipe + DRtg adverse − ORtg ligue) / 100.",
    "Ajustements en points : domicile +2,5 ; back-to-back −1,5 ; 3+ matchs sur les 5 jours précédents −1 ; "
    "voyage > 1 500 km −0,5 ; absences = impact du joueur (on/off NBA, ou BPM +2 de Basketball-Reference) × minutes jouées "
    "(Out 100 %, Doubtful 75 %, Questionable 50 %).",
    "Probabilités = loi normale centrée sur la projection (écart-type 12 pts pour l'écart, 18 pts pour le total) ; "
    "une « value » exige ≥ 5 points de % au-dessus de la probabilité du bookmaker sans marge.",
]


def phi(x: float) -> float:
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


# --------------------------------------------------------------------------- #
# Contexte d'équipe tiré du journal des matchs
# --------------------------------------------------------------------------- #
@dataclass
class Contexte:
    sigle: str
    bilan: tuple[int, int] | None = None
    bilan_dom: tuple[int, int] | None = None
    bilan_ext: tuple[int, int] | None = None
    forme10: tuple[int, int] | None = None
    serie: str | None = None
    b2b: bool | None = None
    matchs_5j: int | None = None
    km_voyage: float | None = None
    fuseau: int | None = None
    dernier_lieu: str | None = None


def contexte(journal: pd.DataFrame | None, s: str, date: dt.date, lieu_match: str) -> Contexte:
    c = Contexte(s)
    if journal is None:
        return c
    j = journal[journal["equipe"] == s].sort_values("date")
    w = lambda df: (int(df["victoire"].sum()), int((~df["victoire"]).sum()))  # noqa: E731
    c.bilan = w(j)
    c.bilan_dom = w(j[j["domicile"]])
    c.bilan_ext = w(j[~j["domicile"]])
    c.forme10 = w(j.tail(10))
    if not j.empty:
        res = list(j["victoire"])
        dernier, n = res[-1], 0
        for r in reversed(res):
            if r != dernier:
                break
            n += 1
        c.serie = f"{n} {'victoire' if dernier else 'défaite'}{'s' if n > 1 else ''} de suite"
        der = j.iloc[-1]
        c.b2b = der["date"] == date - dt.timedelta(days=1)
        c.dernier_lieu = s if der["domicile"] else der["adv"]
        c.km_voyage = eq.distance_km(c.dernier_lieu, lieu_match)
        c.fuseau = eq.ecart_fuseau(c.dernier_lieu, lieu_match)
    else:
        c.b2b = False
    c.matchs_5j = int(((j["date"] >= date - dt.timedelta(days=5)) & (j["date"] < date)).sum())
    return c


def confrontations(journal: pd.DataFrame | None, dom: str, ext: str) -> list[str] | None:
    if journal is None:
        return None
    j = journal[(journal["equipe"] == dom) & (journal["adv"] == ext)].sort_values("date")
    return [
        f"{r['date']:%d/%m} {'vs' if r['domicile'] else '@'} {ext} : "
        f"{'V' if r['victoire'] else 'D'} {r['pts']}-{r['pts_adv']}"
        for _, r in j.iterrows()
    ]


def malus_fatigue(c: Contexte) -> tuple[float, list[str]]:
    m, raisons = 0.0, []
    if c.b2b:
        m += MALUS_B2B
        raisons.append("back-to-back")
    if c.matchs_5j is not None and c.matchs_5j >= 3:
        m += MALUS_CHARGE
        raisons.append(f"{c.matchs_5j} matchs en 5 jours")
    if c.km_voyage is not None and c.km_voyage > SEUIL_VOYAGE_KM:
        m += MALUS_VOYAGE
        raisons.append(f"voyage {c.km_voyage:.0f} km")
    return m, raisons


# --------------------------------------------------------------------------- #
# Absences
# --------------------------------------------------------------------------- #
def penalite_absences(blesses: list[dict], impacts: dict[str, dict] | None, mj_equipe: int | None):
    """Points perdus à cause des absents. Retourne (pénalité|None, détails)."""
    details = []
    if impacts is None:
        return None, [f"{b['joueur']} ({b['statut']}) : impact non disponible" for b in blesses]
    total = 0.0
    for b in blesses:
        poids = POIDS_STATUT.get(b["statut"], 0.0)
        imp = impacts.get(b["cle"])
        if poids == 0:
            continue
        if not imp or not mj_equipe or imp["mj"] == 0:
            details.append(f"{b['joueur']} : pas de minutes cette saison, absence déjà intégrée aux ratings")
            continue
        mpm = imp["min_total"] / imp["mj"]
        fiabilite = imp["min_total"] / (imp["min_total"] + 400)   # rétrécit les petits échantillons
        dispo = min(1.0, imp["mj"] / mj_equipe)                    # absence déjà subie = déjà dans les ratings
        valeur = max(0.0, imp["v100"] * mpm / 48 * fiabilite * dispo)
        valeur = min(valeur, 6.0)
        total += valeur * poids
        details.append(f"{b['joueur']} : {valeur:.1f} pt × {poids:.0%}")
    return min(total, PLAFOND_ABSENCES), details


# --------------------------------------------------------------------------- #
# Projection
# --------------------------------------------------------------------------- #
@dataclass
class Projection:
    pts_dom: float | None = None
    pts_ext: float | None = None
    ecart: float | None = None          # dom − ext
    total: float | None = None
    proba_dom: float | None = None
    ajustements: list[str] = field(default_factory=list)
    manques: list[str] = field(default_factory=list)

    @property
    def disponible(self) -> bool:
        return self.ecart is not None


def melange(saison: dict | None, l10: dict | None) -> dict | None:
    if not saison:
        return None
    if not l10:
        return dict(saison)
    return {k: POIDS_SAISON * saison[k] + POIDS_L10 * l10[k] for k in ("ortg", "drtg", "net", "pace")}


def regresser(r: dict | None, ligue: dict | None, mj: int | None) -> dict | None:
    """Ramène un rating vers la moyenne de la ligue selon la taille de l'échantillon."""
    if not r or not ligue or not mj:
        return r
    w = mj / (mj + MATCHS_REGRESSION)
    o = ligue["ortg"] + (r["ortg"] - ligue["ortg"]) * w
    d = ligue["ortg"] + (r["drtg"] - ligue["ortg"]) * w
    return {"ortg": o, "drtg": d, "net": o - d, "pace": ligue["pace"] + (r["pace"] - ligue["pace"]) * w}


def projeter(r_dom: dict | None, r_ext: dict | None, ligue: dict | None,
             fat_dom: float, fat_ext: float, abs_dom: float | None, abs_ext: float | None) -> Projection:
    p = Projection()
    if not r_dom or not r_ext or not ligue:
        p.manques.append("ratings")
        return p
    poss = r_dom["pace"] * r_ext["pace"] / ligue["pace"]
    eff_dom = r_dom["ortg"] + r_ext["drtg"] - ligue["ortg"]
    eff_ext = r_ext["ortg"] + r_dom["drtg"] - ligue["ortg"]
    pd_, pe = poss * eff_dom / 100, poss * eff_ext / 100
    # Chaque ajustement est réparti moitié attaque de l'un / moitié défense de l'autre.
    adj = AVANTAGE_DOMICILE - fat_dom + fat_ext
    p.ajustements.append(f"domicile +{AVANTAGE_DOMICILE}")
    if fat_dom:
        p.ajustements.append(f"fatigue dom. −{fat_dom:.1f}")
    if fat_ext:
        p.ajustements.append(f"fatigue ext. −{fat_ext:.1f}")
    if abs_dom is None or abs_ext is None:
        p.manques.append("impact des absences")
    else:
        adj += -abs_dom + abs_ext
        if abs_dom:
            p.ajustements.append(f"absences dom. −{abs_dom:.1f}")
        if abs_ext:
            p.ajustements.append(f"absences ext. −{abs_ext:.1f}")
    # Les absences réduisent surtout l'attaque de l'équipe touchée : effet sur le total.
    abs_tot = (abs_dom or 0) + (abs_ext or 0)
    pd_ += adj / 2 - (abs_tot / 4 if abs_dom is not None else 0)
    pe += -adj / 2 - (abs_tot / 4 if abs_dom is not None else 0)
    p.pts_dom, p.pts_ext = pd_, pe
    p.ecart = pd_ - pe
    p.total = pd_ + pe
    p.proba_dom = phi(p.ecart / ECART_TYPE_MARGE)
    return p


def proba_handicap(ecart_equipe: float, ligne: float) -> float:
    """P(équipe couvre « ligne »), ex. ligne −4,5 : il faut gagner de 5+."""
    return phi((ecart_equipe + ligne) / ECART_TYPE_MARGE)


def proba_total(total_proj: float, ligne: float, over: bool) -> float:
    p_over = 1 - phi((ligne - total_proj) / ECART_TYPE_TOTAL)
    return p_over if over else 1 - p_over


def moyenne_ligue(ratings: dict[str, dict]) -> dict | None:
    if len(ratings) < 20:
        return None
    return {k: sum(r[k] for r in ratings.values()) / len(ratings) for k in ("ortg", "pace")}


def confiance(proj: Projection, ctx_dom: Contexte, ctx_ext: Contexte, mj_min: int | None,
              incertains_cles: int, blessures_ok: bool, l10_ok: bool) -> tuple[str, list[str]]:
    """Niveau de confiance dans l'ESTIMATION (pas dans le résultat)."""
    if not proj.disponible:
        return "faible", ["données de ratings manquantes"]
    niveau, raisons = 2, []
    if not blessures_ok or "impact des absences" in proj.manques:
        niveau -= 2
        raisons.append("blessures/impact non disponibles")
    if mj_min is not None and mj_min < 10:
        niveau -= 1
        raisons.append(f"échantillon court ({mj_min} matchs joués)")
    if incertains_cles:
        niveau -= 1
        raisons.append(f"{incertains_cles} joueur(s) important(s) incertain(s)")
    if not l10_ok and not (mj_min is not None and mj_min <= 10):  # ≤ 10 matchs : 10 derniers = saison
        niveau -= 1
        raisons.append("ratings sur 10 matchs non disponibles")
    return {2: "élevé", 1: "moyen"}.get(niveau, "faible"), raisons or ["données complètes"]
