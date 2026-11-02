"""Collecte des données : nba_api en priorité, ESPN / Basketball-Reference en secours.

Règle d'or : aucune valeur n'est inventée. Une donnée introuvable vaut None
et sera affichée « non disponible » dans le rapport.
"""
from __future__ import annotations

import datetime as dt
import re
import time
from dataclasses import dataclass, field

import pandas as pd
import requests

from . import equipes as eq

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
}
TIMEOUT = 30
TIMEOUT_NBA = 20


@dataclass
class Match:
    game_id: str
    date_et: dt.date
    domicile: str
    exterieur: str
    heure_utc: dt.datetime | None = None
    ville: str | None = None


@dataclass
class Donnees:
    date: dt.date
    saison: str
    matchs: list[Match] = field(default_factory=list)
    # Journal des matchs terminés AVANT la date : une ligne par équipe et par match
    # colonnes : game_id, date, equipe, adv, domicile(bool), pts, pts_adv, victoire(bool)
    journal: pd.DataFrame | None = None
    ratings_saison: dict[str, dict] = field(default_factory=dict)  # sigle -> ortg, drtg, net, pace
    ratings_l10: dict[str, dict] = field(default_factory=dict)
    sources: list[str] = field(default_factory=list)
    avertissements: list[str] = field(default_factory=list)


_NBA_API = {"ok": True}


def _appel_nba(fonction, **kwargs):
    """Appel nba_api ; après un premier échec, stats.nba.com est considéré injoignable
    pour le reste de l'exécution (évite des dizaines de minutes d'attente)."""
    if not _NBA_API["ok"]:
        raise ConnectionError("stats.nba.com injoignable (échec précédent)")
    try:
        return _appel(fonction, essais=2, **kwargs)
    except Exception:
        _NBA_API["ok"] = False
        raise


def _appel(fonction, *args, essais=3, **kwargs):
    """Appelle une fonction réseau avec quelques tentatives espacées."""
    derniere = None
    for i in range(essais):
        try:
            res = fonction(*args, **kwargs)
            time.sleep(0.7)  # politesse envers stats.nba.com
            return res
        except Exception as e:  # noqa: BLE001
            derniere = e
            time.sleep(2 * (i + 1))
    raise derniere


# --------------------------------------------------------------------------- #
# Programme des matchs
# --------------------------------------------------------------------------- #
def programme_nba_api(date: dt.date, saison: str) -> list[Match]:
    from nba_api.stats.endpoints import scheduleleaguev2

    rep = _appel_nba(scheduleleaguev2.ScheduleLeagueV2, season=saison, timeout=TIMEOUT_NBA)
    df = rep.season_games.get_data_frame()
    cible = date.isoformat()
    df = df[df["gameDateEst"].astype(str).str[:10] == cible]
    matchs = []
    for _, r in df.iterrows():
        dom, ext = eq.sigle(r["homeTeam_teamTricode"]), eq.sigle(r["awayTeam_teamTricode"])
        if not dom or not ext:  # matchs d'exhibition / équipes hors NBA
            continue
        heure = None
        try:
            heure = pd.to_datetime(r["gameDateTimeUTC"], utc=True).to_pydatetime()
        except Exception:  # noqa: BLE001
            pass
        matchs.append(Match(str(r["gameId"]), date, dom, ext, heure, r.get("arenaCity") or None))
    return matchs


def programme_espn(date: dt.date) -> list[Match]:
    url = ("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
           f"?dates={date:%Y%m%d}")
    data = _appel(requests.get, url, headers=UA, timeout=TIMEOUT).json()
    matchs = []
    for ev in data.get("events", []):
        comp = ev["competitions"][0]
        dom = ext = None
        for c in comp["competitors"]:
            s = eq.sigle(c["team"].get("abbreviation")) or eq.sigle(c["team"].get("displayName"))
            if c.get("homeAway") == "home":
                dom = s
            else:
                ext = s
        if not dom or not ext:
            continue
        heure = pd.to_datetime(ev["date"], utc=True).to_pydatetime() if ev.get("date") else None
        ville = (comp.get("venue") or {}).get("address", {}).get("city")
        matchs.append(Match(f"espn-{ev['id']}", date, dom, ext, heure, ville))
    return matchs


