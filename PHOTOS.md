# Photos provisoires à remplacer

Toutes les photos du site sont **provisoires**. Elles viennent d'[Unsplash](https://unsplash.com/license),
une banque d'images libres de droits, gratuites, utilisables commercialement et sans attribution obligatoire.
Elles sont chargées directement depuis Unsplash, en taille réduite et au format WebP/AVIF.

> ⚠️ Les photos n'ont pas pu être affichées pendant les tests (l'environnement de développement bloquait
> Unsplash). Si l'une d'elles ne s'affiche pas en ligne, le site montre à la place un fond bleu marine avec
> la maison du logo : rien n'est cassé. Remplacez-la simplement par une de vos photos.

## Comment remplacer une photo

1. Préparez votre photo en **JPG**, environ **1600 px de large** et **moins de 300 Ko**.
   Pour l'alléger gratuitement : https://squoosh.app (qualité 70-75).
2. Donnez-lui un nom simple, sans espaces ni accents : `villa-cite-feh-salon.jpg`.
3. Déposez-la :
   - dans `public/images/` pour les photos des pages ;
   - dans `public/biens/` pour les photos des biens.
4. Dans le fichier indiqué ci-dessous, remplacez l'adresse `https://images.unsplash.com/…`
   par `/images/votre-photo.jpg` (ou `/biens/votre-photo.jpg`).

## Photos des pages (fichier `data/site.ts`)

| Emplacement | Utilisation | Photo Unsplash actuelle |
|---|---|---|
| `photos.accueil` | Grand bandeau de l'accueil | https://images.unsplash.com/photo-1600596542815-ffad4c1539a9 |
| `photos.proprietaires` | Bandeau de la page Propriétaires | https://images.unsplash.com/photo-1560518883-ce09059eeffa |
| `photos.services` | Bandeau de la page Services | https://images.unsplash.com/photo-1600585154340-be6161a56a0c |
| `photos.aPropos` | Bandeau de la page À propos | https://images.unsplash.com/photo-1600607687939-ce8a6c25118c |
| `photos.conseil` | Accueil (« Pourquoi nous choisir ») et À propos | https://images.unsplash.com/photo-1450101499163-c8848c66ca85 |
| `photos.contact` | Bandeaux des pages Nos biens et Contact | https://images.unsplash.com/photo-1512917774080-9991f1c4c750 |
| Service « Vente et achat » | Page Services | https://images.unsplash.com/photo-1564013799919-ab600027ffc6 |
| Service « Location » | Page Services | https://images.unsplash.com/photo-1522708323590-d24dbb6b0267 |
| Service « Gestion immobilière » | Page Services | https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3 |
| Service « Conseils » | Page Services | https://images.unsplash.com/photo-1556761175-5973dc0f32e7 |
| Service « Assistance projets » | Page Services | https://images.unsplash.com/photo-1500382017468-9049fed747ef |

💡 L'idéal est d'utiliser vos propres photos : façade de l'agence, Bingerville, vos vrais biens. Elles inspirent bien plus confiance qu'une photo de banque d'images.

## Photos des biens d'EXEMPLE (fichier `data/biens.ts`)

Ces biens sont fictifs : supprimez-les quand vous ajoutez vos vrais biens.

| Bien d'exemple | Photos |
|---|---|
| Villa duplex 5 pièces (vente) | photo-1613490493576-7fde63acd811, photo-1600210492486-724fe5c67fb0, photo-1556912173-3bb406ef7e77, photo-1522771739844-6a9f6d5f14af |
| Appartement 3 pièces (location) | photo-1522708323590-d24dbb6b0267, photo-1502672260266-1c1ef2d93688, photo-1600566753190-17f0baa2a6c3 |
| Terrain 500 m² (terrain) | photo-1500382017468-9049fed747ef, photo-1570129477492-45c003edd2be |

(adresse complète : `https://images.unsplash.com/` + identifiant)

## Images de la marque (déjà prêtes, à ne pas remplacer)

- `public/logo.png` : logo détouré (fond transparent), créé à partir de `logo.jpg`.
- `public/logo-mark.png/.webp` : logo allégé sans le slogan, pour l'en-tête.
- `public/logo-mark-white.*` et `public/logo-white.png` : versions pour les fonds bleu marine.
- `app/icon.png`, `app/apple-icon.png` et `app/favicon.ico` : favicon tirée de la maison rose du « A ».
- `public/og.jpg` : image d'aperçu affichée quand on partage le site sur WhatsApp ou Facebook.

Pour les régénérer après une modification de `logo.jpg` :
`python3 scripts/logo.py logo.jpg` puis `python3 scripts/og.py chemin/vers/Montserrat.ttf`.
