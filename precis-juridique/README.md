# Précis de formation juridique approfondie

Collection de précis universitaires — **droit ivoirien, droit OHADA et droit comparé** — conçue pour conduire le lecteur des fondamentaux jusqu'au niveau de la recherche.

## Contenu

| Fichier PDF | Contenu | État |
|---|---|---|
| `pdf/00_Document-cadre_de_la_collection.pdf` | Architecture de la collection, chartes scientifique, de fiabilité et éditoriale, plans détaillés des 12 tomes | Version 1.1 |
| `pdf/Tome-01_Theorie-generale-et-fondements-du-droit.pdf` | Tome 1 — Théorie générale et fondements du droit (12 chapitres) | Version 1.1 |
| `pdf/Tome-02_Methodologie-juridique-et-langage-du-juriste.pdf` | Tome 2 — Méthodologie juridique et langage du juriste (15 chapitres) | Version 1.0 |
| `pdf/Tome-03_Droit-constitutionnel.pdf` | Tome 3 — Droit constitutionnel (17 chapitres) | Version 1.1 |
| `pdf/Tome-04_Droit-administratif.pdf` | Tome 4 — Droit administratif (15 chapitres) | Version 1.0 |
| `pdf/Tome-05_Droit-civil.pdf` | Tome 5 — Droit civil (20 chapitres, 5 livres) | Version 1.0 |
| `pdf/Tome-06_Droit-des-affaires-OHADA.pdf` | Tome 6 — Droit commercial et droit des affaires OHADA (20 chapitres, 8 parties) | Version 1.0 |

Les tomes 7 à 12 sont planifiés dans le document-cadre et seront rédigés progressivement (prochain tome : Tome 7, Droit pénal et sciences criminelles).

## Journal des versions

- **Tome 6, version 1.0** — OHADA et CCJA, droit commercial général (AUDCG 2010), sociétés et GIE (AUSCGIE 2014), coopératives, sûretés de l'entreprise, recouvrement et voies d'exécution (AUPSRVE révisé 2023), procédures collectives (AUPCAP 2015), arbitrage et médiation (2017), droit comptable (AUDCIF 2017), concurrence, consommation, investissements, banque et instruments de paiement ; annexe des actes uniformes ; fiche de vérification.
- **Document-cadre (mise à jour)** — Tome 6 rédigé ; Tome 7 prochain tome.
- **Tome 5, version 1.0** — personnes et famille (lois de 2018 à 2022 : état civil, nom, minorité, mariage, divorce, filiation, adoption), biens et régime foncier (immatriculation, ACD, certificat foncier), obligations (Code civil applicable en Côte d'Ivoire, Code CIMA), successions, libéralités et régimes matrimoniaux, contrats spéciaux et sûretés (AUS 2010) ; annexe des réformes et abrogations ; fiche de vérification.
- **Document-cadre, version 1.1 (mise à jour)** — Tome 5 rédigé ; Tome 6 prochain tome.
- **Tome 4, version 1.0** — fondements et légalité, organisation administrative, actes, contrats et commande publique, police, service public, biens et agents publics, contentieux administratif (Conseil d'État, recours préalable), responsabilité, contrôles non juridictionnels ; annexe des grands arrêts français et ivoiriens.
- **Tome 3, version 1.1** — approfondissement des dix-sept chapitres (36 ajouts : analyses, jurisprudences, exercices corrigés), chronologie constitutionnelle en annexe, fiche de vérification complétée.
- **Tome 3, version 1.0** — théorie de l'État et de la Constitution, régimes politiques, droit constitutionnel ivoirien, droits fondamentaux, droit électoral, internationalisation ; texte consolidé de la Constitution non consulté directement (références recoupées, voir la fiche de vérification).
- **Tome 2, version 1.0** — rédaction complète : langage du droit, raisonnement juridique, exercices juridiques, recherche et rédaction professionnelle.
- **Tome 1, version 1.1** — signalement de la révision de l'AUPSRVE (acte révisé du 17 octobre 2023, en vigueur le 16 février 2024) aux chapitres 1, 6 et 12 et dans la fiche de vérification ; correction de la mise en page de la liste des abréviations ; quatrième de couverture placée en page paire.
- **Document-cadre, version 1.1** — mise à jour de l'état d'avancement ; signalement de la révision de l'AUPSRVE dans le plan du Tome 6.

## Organisation du dépôt

```
precis-juridique/
├── outils/                 chaîne de fabrication (Pandoc + WeasyPrint)
│   ├── construire.py       script de composition des volumes
│   ├── style.css           feuille de style (format 17 × 24 cm)
│   ├── filtres/notes.lua   filtre Pandoc (notes de bas de page)
│   └── polices/            EB Garamond, Cormorant Garamond, Source Sans 3 (licence SIL OFL)
├── sources/
│   ├── 00-document-cadre/  sources Markdown du document-cadre
│   ├── tome-01/            sources Markdown du Tome 1
│   ├── tome-02/            sources Markdown du Tome 2
│   ├── tome-03/            sources Markdown du Tome 3
│   ├── tome-04/            sources Markdown du Tome 4
│   ├── tome-05/            sources Markdown du Tome 5
│   └── tome-06/            sources Markdown du Tome 6
└── pdf/                    volumes composés
```

## Reconstruire les PDF

Prérequis : `pandoc` (≥ 3) et `weasyprint` (≥ 60, `pip install weasyprint`).

```bash
python3 outils/construire.py --tous              # tous les volumes
python3 outils/construire.py sources/tome-01     # un seul volume
```

## Conventions de rédaction (Markdown Pandoc)

- `# Titre {.partie num="Première partie"}` — page de partie ; `# Titre {.chapitre num="Chapitre 1"}` — chapitre.
- `^[...]` — note de bas de page.
- Encadrés : `::: {.definition titre="..."}`, `::: retenir`, `::: {.comparaison titre="..."}`, `::: vigilance`, `::: {.methode titre="..."}`, `::: {.jurisprudence titre="..."}`, `::: {.debat titre="..."}`, `::: {.proposition titre="..."}`, `:::: {.cas titre="..."}` avec `::: corrige`, `::: synthese`, `::: questions`.
- Signalétique : `[DP]{.dp}` droit positif, `[JP]{.jp}` jurisprudence, `[DOC]{.doc}` doctrine, `[PP]{.pp}` proposition personnelle, `[MOD]{.mod}` modifié, `[ABR]{.abr}` abrogé, `[V]{.ver}` à confirmer.

## Fiabilité

Aucune référence n'est inventée. Chaque tome comporte une fiche de vérification indiquant, pour les textes et décisions ivoiriens et régionaux, s'ils ont été **vérifiés**, **recoupés** ou restent **à confirmer**. Voir la charte de fiabilité dans le document-cadre.