def programme_bref(date: dt.date) -> list[Match]:
    mois = date.strftime("%B").lower()
    url = (f"https://www.basketball-reference.com/leagues/NBA_{eq.annee_bref(date)}"
           f"_games-{mois}.html")
    df = _tables_bref(url, "schedule")
    df = df[pd.to_datetime(df["Date"], errors="coerce").dt.date == date]
    matchs = []
    for i, r in df.iterrows():
        dom, ext = eq.sigle(r["Home/Neutral"]), eq.sigle(r["Visitor/Neutral"])
        if dom and ext:
            matchs.append(Match(f"bref-{date:%Y%m%d}-{i}", date, dom, ext))
    return matchs


# --------------------------------------------------------------------------- #
# Journal des matchs joués (bilans, forme, fatigue, confrontations)
# --------------------------------------------------------------------------- #
def journal_nba_api(date: dt.date, saison: str) -> pd.DataFrame:
    from nba_api.stats.endpoints import leaguegamefinder

    veille = (date - dt.timedelta(days=1)).strftime("%m/%d/%Y")
    rep = _appel_nba(leaguegamefinder.LeagueGameFinder,
        player_or_team_abbreviation="T",
        season_nullable=saison,
        season_type_nullable="Regular Season",
        league_id_nullable="00",
        date_to_nullable=veille,
        timeout=TIMEOUT_NBA,
    )
    df = rep.league_game_finder_results.get_data_frame()
    lignes = []
    for _, r in df.iterrows():
        eqp = eq.sigle(r["TEAM_ABBREVIATION"])
        m = re.match(r"(\w+)\s+(vs\.|@)\s+(\w+)", str(r["MATCHUP"]))
        if not eqp or not m or pd.isna(r["PTS"]) or pd.isna(r["WL"]):
            continue
        lignes.append({
            "game_id": str(r["GAME_ID"]),
            "date": pd.to_datetime(r["GAME_DATE"]).date(),
            "equipe": eqp,
            "adv": eq.sigle(m.group(3)),
            "domicile": m.group(2) == "vs.",
            "pts": int(r["PTS"]),
            "pts_adv": int(round(r["PTS"] - r["PLUS_MINUS"])),
            "victoire": r["WL"] == "W",
        })
    return _journal(lignes, date)


def journal_bref(date: dt.date) -> pd.DataFrame:
    """Résultats de la saison via les pages mensuelles de Basketball-Reference."""
    annee = eq.annee_bref(date)
    lignes = []
    mois_saison = [("october", 10), ("november", 11), ("december", 12), ("january", 1),
                   ("february", 2), ("march", 3), ("april", 4)]
    for mois, num in mois_saison:
        an = annee - 1 if num >= 8 else annee
        if dt.date(an, num, 1) > date:
            break
        url = f"https://www.basketball-reference.com/leagues/NBA_{annee}_games-{mois}.html"
        try:
            df = _tables_bref(url, "schedule")
        except Exception:  # noqa: BLE001 - mois pas encore publié
            continue
        cols = list(df.columns)
        # colonnes : Date, Start, Visitor, PTS, Home, PTS.1, ...
        for i, r in df.iterrows():
            d = pd.to_datetime(r["Date"], errors="coerce")
            if pd.isna(d) or d.date() >= date:
                continue
            ext, dom = eq.sigle(r["Visitor/Neutral"]), eq.sigle(r["Home/Neutral"])
            p_ext, p_dom = pd.to_numeric(r[cols[3]], errors="coerce"), pd.to_numeric(r[cols[5]], errors="coerce")
            if not ext or not dom or pd.isna(p_ext) or pd.isna(p_dom):
                continue
            gid = f"bref-{d:%Y%m%d}-{dom}"
            lignes.append({"game_id": gid, "date": d.date(), "equipe": dom, "adv": ext, "domicile": True,
                           "pts": int(p_dom), "pts_adv": int(p_ext), "victoire": p_dom > p_ext})
            lignes.append({"game_id": gid, "date": d.date(), "equipe": ext, "adv": dom, "domicile": False,
                           "pts": int(p_ext), "pts_adv": int(p_dom), "victoire": p_ext > p_dom})
        time.sleep(3)  # Basketball-Reference limite à ~20 requêtes/minute
    return _journal(lignes, date)


def _journal(lignes: list[dict], date: dt.date) -> pd.DataFrame:
    cols = ["game_id", "date", "equipe", "adv", "domicile", "pts", "pts_adv", "victoire"]
    df = pd.DataFrame(lignes, columns=cols)
    if not df.empty:
        df = df[df["date"] < date].sort_values(["date", "game_id"]).reset_index(drop=True)
    return df


