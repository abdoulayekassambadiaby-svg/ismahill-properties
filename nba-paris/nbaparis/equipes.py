"""Référentiel des 30 équipes : sigles, noms, alias et localisation des salles."""
from __future__ import annotations

import math
import re
import unicodedata

# sigle: (nom complet, surnom, ville, lat, lon, fuseau (heures vs côte Est))
EQUIPES = {
    "ATL": ("Atlanta Hawks", "Hawks", "Atlanta", 33.757, -84.396, 0),
    "BOS": ("Boston Celtics", "Celtics", "Boston", 42.366, -71.062, 0),
    "BKN": ("Brooklyn Nets", "Nets", "Brooklyn", 40.683, -73.976, 0),
    "CHA": ("Charlotte Hornets", "Hornets", "Charlotte", 35.225, -80.839, 0),
    "CHI": ("Chicago Bulls", "Bulls", "Chicago", 41.881, -87.674, -1),
    "CLE": ("Cleveland Cavaliers", "Cavaliers", "Cleveland", 41.496, -81.688, 0),
    "DAL": ("Dallas Mavericks", "Mavericks", "Dallas", 32.790, -96.810, -1),
    "DEN": ("Denver Nuggets", "Nuggets", "Denver", 39.749, -105.008, -2),
    "DET": ("Detroit Pistons", "Pistons", "Detroit", 42.341, -83.055, 0),
    "GSW": ("Golden State Warriors", "Warriors", "San Francisco", 37.768, -122.388, -3),
    "HOU": ("Houston Rockets", "Rockets", "Houston", 29.751, -95.362, -1),
    "IND": ("Indiana Pacers", "Pacers", "Indianapolis", 39.764, -86.155, 0),
    "LAC": ("Los Angeles Clippers", "Clippers", "Inglewood", 33.945, -118.341, -3),
    "LAL": ("Los Angeles Lakers", "Lakers", "Los Angeles", 34.043, -118.267, -3),
    "MEM": ("Memphis Grizzlies", "Grizzlies", "Memphis", 35.138, -90.051, -1),
    "MIA": ("Miami Heat", "Heat", "Miami", 25.781, -80.188, 0),
    "MIL": ("Milwaukee Bucks", "Bucks", "Milwaukee", 43.045, -87.917, -1),
    "MIN": ("Minnesota Timberwolves", "Timberwolves", "Minneapolis", 44.979, -93.276, -1),
    "NOP": ("New Orleans Pelicans", "Pelicans", "New Orleans", 29.949, -90.082, -1),
    "NYK": ("New York Knicks", "Knicks", "New York", 40.751, -73.993, 0),
    "OKC": ("Oklahoma City Thunder", "Thunder", "Oklahoma City", 35.463, -97.515, -1),
    "ORL": ("Orlando Magic", "Magic", "Orlando", 28.539, -81.384, 0),
    "PHI": ("Philadelphia 76ers", "76ers", "Philadelphia", 39.901, -75.172, 0),
    "PHX": ("Phoenix Suns", "Suns", "Phoenix", 33.446, -112.071, -2),
    "POR": ("Portland Trail Blazers", "Trail Blazers", "Portland", 45.532, -122.667, -3),
    "SAC": ("Sacramento Kings", "Kings", "Sacramento", 38.580, -121.500, -3),
    "SAS": ("San Antonio Spurs", "Spurs", "San Antonio", 29.427, -98.438, -1),
    "TOR": ("Toronto Raptors", "Raptors", "Toronto", 43.643, -79.379, 0),
    "UTA": ("Utah Jazz", "Jazz", "Salt Lake City", 40.768, -111.901, -2),
    "WAS": ("Washington Wizards", "Wizards", "Washington", 38.898, -77.021, 0),
}

