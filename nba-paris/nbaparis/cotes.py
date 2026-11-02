"""Lecture de cotes.csv, retrait de la marge du bookmaker, détection de value.

Format attendu (séparateur « , » ou « ; », décimale « . » ou « , ») :
    match,marche,selection,cote
    Celtics @ Magic,vainqueur,Celtics,1.85
    Celtics @ Magic,vainqueur,Magic,2.00
    Celtics @ Magic,handicap,Celtics -2.5,1.91
    Celtics @ Magic,handicap,Magic +2.5,1.91
    Celtics @ Magic,total,Over 221.5,1.90
    Celtics @ Magic,total,Under 221.5,1.90
"""
from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from pathlib import Path

from . import equipes as eq
from . import modele

SEUIL_VALUE = 0.05  # 5 points de pourcentage
MIN_MATCHS_CALIBRATION = 3  # nb minimum de lignes de total pour recaler les totaux

MARCHES = {
    "vainqueur": "vainqueur", "moneyline": "vainqueur", "ml": "vainqueur", "1x2": "vainqueur",
    "face a face": "vainqueur", "face-a-face": "vainqueur", "gagnant": "vainqueur",
    "handicap": "handicap", "spread": "handicap", "ecart": "handicap",
    "total": "total", "over/under": "total", "plus/moins": "total", "totals": "total", "points": "total",
}


@dataclass
class Selection:
    match_brut: str
    marche: str
    selection: str
    cote: float
    match_key: tuple[str, str] | None = None  # (dom, ext)
    equipe: str | None = None
    ligne: float | None = None
    over: bool | None = None
    p_implicite: float | None = None
    p_sans_marge: float | None = None
    marge_retiree: bool = False
    p_modele: float | None = None
    ecart: float | None = None
    value: bool = False
    note: str = ""

    @property
    def esperance(self) -> float | None:
        return None if self.p_modele is None else self.p_modele * self.cote - 1


def _nombre(x: str) -> float:
    return float(str(x).strip().replace(",", "."))


def lire(chemin: Path) -> tuple[list[Selection], list[str]]:
    if not chemin.exists():
        return [], [f"Fichier {chemin.name} introuvable : aucune cote analysée."]
    texte = chemin.read_text(encoding="utf-8-sig")
    lignes = [l for l in texte.splitlines() if l.strip() and not l.lstrip().startswith("#")]
    if not lignes:
        return [], [f"{chemin.name} est vide : aucune cote analysée."]
    dialecte = ";" if lignes[0].count(";") > lignes[0].count(",") else ","
    lecteur = csv.DictReader(lignes, delimiter=dialecte)
    sels, erreurs = [], []
    for i, r in enumerate(lecteur, start=2):
        r = {eq.normaliser(k or ""): (v or "").strip() for k, v in r.items()}
        try:
            marche = MARCHES.get(eq.normaliser(r.get("marche") or r.get("marché") or ""))
            if not marche:
                raise ValueError(f"marché inconnu « {r.get('marche') or r.get('marché')} »")
            cote = _nombre(r["cote"])
            if cote <= 1:
                raise ValueError("cote ≤ 1")
            sels.append(Selection(r["match"], marche, r["selection"], cote))
        except (KeyError, ValueError) as e:
            erreurs.append(f"{chemin.name} ligne {i} ignorée : {e}")
    return sels, erreurs


def _interpreter(s: Selection, matchs) -> None:
    equipes_cit = set(eq.trouver_equipes(s.match_brut))
    for m in matchs:
        if {m.domicile, m.exterieur} <= equipes_cit or (
                len(equipes_cit) == 1 and equipes_cit & {m.domicile, m.exterieur}):
            s.match_key = (m.domicile, m.exterieur)
            break
    if not s.match_key:
        s.note = "match introuvable dans le programme"
        return
    nombres = re.findall(r"[+-]?\d+(?:[.,]\d+)?", s.selection.replace(" ", " "))
    if s.marche in ("vainqueur", "handicap"):
        cites = [e for e in eq.trouver_equipes(s.selection) if e in s.match_key]
        if not cites:
            s.note = "équipe de la sélection non reconnue"
            return
        s.equipe = cites[0]
        if s.marche == "handicap":
            if not nombres:
                s.note = "ligne de handicap absente"
                return
            s.ligne = _nombre(nombres[-1])
    else:
        n = eq.normaliser(s.selection)
        if re.search(r"\b(over|plus|\+|o)\b", n) or n.startswith("+"):
            s.over = True
        elif re.search(r"\b(under|moins|u)\b", n) or n.startswith("-"):
            s.over = False
        if s.over is None or not nombres:
            s.note = "sélection de total non reconnue (attendu « Over 221.5 » / « Under 221.5 »)"
            return
        s.ligne = abs(_nombre(nombres[-1]))