# --------------------------------------------------------------------------- #
# Ratings (Offensive / Defensive / Net Rating, pace)
# --------------------------------------------------------------------------- #
def ratings_nba_api(date: dt.date, saison: str, derniers: int = 0) -> dict[str, dict]:
    from nba_api.stats.endpoints import leaguedashteamstats

    veille = (date - dt.timedelta(days=1)).strftime("%m/%d/%Y")
    rep = _appel_nba(leaguedashteamstats.LeagueDashTeamStats,
        measure_type_detailed_defense="Advanced",
        per_mode_detailed="PerGame",
        season=saison,
        season_type_all_star="Regular Season",
        last_n_games=derniers,
        date_to_nullable=veille,
        timeout=TIMEOUT_NBA,
    )
    df = rep.league_dash_team_stats.get_data_frame()
    from nba_api.stats.static import teams as st

    par_id = {t["id"]: t["abbreviation"] for t in st.get_teams()}
    res = {}
    for _, r in df.iterrows():
        s = eq.sigle(par_id.get(int(r["TEAM_ID"]), "")) or eq.sigle(r["TEAM_NAME"])
        if s:
            res[s] = {"ortg": float(r["OFF_RATING"]), "drtg": float(r["DEF_RATING"]),
                      "net": float(r["NET_RATING"]), "pace": float(r["PACE"]), "mj": int(r["GP"])}
    return res


def ratings_bref(date: dt.date) -> dict[str, dict]:
    """Ratings saison (tableau « Advanced Stats » de Basketball-Reference).

    Attention : la page reflète l'état actuel de la saison, pas forcément
    celui de la veille si on analyse une date passée.
    """
    url = f"https://www.basketball-reference.com/leagues/NBA_{eq.annee_bref(date)}.html"
    df = _tables_bref(url, "advanced-team")
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [c[-1] for c in df.columns]
    res = {}
    for _, r in df.iterrows():
        s = eq.sigle(str(r["Team"]).replace("*", "").strip())
        if s:
            try:
                res[s] = {"ortg": float(r["ORtg"]), "drtg": float(r["DRtg"]), "net": float(r["NRtg"]),
                          "pace": float(r["Pace"]), "mj": int(r["W"]) + int(r["L"])}
            except (TypeError, ValueError):
                continue
    return res


def _tables_bref(url: str, table_id: str) -> pd.DataFrame:
    """Lit une table Basketball-Reference, y compris celles cachées dans des commentaires HTML."""
    from io import StringIO

    html = _appel(requests.get, url, headers=UA, timeout=TIMEOUT)
    html.raise_for_status()
    texte = html.text.replace("<!--", "").replace("-->", "")
    return pd.read_html(StringIO(texte), attrs={"id": table_id})[0]


# --------------------------------------------------------------------------- #
# Impact individuel (on/off) pour pondérer les absences
# --------------------------------------------------------------------------- #
def impacts_on_off(sigle_eq: str, date: dt.date, saison: str) -> dict[str, dict]:
    """Retourne {nom_normalisé: {nom, on, off, mj, min_total}} pour une équipe."""
    from nba_api.stats.endpoints import teamplayeronoffsummary
    from nba_api.stats.static import teams as st

    t = st.find_team_by_abbreviation(sigle_eq)
    if not t:
        return {}
    veille = (date - dt.timedelta(days=1)).strftime("%m/%d/%Y")
    rep = _appel_nba(teamplayeronoffsummary.TeamPlayerOnOffSummary, team_id=t["id"],
                 measure_type_detailed_defense="Advanced", season=saison,
                 date_to_nullable=veille, timeout=TIMEOUT_NBA)
    on = rep.players_on_court_team_player_on_off_summary.get_data_frame()
    off = rep.players_off_court_team_player_on_off_summary.get_data_frame()
    off_net = {int(r["VS_PLAYER_ID"]): float(r["NET_RATING"]) for _, r in off.iterrows()}
    res = {}
    for _, r in on.iterrows():
        pid = int(r["VS_PLAYER_ID"])
        if pid not in off_net:
            continue
        res[nom_joueur(r["VS_PLAYER_NAME"])] = {
            "nom": r["VS_PLAYER_NAME"], "v100": float(r["NET_RATING"]) - off_net[pid],
            "mj": int(r["GP"]), "min_total": float(r["MIN"]),
        }
    return res


