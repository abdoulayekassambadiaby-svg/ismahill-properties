"""Blessures et absents : rapport officiel NBA (PDF) puis ESPN en complément.

Statuts normalisés : OUT, DOUBTFUL, QUESTIONABLE, PROBABLE, AVAILABLE.
Les « Day-To-Day » d'ESPN sont traités comme QUESTIONABLE (incertains).
"""
from __future__ import annotations

import datetime as dt
import io
import re

import requests

from . import equipes as eq
from .donnees import TIMEOUT, UA, _appel, nom_joueur

STATUTS_FR = {
    "OUT": "Absent",
    "DOUBTFUL": "Douteux",
    "QUESTIONABLE": "Incertain",
    "PROBABLE": "Probable",
    "AVAILABLE": "Disponible",
}

_STATUTS = {
    "out": "OUT", "doubtful": "DOUBTFUL", "questionable": "QUESTIONABLE",
    "probable": "PROBABLE", "available": "AVAILABLE", "day-to-day": "QUESTIONABLE",
    "suspension": "OUT", "suspended": "OUT", "injured reserve": "OUT",
}


def _statut(texte: str) -> str | None:
    return _STATUTS.get(eq.normaliser(texte))


def rapport_officiel(date: dt.date, saison: str) -> dict[str, list[dict]]:
    """Dernière version publiée du NBA Injury Report pour la date (PDF officiel)."""
    import pdfplumber

    page = f"https://official.nba.com/nba-injury-report-{saison}-season/"
    html = _appel(requests.get, page, headers=UA, timeout=TIMEOUT).text
    urls = re.findall(r"https://ak-static\.cms\.nba\.com/referee/injury/Injury-Report_"
                      + date.isoformat() + r"_[0-9_]+(?:AM|PM)\.pdf", html)
    if not urls:
        raise RuntimeError("aucun rapport officiel publié pour cette date")

    def cle(u):
        m = re.search(r"_(\d{2})_?(\d{2})?(AM|PM)\.pdf$", u)
        h, mi, ap = int(m.group(1)) % 12, int(m.group(2) or 0), m.group(3)
        return (h + (12 if ap == "PM" else 0)) * 60 + mi

    url = max(set(urls), key=cle)
    pdf = _appel(requests.get, url, headers=UA, timeout=TIMEOUT).content
    res: dict[str, list[dict]] = {}
    equipe = None
    motif = re.compile(
        r"([A-Za-zÀ-ÿ'.\- ]+,\s*[A-Za-zÀ-ÿ'.\- ]+?)\s+(Out|Questionable|Doubtful|Probable|Available)\b\s*(.*)$")
    with pdfplumber.open(io.BytesIO(pdf)) as doc:
        for p in doc.pages:
            for ligne in (p.extract_text() or "").splitlines():
                for s, (nom_eq, *_r) in eq.EQUIPES.items():
                    if nom_eq in ligne or nom_eq.replace(" ", "") in ligne:
                        equipe = s
                m = motif.search(ligne)
                if equipe and m:
                    joueur = m.group(1)
                    # retire un éventuel nom d'équipe collé devant le joueur
                    for nom_eq in (eq.EQUIPES[equipe][0], eq.EQUIPES[equipe][0].replace(" ", "")):
                        joueur = joueur.replace(nom_eq, "")
                    joueur = joueur.strip()
                    res.setdefault(equipe, []).append({
                        "joueur": _affichage(joueur), "cle": nom_joueur(joueur),
                        "statut": _statut(m.group(2)), "detail": m.group(3).strip(),
                        "source": "NBA officiel",
                    })
    return res


def rapport_espn() -> dict[str, list[dict]]:
    url = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/injuries"
    data = _appel(requests.get, url, headers=UA, timeout=TIMEOUT).json()
    res: dict[str, list[dict]] = {}
    for bloc in data.get("injuries", []):
        s = eq.sigle(bloc.get("displayName", ""))
        if not s:
            continue
        for b in bloc.get("injuries", []):
            ath = b.get("athlete", {})
            statut = _statut(b.get("status", "")) or _statut((b.get("type") or {}).get("description", ""))
            if not statut:
                continue
            res.setdefault(s, []).append({
                "joueur": ath.get("displayName", "?"), "cle": nom_joueur(ath.get("displayName", "")),
                "statut": statut, "detail": b.get("shortComment") or (b.get("details") or {}).get("type", ""),
                "source": "ESPN",
            })
    return res


def _affichage(nom: str) -> str:
    if "," in nom:
        f, p = [x.strip() for x in nom.split(",", 1)]
        return f"{p} {f}"
    return nom


def collecter(date: dt.date, saison: str) -> tuple[dict[str, list[dict]], list[str], list[str]]:
    """Fusionne les sources. Le rapport officiel prime en cas de désaccord."""
    sources, avert = [], []
    officiel, espn = {}, {}
    try:
        officiel = rapport_officiel(date, saison)
        sources.append("Blessures : NBA Injury Report officiel")
    except Exception as e:  # noqa: BLE001
        avert.append(f"Rapport officiel NBA des blessures indisponible ({type(e).__name__}: {e}).")
    try:
        espn = rapport_espn()
        sources.append("Blessures : ESPN")
    except Exception as e:  # noqa: BLE001
        avert.append(f"Blessures ESPN indisponibles ({type(e).__name__}).")
    if not officiel and not espn:
        return {}, sources, avert + ["Blessures : non disponible."]
    fusion: dict[str, list[dict]] = {}
    for s in set(officiel) | set(espn):
        vus = {}
        for b in officiel.get(s, []) + espn.get(s, []):
            if b["cle"] not in vus:
                vus[b["cle"]] = b
        fusion[s] = [b for b in vus.values() if b["statut"] != "AVAILABLE"]
    return fusion, sources, avert
