"""Assemblage de l'analyse et rédaction du rapport Markdown en français."""
from __future__ import annotations

import datetime as dt
from dataclasses import dataclass, field

from . import cotes as ct
from . import equipes as eq
from . import modele as md
from .blessures import STATUTS_FR

ND = "non disponible"
GMT = dt.timezone.utc
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
        "septembre", "octobre", "novembre", "décembre"]
MISE_MAX_SOIREE = 5.0


@dataclass
class AnalyseMatch:
    match: object
    ctx_dom: md.Contexte
    ctx_ext: md.Contexte
    r_dom: dict | None
    r_ext: dict | None
    l10_dom: dict | None
    l10_ext: dict | None
    h2h: list[str] | None
    blesses_dom: list[dict] | None
    blesses_ext: list[dict] | None
    details_abs: list[str]
    fatigue_dom: list[str]
    fatigue_ext: list[str]
    proj: md.Projection
    confiance: str
    raisons_conf: list[str]
    selections: list[ct.Selection] = field(default_factory=list)

    @property
    def cle(self):
        return (self.match.domicile, self.match.exterieur)

    @property
    def titre(self):
        return f"{eq.nom(self.match.exterieur)} @ {eq.nom(self.match.domicile)}"


# --------------------------------------------------------------------------- #
# Mise en forme
# --------------------------------------------------------------------------- #
def _b(t):
    return ND if t is None else f"{t[0]}-{t[1]}"


def _f(x, fmt="{:.1f}"):
    return ND if x is None else fmt.format(x)


def _pct(x):
    return ND if x is None else f"{100 * x:.0f} %"


def _heure(m):
    if not m.heure_utc:
        return ND
    from zoneinfo import ZoneInfo

    gmt = m.heure_utc.astimezone(GMT)
    et = m.heure_utc.astimezone(ZoneInfo("America/New_York"))
    jours = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]
    return f"{jours[gmt.weekday()]} {gmt:%H:%M} GMT ({et:%H:%M} ET)"


def _ratings(r):
    if not r:
        return ND
    return f"ORtg {r['ortg']:.1f} / DRtg {r['drtg']:.1f} / Net {r['net']:+.1f} / pace {r['pace']:.1f}"


def _fatigue(c: md.Contexte, raisons):
    if c.b2b is None:
        return ND
    morceaux = [f"B2B {'oui' if c.b2b else 'non'}", f"{c.matchs_5j} match(s) sur 5 j"]
    if c.km_voyage is not None:
        tz = f", fuseau {c.fuseau:+d} h" if c.fuseau else ""
        morceaux.append(f"voyage {c.km_voyage:.0f} km{tz}")
    return ", ".join(morceaux)


def _absents(liste):
    if liste is None:
        return ND
    if not liste:
        return "aucun signalé"
    out = [b["joueur"] for b in liste if b["statut"] == "OUT"]
    inc = [f"⚠️ {b['joueur']} ({STATUTS_FR[b['statut']]})" for b in liste
           if b["statut"] in ("DOUBTFUL", "QUESTIONABLE")]
    prob = [f"{b['joueur']} (probable)" for b in liste if b["statut"] == "PROBABLE"]
    parts = []
    if out:
        parts.append("Out : " + ", ".join(out))
    if inc:
        parts.append(" ; ".join(inc))
    if prob:
        parts.append(", ".join(prob))
    return " | ".join(parts) or "aucun signalé"


def _favori(a: AnalyseMatch):
    p = a.proj
    if not p.disponible:
        return ND, None
    if p.proba_dom >= 0.5:
        return a.match.domicile, p.proba_dom
    return a.match.exterieur, 1 - p.proba_dom


def _spread(a: AnalyseMatch):
    p = a.proj
    if not p.disponible:
        return ND
    fav = a.match.domicile if p.ecart >= 0 else a.match.exterieur
    return f"{fav} −{abs(p.ecart):.1f}"