_CACHE_BREF: dict = {}


def impacts_bref(sigle_eq: str, date: dt.date) -> dict[str, dict]:
    """Secours : Box Plus/Minus (BPM) de Basketball-Reference.

    Valeur pour 100 possessions = BPM − (−2,0), −2,0 étant le niveau « remplaçant »
    (convention de Basketball-Reference pour la VORP).
    """
    if "adv" not in _CACHE_BREF:
        url = f"https://www.basketball-reference.com/leagues/NBA_{eq.annee_bref(date)}_advanced.html"
        _CACHE_BREF["adv"] = _tables_bref(url, "advanced")
    df = _CACHE_BREF["adv"]
    res = {}
    for _, r in df.iterrows():
        if eq.sigle(str(r.get("Team"))) != sigle_eq:
            continue
        try:
            g, mp, bpm = int(r["G"]), float(r["MP"]), float(r["BPM"])
        except (TypeError, ValueError):
            continue
        res[nom_joueur(r["Player"])] = {"nom": r["Player"], "v100": bpm + 2.0, "mj": g, "min_total": mp}
    return res


def nom_joueur(nom: str) -> str:
    """'Tatum, Jayson' et 'Jayson Tatum' -> 'jayson tatum' (sans suffixe Jr./III)."""
    nom = str(nom)
    if "," in nom:
        nom_famille, prenom = [p.strip() for p in nom.split(",", 1)]
        nom = f"{prenom} {nom_famille}"
    n = eq.normaliser(nom).replace(".", "").replace("'", "")
    n = re.sub(r"\b(jr|sr|ii|iii|iv)\b", "", n)
    return re.sub(r"\s+", " ", n).strip()


# --------------------------------------------------------------------------- #
# Orchestration
# --------------------------------------------------------------------------- #
def collecter(date: dt.date, verbeux: bool = True) -> Donnees:
    saison = eq.saison_nba(date)
    d = Donnees(date=date, saison=saison)

    def log(msg):
        if verbeux:
            print(msg)

    # 1. Programme
    for nom_src, f in [("nba_api (ScheduleLeagueV2)", lambda: programme_nba_api(date, saison)),
                       ("ESPN (scoreboard)", lambda: programme_espn(date)),
                       ("Basketball-Reference (calendrier)", lambda: programme_bref(date))]:
        try:
            log(f"→ Programme : essai {nom_src}…")
            d.matchs = f()
            d.sources.append(f"Programme : {nom_src}")
            break
        except Exception as e:  # noqa: BLE001
            d.avertissements.append(f"Programme indisponible via {nom_src} ({type(e).__name__}).")
    if not d.matchs and not any(s.startswith("Programme") for s in d.sources):
        d.avertissements.append("Programme des matchs : non disponible (toutes les sources ont échoué).")
        return d
    if not d.matchs:
        return d

    # 2. Journal des matchs joués
    for nom_src, f in [("nba_api (LeagueGameFinder)", lambda: journal_nba_api(date, saison)),
                       ("Basketball-Reference (résultats)", lambda: journal_bref(date))]:
        try:
            log(f"→ Résultats de la saison : essai {nom_src}…")
            d.journal = f()
            d.sources.append(f"Résultats : {nom_src}")
            break
        except Exception as e:  # noqa: BLE001
            d.avertissements.append(f"Résultats indisponibles via {nom_src} ({type(e).__name__}).")

    # 3. Ratings saison et 10 derniers matchs
    try:
        log("→ Ratings saison : nba_api…")
        d.ratings_saison = ratings_nba_api(date, saison, 0)
        log("→ Ratings 10 derniers matchs : nba_api…")
        d.ratings_l10 = ratings_nba_api(date, saison, 10)
        d.sources.append("Ratings : nba_api (LeagueDashTeamStats, Advanced)")
    except Exception as e:  # noqa: BLE001
        d.avertissements.append(f"Ratings nba_api indisponibles ({type(e).__name__}).")
        try:
            log("→ Ratings saison : Basketball-Reference…")
            d.ratings_saison = ratings_bref(date)
            d.sources.append("Ratings saison : Basketball-Reference (10 derniers matchs non disponibles)")
        except Exception as e2:  # noqa: BLE001
            d.avertissements.append(f"Ratings Basketball-Reference indisponibles ({type(e2).__name__}).")
    return d