# Sigles alternatifs (ESPN, Basketball-Reference, bookmakers)
ALIAS_SIGLES = {
    "GS": "GSW", "NY": "NYK", "NO": "NOP", "SA": "SAS", "UTAH": "UTA", "WSH": "WAS",
    "BRK": "BKN", "BKN": "BKN", "CHO": "CHA", "PHO": "PHX", "NJ": "BKN", "NOH": "NOP",
    "LA CLIPPERS": "LAC", "LA LAKERS": "LAL",
}

# Alias textuels (minuscules, sans accents) -> sigle
_ALIAS_TEXTE: dict[str, str] = {}
for _s, (_nom, _surnom, _ville, *_r) in EQUIPES.items():
    _ALIAS_TEXTE[_nom.lower()] = _s
    _ALIAS_TEXTE[_surnom.lower()] = _s
_ALIAS_TEXTE.update({
    "la clippers": "LAC", "la lakers": "LAL", "sixers": "PHI", "blazers": "POR",
    "wolves": "MIN", "cavs": "CLE", "mavs": "DAL", "golden state": "GSW",
    "oklahoma city": "OKC", "new orleans": "NOP", "san antonio": "SAS",
    "new york": "NYK", "brooklyn": "BKN", "philadelphie": "PHI",
})


def normaliser(texte: str) -> str:
    texte = unicodedata.normalize("NFKD", str(texte))
    texte = "".join(c for c in texte if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", texte).strip().lower()


def sigle(code_ou_nom: str) -> str | None:
    """Convertit un sigle ou un nom d'équipe en sigle NBA officiel."""
    if not code_ou_nom:
        return None
    brut = str(code_ou_nom).strip()
    haut = brut.upper()
    if haut in EQUIPES:
        return haut
    if haut in ALIAS_SIGLES:
        return ALIAS_SIGLES[haut]
    n = normaliser(brut)
    if n in _ALIAS_TEXTE:
        return _ALIAS_TEXTE[n]
    return None


def trouver_equipes(texte: str) -> list[str]:
    """Liste ordonnée (ordre d'apparition) des équipes citées dans un texte libre."""
    n = " " + normaliser(texte) + " "
    trouves: list[tuple[int, str]] = []
    # noms longs d'abord pour éviter les faux positifs
    for alias in sorted(_ALIAS_TEXTE, key=len, reverse=True):
        for m in re.finditer(r"(?<![a-z0-9])" + re.escape(alias) + r"(?![a-z0-9])", n):
            trouves.append((m.start(), _ALIAS_TEXTE[alias]))
            n = n[: m.start()] + " " * len(alias) + n[m.end():]
    for m in re.finditer(r"(?<![A-Za-z])([A-Z]{2,4})(?![A-Za-z])", str(texte)):
        s = sigle(m.group(1))
        if s:
            trouves.append((m.start(), s))
    vus, ordre = set(), []
    for _, s in sorted(trouves):
        if s not in vus:
            vus.add(s)
            ordre.append(s)
    return ordre


def nom(s: str) -> str:
    return EQUIPES[s][0] if s in EQUIPES else s


def distance_km(a: str, b: str) -> float:
    """Distance orthodromique entre les salles de deux équipes."""
    if a == b:
        return 0.0
    _, _, _, la1, lo1, _ = EQUIPES[a]
    _, _, _, la2, lo2, _ = EQUIPES[b]
    p1, p2 = math.radians(la1), math.radians(la2)
    dp, dl = p2 - p1, math.radians(lo2 - lo1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(h))


def ecart_fuseau(a: str, b: str) -> int:
    return EQUIPES[b][5] - EQUIPES[a][5]


def saison_nba(date) -> str:
    """'2026-27' pour une date entre août 2026 et juillet 2027."""
    debut = date.year if date.month >= 8 else date.year - 1
    return f"{debut}-{(debut + 1) % 100:02d}"


def annee_bref(date) -> int:
    """Année utilisée par Basketball-Reference (saison 2026-27 -> 2027)."""
    return date.year + 1 if date.month >= 8 else date.year
