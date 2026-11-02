# nba-paris — rapport quotidien d'aide à la décision (paris NBA)

Outil Python qui, pour une date de matchs (heure côte Est US), récupère le programme, les bilans,
les ratings, la fatigue, les confrontations et les blessures, calcule une estimation maison
(probabilité, spread, total), compare avec vos cotes et écrit `rapports/paris_AAAA-MM-JJ.md`.

## Installation (une seule fois)

```bash
cd nba-paris
python -m venv .venv
source .venv/bin/activate        # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```

## Utilisation quotidienne

1. Remplir `cotes.csv` (voir `cotes_exemple.csv`, dont les cotes sont **fictives**) :
   `match,marche,selection,cote` avec `marche` = `vainqueur`, `handicap` ou `total`.
   Exemples de sélections : `Celtics`, `BOS -4.5`, `Magic +4.5`, `Over 221.5`, `Under 221.5`.
   Fournissez **les deux issues** d'un marché pour que la marge du bookmaker soit retirée.
2. `python paris.py 2026-11-02` (la date est celle des matchs **heure côte Est** : nuit du 2 au 3 à Abidjan).
3. `python paris.py 2026-11-02 --enregistrer` ajoute les sélections recommandées à `historique.csv`.
4. Après les matchs, mettre `resultat` à `gagne` / `perdu` / `rembourse`, puis `python bilan.py`.

## Sources (par ordre de priorité)

| Donnée | Principale | Secours |
|---|---|---|
| Programme | nba_api `ScheduleLeagueV2` | ESPN scoreboard, puis Basketball-Reference |
| Résultats (bilans, forme, fatigue, H2H) | nba_api `LeagueGameFinder` | Basketball-Reference |
| ORtg / DRtg / Net / pace (saison et 10 derniers) | nba_api `LeagueDashTeamStats` | Basketball-Reference (saison seulement) |
| Blessures | NBA Injury Report officiel (PDF) | ESPN |
| Impact des absents | nba_api `TeamPlayerOnOffSummary` | aucun : « non disponible » |

Toute donnée introuvable est écrite « non disponible » et fait baisser le niveau de confiance.
stats.nba.com bloque parfois les IP de serveurs cloud ; depuis une connexion domestique, ça fonctionne normalement.

## Méthode (voir `nbaparis/modele.py`, tous les paramètres sont en tête de fichier)

1. Ratings 60 % saison / 40 % 10 derniers ; possessions = pace × pace / pace ligue ; points = possessions × (ORtg + DRtg adverse − ORtg ligue) / 100.
2. Domicile +2,5 ; back-to-back −1,5 ; 3+ matchs en 5 jours −1 ; voyage > 1 500 km −0,5 ; absents pondérés par leur on/off (Out 100 %, Doubtful 75 %, Questionable 50 %).
3. Loi normale (σ = 12 pts écart, 18 pts total). Value si proba maison − proba book sans marge > 5 points.

Règles de mise : paris simples uniquement, 3 max, 1 par match, confiance moyenne ou élevée,
1 à 2 % de bankroll chacun, 5 % maximum sur la soirée. Sans value : ne pas parier.

## Tests

```bash
python -m unittest discover tests
```
