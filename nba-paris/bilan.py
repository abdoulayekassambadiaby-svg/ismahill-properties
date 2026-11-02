#!/usr/bin/env python3
"""ROI et taux de réussite à partir de historique.csv, par type de marché.

Colonnes : date,match,marche,selection,cote,mise,resultat
  - mise : montant (ex. 2000) ou pourcentage de bankroll (ex. 1.5%) — ne mélangez pas les deux
  - resultat : gagne | perdu | rembourse | en_attente
Usage : python bilan.py [historique.csv]
"""
from __future__ import annotations

import csv
import sys
from collections import defaultdict
from pathlib import Path

from nbaparis.equipes import normaliser

RES = {"gagne": "G", "gagné": "G", "g": "G", "win": "G", "w": "G",
       "perdu": "P", "p": "P", "loss": "P", "l": "P",
       "rembourse": "R", "remboursé": "R", "nul": "R", "push": "R", "annule": "R", "annulé": "R"}


def nombre(x):
    return float(str(x).strip().replace("%", "").replace(",", ".").replace(" ", ""))


def calculer(chemin: Path):
    stats = defaultdict(lambda: {"n": 0, "g": 0, "p": 0, "r": 0, "mise": 0.0, "profit": 0.0})
    en_attente, erreurs, unite = 0, [], ""
    texte = chemin.read_text(encoding="utf-8-sig")
    lignes = [l for l in texte.splitlines() if l.strip() and not l.lstrip().startswith("#")]
    if len(lignes) <= 1:
        return stats, en_attente, erreurs, unite
    sep = ";" if lignes[0].count(";") > lignes[0].count(",") else ","
    for i, r in enumerate(csv.DictReader(lignes, delimiter=sep), start=2):
        r = {normaliser(k or ""): (v or "").strip() for k, v in r.items()}
        res = RES.get(normaliser(r.get("resultat") or r.get("résultat") or ""))
        if not res:
            en_attente += 1
            continue
        try:
            cote, mise = nombre(r["cote"]), nombre(r["mise"])
        except (KeyError, ValueError):
            erreurs.append(f"ligne {i} ignorée (cote ou mise illisible)")
            continue
        if "%" in r.get("mise", ""):
            unite = " % bankroll"
        marche = normaliser(r.get("marche") or r.get("marché") or "autre") or "autre"
        for cle in (marche, "TOTAL"):
            s = stats[cle]
            s["n"] += 1
            s["mise"] += mise
            if res == "G":
                s["g"] += 1
                s["profit"] += mise * (cote - 1)
            elif res == "P":
                s["p"] += 1
                s["profit"] -= mise
            else:
                s["r"] += 1
    return stats, en_attente, erreurs, unite


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    chemin = Path(argv[0]) if argv else Path(__file__).resolve().parent / "historique.csv"
    if not chemin.exists():
        print(f"{chemin} introuvable.")
        return 1
    stats, attente, erreurs, unite = calculer(chemin)
    if not stats:
        print("Aucun pari réglé dans l'historique pour l'instant.")
    else:
        print(f"{'Marché':<12}{'Paris':>6}{'G-P-R':>11}{'Réussite':>10}{'Misé':>12}{'Profit':>12}{'ROI':>9}")
        for cle in sorted(k for k in stats if k != "TOTAL") + ["TOTAL"]:
            s = stats[cle]
            decides = s["g"] + s["p"]
            reussite = f"{100 * s['g'] / decides:.1f} %" if decides else "n.d."
            roi = f"{100 * s['profit'] / s['mise']:+.1f} %" if s["mise"] else "n.d."
            print(f"{cle:<12}{s['n']:>6}{s['g']:>4}-{s['p']}-{s['r']:<4}{reussite:>10}"
                  f"{s['mise']:>12.2f}{s['profit']:>+12.2f}{roi:>9}")
        if unite:
            print(f"(montants exprimés en{unite})")
        print("Réussite = gagnés / (gagnés + perdus) ; ROI = profit / total misé.")
    if attente:
        print(f"{attente} pari(s) en attente de résultat.")
    for e in erreurs:
        print("⚠️", e)
    return 0


if __name__ == "__main__":
    sys.exit(main())