def _groupe(s: Selection):
    if s.marche == "vainqueur":
        return (s.match_key, "vainqueur")
    if s.marche == "handicap":
        return (s.match_key, "handicap", abs(s.ligne))
    return (s.match_key, "total", s.ligne)


def analyser(sels: list[Selection], matchs, projections: dict) -> list[Selection]:
    """projections : {(dom, ext): Projection}"""
    for s in sels:
        _interpreter(s, matchs)
        s.p_implicite = 1 / s.cote
    # Retrait de la marge (méthode proportionnelle) quand les deux issues sont fournies
    groupes: dict = {}
    for s in sels:
        if s.match_key and not s.note:
            groupes.setdefault(_groupe(s), []).append(s)
    for g in groupes.values():
        if len(g) == 2:
            somme = sum(x.p_implicite for x in g)
            for x in g:
                x.p_sans_marge = x.p_implicite / somme
                x.marge_retiree = True
        else:
            for x in g:
                x.p_sans_marge = x.p_implicite
                x.note = "marge non retirée (l'autre issue n'est pas dans cotes.csv)"
    # Recalage des totaux sur le marché (biais moyen du modèle)
    calibrer_totaux(groupes, projections)
    # Comparaison au modèle
    for s in sels:
        if not s.match_key or s.p_sans_marge is None:
            continue
        p = projections.get(s.match_key)
        if not p or not p.disponible:
            s.note = (s.note + " ; " if s.note else "") + "estimation maison non disponible"
            continue
        dom, ext = s.match_key
        if s.marche == "vainqueur":
            s.p_modele = p.proba_dom if s.equipe == dom else 1 - p.proba_dom
        elif s.marche == "handicap":
            ecart_eq = p.ecart if s.equipe == dom else -p.ecart
            s.p_modele = modele.proba_handicap(ecart_eq, s.ligne)
        else:
            s.p_modele = modele.proba_total(p.total, s.ligne, s.over)
        s.ecart = s.p_modele - s.p_sans_marge
        s.value = s.ecart > SEUIL_VALUE
    return sels


def lignes_marche_total(groupes: dict) -> dict:
    """Ligne principale de total par match : celle dont la proba « over » sans marge
    est la plus proche de 50 %, corrigée de l'écart à 50 % via la loi du modèle."""
    candidats: dict = {}
    for cle, g in groupes.items():
        if cle[1] != "total" or len(g) != 2:
            continue
        over = next((x for x in g if x.over), None)
        if over is None:
            continue
        candidats.setdefault(cle[0], []).append((abs(over.p_sans_marge - 0.5), over))
    res = {}
    for match, liste in candidats.items():
        _, over = min(liste, key=lambda t: t[0])
        # médiane implicite : ligne + σ × z(p_over)  (p_over > 0,5 ⇒ médiane au-dessus de la ligne)
        res[match] = over.ligne + modele.ECART_TYPE_TOTAL * modele.probit(over.p_sans_marge)
    return res


def calibrer_totaux(groupes: dict, projections: dict) -> float | None:
    """Corrige le biais moyen des totaux projetés par rapport au marché.

    Le décalage est le même pour tous les matchs : il ne change pas le classement
    relatif des matchs, seulement le niveau général de points attendu.
    """
    marche = lignes_marche_total(groupes)
    ecarts = [projections[m].total - l for m, l in marche.items()
              if m in projections and projections[m].disponible]
    if len(ecarts) < MIN_MATCHS_CALIBRATION:
        return None
    biais = sum(ecarts) / len(ecarts)
    for p in projections.values():
        if p.disponible and p.total_brut is None:
            p.total_brut = p.total
            p.total = p.total - biais
            p.correction_total = -biais
    return biais


def libelle(s: Selection) -> str:
    return f"{s.selection} ({s.marche}) @ {s.cote:.2f}"