# --------------------------------------------------------------------------- #
# Sélections recommandées
# --------------------------------------------------------------------------- #
def choisir(analyses: list[AnalyseMatch]):
    """Max 3 paris simples, 1 seul par match, confiance moyenne ou élevée uniquement."""
    candidats = []
    ecartees = []
    for a in analyses:
        vals = sorted([s for s in a.selections if s.value], key=lambda s: s.ecart, reverse=True)
        if not vals:
            continue
        if a.confiance == "faible":
            ecartees.append((a, vals[0]))
            continue
        candidats.append((a, vals[0]))
    candidats.sort(key=lambda t: t[1].ecart, reverse=True)
    choix = []
    for a, s in candidats[:3]:
        mise = 1.0
        if s.ecart >= 0.08:
            mise += 0.5
        if a.confiance == "élevé":
            mise += 0.5
        choix.append((a, s, min(mise, 2.0)))
    total = sum(m for *_x, m in choix)
    if total > MISE_MAX_SOIREE:
        f = MISE_MAX_SOIREE / total
        choix = [(a, s, round(m * f * 2) / 2) for a, s, m in choix]
    return choix, ecartees


# --------------------------------------------------------------------------- #
# Rapport
# --------------------------------------------------------------------------- #
def rediger(date: dt.date, analyses: list[AnalyseMatch], sources: list[str], avert: list[str],
            nb_cotes: int, erreurs_cotes: list[str]) -> str:
    lendemain = date + dt.timedelta(days=1)
    L = []
    L.append(f"# Paris NBA — nuit du {date.day} au {lendemain.day} {MOIS[lendemain.month - 1]} {lendemain.year}")
    L.append("")
    L.append(f"*Matchs du {date.day} {MOIS[date.month - 1]} {date.year} (heure côte Est des États-Unis), "
             f"heures affichées en GMT (Abidjan). Rapport généré le "
             f"{dt.datetime.now(GMT):%d/%m/%Y à %H:%M} GMT, avant les rencontres.*")
    L.append("")
    L.append("> Outil d'aide à la décision, pas une garantie. Les paris comportent un risque de perte. "
             "Ne misez que ce que vous pouvez vous permettre de perdre.")
    L.append("")
    if not analyses:
        L.append("**Aucun match NBA trouvé pour cette date (ou programme non disponible). Aucun pari recommandé.**")
        L += _pied(sources, avert, erreurs_cotes)
        return "\n".join(L)

    # Tableau récapitulatif
    L.append("## Récapitulatif")
    L.append("")
    L.append("| Match | Heure | Favori (maison) | Proba estimée | Spread projeté | Total projeté | Value détectée | Confiance |")
    L.append("|---|---|---|---|---|---|---|---|")
    for a in analyses:
        fav, p = _favori(a)
        if not a.selections:
            value = "cotes non fournies"
        else:
            value = "oui" if any(s.value for s in a.selections) else "non"
        L.append(f"| {a.match.exterieur} @ {a.match.domicile} | {_heure(a.match)} | {fav} | {_pct(p)} | "
                 f"{_spread(a)} | {_f(a.proj.total)} | {value} | {a.confiance} |")
    L.append("")
    L.append("## Méthode (estimation maison)")
    L.append("")
    for i, l in enumerate(md.METHODE, 1):
        L.append(f"{i}. {l}")
    L.append("")

    # Sections par match (10 lignes max)
    L.append("## Analyse par match")
    for a in analyses:
        d, e = a.match.domicile, a.match.exterieur
        L.append("")
        L.append(f"### {a.titre}")
        L.append("")
        lignes = [
            f"- **Bilans** — {e} : {_b(a.ctx_ext.bilan)} (ext. {_b(a.ctx_ext.bilan_ext)}, 10 derniers {_b(a.ctx_ext.forme10)}"
            f"{', ' + a.ctx_ext.serie if a.ctx_ext.serie else ''}) · {d} : {_b(a.ctx_dom.bilan)} "
            f"(dom. {_b(a.ctx_dom.bilan_dom)}, 10 derniers {_b(a.ctx_dom.forme10)}"
            f"{', ' + a.ctx_dom.serie if a.ctx_dom.serie else ''})",
            f"- **Ratings saison** — {e} : {_ratings(a.r_ext)} · {d} : {_ratings(a.r_dom)}",
            f"- **Ratings 10 derniers** — {e} : {_ratings(a.l10_ext)} · {d} : {_ratings(a.l10_dom)}",
            f"- **Fatigue** — {e} : {_fatigue(a.ctx_ext, a.fatigue_ext)} · {d} : {_fatigue(a.ctx_dom, a.fatigue_dom)}",
            "- **Confrontations saison** — " + (ND if a.h2h is None else ("aucune" if not a.h2h else
                                                    f"({d}) " + " ; ".join(a.h2h))),
            f"- **Absents** — {e} : {_absents(a.blesses_ext)} · {d} : {_absents(a.blesses_dom)}",
        ]
        p = a.proj
        if p.disponible:
            fav, pf = _favori(a)
            lignes.append(f"- **Projection** — {e} {p.pts_ext:.0f} – {p.pts_dom:.0f} {d} ; favori {fav} à {_pct(pf)}, "
                          f"spread {_spread(a)}, total {p.total:.1f} ({', '.join(p.ajustements)}"
                          f"{'; manque : ' + ', '.join(p.manques) if p.manques else ''})")
        else:
            lignes.append(f"- **Projection** — {ND} (manque : {', '.join(p.manques)})")
        if a.selections:
            morceaux = []
            for s in a.selections:
                if s.p_modele is None:
                    morceaux.append(f"{s.selection} @ {s.cote:.2f} : {s.note or ND}")
                else:
                    tag = " ✅ **VALUE**" if s.value else ""
                    marge = "" if s.marge_retiree else " (marge non retirée)"
                    morceaux.append(f"{s.selection} @ {s.cote:.2f} → book {_pct(s.p_sans_marge)}{marge} "
                                    f"vs maison {_pct(s.p_modele)} ({100 * s.ecart:+.1f} pts){tag}")
            lignes.append("- **Cotes** — " + " ; ".join(morceaux))
        else:
            lignes.append("- **Cotes** — aucune cote fournie pour ce match dans cotes.csv")
        lignes.append(f"- **Confiance : {a.confiance}** — {', '.join(a.raisons_conf)}")
        L += lignes[:10]

    # Sélections
    L.append("")
    L.append("## Sélections de la soirée")
    L.append("")
    choix, ecartees = choisir(analyses)
    if nb_cotes == 0:
        L.append("**Aucune cote fournie** : impossible de détecter une value. Remplissez `cotes.csv` puis relancez "
                 "le script. En attendant, **ne pariez pas**.")
    elif not choix:
        L.append("**Aucune value suffisante (écart ≥ 5 points avec une confiance au moins moyenne) ce soir. "
                 "Recommandation : ne pas parier.**")
    else:
        L.append("Paris simples uniquement (pas de combiné). Mise exprimée en % de votre bankroll.")
        L.append("")
        L.append("| # | Match | Sélection | Cote | Proba book (sans marge) | Proba maison | Écart | Mise |")
        L.append("|---|---|---|---|---|---|---|---|")
        for i, (a, s, m) in enumerate(choix, 1):
            L.append(f"| {i} | {a.match.exterieur} @ {a.match.domicile} | {s.selection} ({s.marche}) | {s.cote:.2f} | "
                     f"{_pct(s.p_sans_marge)} | {_pct(s.p_modele)} | +{100 * s.ecart:.1f} pts | {m:.1f} % |")
        L.append("")
        L.append(f"**Total engagé : {sum(m for *_x, m in choix):.1f} % de la bankroll** (plafond {MISE_MAX_SOIREE:.0f} %). "
                 "Vérifiez les compositions officielles ~30 min avant le coup d'envoi : un incertain qui joue ou "
                 "non peut annuler la value.")
    if ecartees:
        L.append("")
        L.append("Value repérée mais **non recommandée** (confiance faible) : " + " ; ".join(
            f"{a.match.exterieur} @ {a.match.domicile} – {ct.libelle(s)}" for a, s in ecartees) + ".")

    L += _pied(sources, avert, erreurs_cotes)
    return "\n".join(L)


def _pied(sources, avert, erreurs_cotes):
    L = ["", "## Sources et avertissements", ""]
    L += [f"- {s}" for s in sources] or ["- aucune source n'a répondu"]
    for a in avert + erreurs_cotes:
        L.append(f"- ⚠️ {a}")
    L += ["", "## Relancer l'outil chaque jour", "",
          "1. Dans le dossier `nba-paris`, activez l'environnement : `source .venv/bin/activate` "
          "(Windows : `.venv\\Scripts\\activate`).",
          "2. Collez les cotes du jour dans `cotes.csv`, puis lancez `python paris.py AAAA-MM-JJ` "
          "(date côte Est) ; relancez juste avant les matchs pour les blessures à jour.",
          "3. Après les matchs, complétez `historique.csv` et lancez `python bilan.py` pour suivre ROI et réussite."]
    return L
