#!/usr/bin/env python3
"""Rapport quotidien d'aide à la décision pour les paris NBA.

Usage :
    python paris.py 2026-11-02                 # date des matchs, heure côte Est (US)
    python paris.py 2026-11-02 --cotes mes_cotes.csv
    python paris.py 2026-11-02 --enregistrer   # ajoute les sélections à historique.csv (en_attente)
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import sys
from pathlib import Path

from nbaparis import blessures, cotes, donnees, modele
from nbaparis import rapport as rp

ICI = Path(__file__).resolve().parent


def analyser(date: dt.date, chemin_cotes: Path, verbeux: bool = True):
    d = donnees.collecter(date, verbeux)
    sources, avert = list(d.sources), list(d.avertissements)
    if not d.matchs:
        return [], sources, avert, 0, []

    print(f"✔ {len(d.matchs)} match(s) au programme du {date:%d/%m/%Y} (heure ET) :")
    for m in d.matchs:
        print(f"   {m.exterieur} @ {m.domicile}   {rp._heure(m)}")

    print("→ Blessures (rapport officiel NBA, ESPN)…")
    bl, s_bl, a_bl = blessures.collecter(date, d.saison)
    sources += s_bl
    avert += a_bl
    blessures_ok = bool(s_bl)

    ligue = modele.moyenne_ligue(d.ratings_saison)
    if d.ratings_saison and not ligue:
        avert.append("Moyennes de ligue non calculables (moins de 20 équipes dans les ratings).")

    cache_onoff: dict[str, dict | None] = {}

    def impacts(s):
        if s not in cache_onoff:
            try:
                cache_onoff[s] = donnees.impacts_on_off(s, date, d.saison)
                src = "Impact des absents : nba_api (on/off)"
            except Exception:  # noqa: BLE001
                try:
                    cache_onoff[s] = donnees.impacts_bref(s, date)
                    src = "Impact des absents : Basketball-Reference (BPM)"
                except Exception as e:  # noqa: BLE001
                    cache_onoff[s] = None
                    src = None
                    avert.append(f"Impact des absents {s} non disponible ({type(e).__name__}).")
            if src and src not in sources:
                sources.append(src)
        return cache_onoff[s]

    analyses = []
    for m in d.matchs:
        dom, ext = m.domicile, m.exterieur
        print(f"→ Analyse {ext} @ {dom}…")
        c_dom = modele.contexte(d.journal, dom, date, dom)
        c_ext = modele.contexte(d.journal, ext, date, dom)
        f_dom, r_fdom = modele.malus_fatigue(c_dom)
        f_ext, r_fext = modele.malus_fatigue(c_ext)
        b_dom = bl.get(dom, []) if blessures_ok else None
        b_ext = bl.get(ext, []) if blessures_ok else None

        details, pen = [], {}
        incertains_cles = 0
        for s, liste in ((dom, b_dom), (ext, b_ext)):
            if liste is None:
                pen[s] = None
                continue
            a_mesurer = [b for b in liste if b["statut"] in modele.POIDS_STATUT
                         and modele.POIDS_STATUT[b["statut"]] > 0]
            imp = impacts(s) if a_mesurer else {}
            mj = (d.ratings_saison.get(s) or {}).get("mj")
            pen[s], det = modele.penalite_absences(a_mesurer, imp, mj)
            details += det
            if imp:
                for b in a_mesurer:
                    i = imp.get(b["cle"])
                    if b["statut"] in ("QUESTIONABLE", "DOUBTFUL") and i and i["mj"] \
                            and i["min_total"] / i["mj"] >= 20:
                        incertains_cles += 1

        mj = lambda s: (d.ratings_saison.get(s) or {}).get("mj")  # noqa: E731
        r_dom = modele.regresser(modele.melange(d.ratings_saison.get(dom), d.ratings_l10.get(dom)), ligue, mj(dom))
        r_ext = modele.regresser(modele.melange(d.ratings_saison.get(ext), d.ratings_l10.get(ext)), ligue, mj(ext))
        proj = modele.projeter(r_dom, r_ext, ligue, f_dom, f_ext, pen.get(dom), pen.get(ext))
        mjs = [x.get("mj") for x in (d.ratings_saison.get(dom), d.ratings_saison.get(ext)) if x]
        conf, raisons = modele.confiance(
            proj, c_dom, c_ext, min(mjs) if len(mjs) == 2 else None, incertains_cles,
            blessures_ok, bool(d.ratings_l10.get(dom) and d.ratings_l10.get(ext)))
        analyses.append(rp.AnalyseMatch(
            m, c_dom, c_ext, d.ratings_saison.get(dom), d.ratings_saison.get(ext),
            d.ratings_l10.get(dom), d.ratings_l10.get(ext),
            modele.confrontations(d.journal, dom, ext), b_dom, b_ext, details, r_fdom, r_fext,
            proj, conf, raisons))

    sels, err = cotes.lire(chemin_cotes)
    projections = {a.cle: a.proj for a in analyses}
    cotes.analyser(sels, d.matchs, projections)
    for s in sels:
        if s.match_key is None:
            err.append(f"Cote ignorée « {s.match_brut} / {s.selection} » : {s.note}.")
        elif s.p_sans_marge is None and s.note:
            err.append(f"Cote ignorée « {s.match_brut} / {s.selection} » : {s.note}.")
    for a in analyses:
        a.selections = [s for s in sels if s.match_key == a.cle and s.p_sans_marge is not None]
    return analyses, sources, avert, len(sels), err


def enregistrer(date: dt.date, choix, chemin: Path):
    nouveau = not chemin.exists() or chemin.stat().st_size == 0
    with chemin.open("a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if nouveau:
            w.writerow(["date", "match", "marche", "selection", "cote", "mise", "resultat"])
        for a, s, mise in choix:
            w.writerow([date.isoformat(), f"{a.match.exterieur} @ {a.match.domicile}", s.marche,
                        s.selection, f"{s.cote:.2f}", f"{mise:.1f}%", "en_attente"])


def main(argv=None):
    ap = argparse.ArgumentParser(description="Rapport quotidien de paris NBA (en français).")
    ap.add_argument("date", help="date des matchs, heure côte Est (AAAA-MM-JJ)")
    ap.add_argument("--cotes", default=str(ICI / "cotes.csv"), help="fichier de cotes (défaut : cotes.csv)")
    ap.add_argument("--sortie", default=str(ICI / "rapports"), help="dossier du rapport")
    ap.add_argument("--enregistrer", action="store_true",
                    help="ajoute les sélections recommandées à historique.csv (statut en_attente)")
    args = ap.parse_args(argv)
    try:
        date = dt.date.fromisoformat(args.date)
    except ValueError:
        ap.error("date attendue au format AAAA-MM-JJ, ex. 2026-11-02")

    analyses, sources, avert, nb_cotes, err = analyser(date, Path(args.cotes))
    texte = rp.rediger(date, analyses, sources, avert, nb_cotes, err)
    sortie = Path(args.sortie)
    sortie.mkdir(parents=True, exist_ok=True)
    fichier = sortie / f"paris_{date.isoformat()}.md"
    fichier.write_text(texte, encoding="utf-8")
    print(f"\n✔ Rapport écrit : {fichier}")
    for a in avert:
        print(f"  ⚠️ {a}")
    if args.enregistrer:
        choix, _ = rp.choisir(analyses)
        if choix:
            enregistrer(date, choix, ICI / "historique.csv")
            print(f"✔ {len(choix)} sélection(s) ajoutée(s) à historique.csv (à compléter après les matchs).")
        else:
            print("Aucune sélection à enregistrer.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
