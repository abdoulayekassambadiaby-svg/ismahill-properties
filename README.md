# ISMAHILL PROPERTIES — site vitrine

*L'excellence au service de votre patrimoine*

Site de l'agence immobilière ISMAHILL PROPERTIES (Bingerville, Côte d'Ivoire).
Technologies : Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion.
Le site est **100 % statique** : rapide, sans serveur à entretenir, et hébergeable gratuitement.

---

## 1. Ce que vous modifierez le plus souvent

| Je veux… | Fichier |
|---|---|
| Changer un texte, un numéro, l'e-mail, les horaires, les services | `data/site.ts` |
| Ajouter, modifier ou retirer un bien | `data/biens.ts` |
| Remplacer les photos | voir `PHOTOS.md` |
| Compléter les mentions légales | `data/site.ts` (section `mentionsLegales`) |
| Modifier les textes et engagements du service « Vérification » | `data/verification.ts` |
| Publier le dossier foncier d'un terrain | `data/biens.ts` (champ `dossier`) — voir § 7 |

Cherchez **`[À COMPLÉTER]`** dans ces fichiers : ce sont les informations encore manquantes
(horaires, histoire de l'agence, RCCM, quartiers des biens…).

### Ajouter un bien en 3 minutes

1. Déposez les photos dans `public/biens/` (JPG, ~1600 px de large, < 300 Ko).
2. Ouvrez `data/biens.ts`, copiez un bloc `{ … },` existant et collez-le **en haut** de la liste.
3. Modifiez les valeurs :

```ts
{
  slug: "villa-4-pieces-bingerville-cite-feh",   // unique, sans accents ni espaces
  titre: "Villa 4 pièces avec jardin",
  type: "location",                              // "location" | "vente" | "terrain"
  commune: "Bingerville",
  quartier: "Cité Féh",
  prix: 450000,                                  // en FCFA, sans espaces
  periode: "mois",                               // seulement pour une location
  surface: 250,
  pieces: 4,
  chambres: 3,
  sallesDeBain: 3,
  description: "Belle villa…",
  caracteristiques: ["Jardin", "Parking", "Gardien"],
  photos: ["/biens/villa-feh-1.jpg", "/biens/villa-feh-2.jpg"],
  disponible: true,                              // false = affiche « Loué » / « Vendu »
  date: "2026-11-05",                            // date de publication
},
```

4. Supprimez les 3 biens d'exemple (ceux qui ont `exemple: true`).
5. Publiez (voir § 3) : la fiche, les filtres, le plan du site (sitemap) et les liens WhatsApp se mettent à jour tout seuls.

---

## 2. Lancer le site sur votre ordinateur (facultatif)

Prérequis : [Node.js](https://nodejs.org) version 20 ou plus.

```bash
npm install
```

```bash
npm run dev
```

Puis ouvrez http://localhost:3000. Pour tester la version finale : `npm run build` puis `npm start`.

---

## 3. Mettre le site en ligne gratuitement sur Vercel

> ℹ️ **À savoir avant de choisir** : l'offre gratuite de Vercel (« Hobby ») est prévue pour un
> usage **personnel et non commercial**. Pour le site d'une entreprise, Vercel demande en principe
> l'offre Pro (payante). Comme ce site est statique, il fonctionne aussi tel quel sur **Netlify**
> ou **Cloudflare Pages**, dont les offres gratuites autorisent l'usage commercial (voir § 6).
> La démarche ci-dessous est la même dans l'esprit.

### Étape 1 — Mettre le code sur GitHub

1. Créez un compte gratuit sur https://github.com.
2. Cliquez sur **New repository** (bouton vert « New »), nommez-le `ismahill-properties`,
   choisissez **Private**, puis **Create repository**.
3. Sur la page du dépôt vide, cliquez sur **uploading an existing file**.
4. Glissez-déposez **tout le contenu** du dossier du site, **sauf** les dossiers `node_modules`,
   `.next` et `out` s'ils existent. Cliquez sur **Commit changes**.

   *(Alternative plus confortable : l'application gratuite [GitHub Desktop](https://desktop.github.com).)*

### Étape 2 — Créer le site sur Vercel

1. Allez sur https://vercel.com/signup et choisissez **Continue with GitHub**.
2. Cliquez sur **Add New… → Project**.
3. Dans la liste, trouvez `ismahill-properties` et cliquez sur **Import**.
   (S'il n'apparaît pas : **Adjust GitHub App Permissions** et autorisez ce dépôt.)
4. Vercel détecte **Next.js** automatiquement. Ne changez rien et cliquez sur **Deploy**.
5. Après environ 1 minute, votre site est en ligne à une adresse du type
   `https://ismahill-properties.vercel.app`. 🎉

### Étape 3 — Vérifier le site en ligne

Sur votre téléphone, ouvrez l'adresse et vérifiez :

- que les photos s'affichent ;
- que le bouton WhatsApp ouvre bien la conversation avec le **+225 07 79 99 56 73** ;
- que le formulaire de la page **Propriétaires** ouvre WhatsApp avec le message pré-rempli ;
- que la carte s'affiche sur la page **Contact** ;
- l'aperçu de partage : envoyez le lien dans une discussion WhatsApp, la carte avec le logo doit apparaître.
  (Pour Facebook : https://developers.facebook.com/tools/debug/ → collez l'adresse → **Debug**.)

### Étape 4 — Brancher votre nom de domaine

1. Dans Vercel, ouvrez le projet → **Settings → Domains**.
2. Tapez votre domaine, par exemple `ismahillproperties.com`, puis **Add**.
   Acceptez la proposition d'ajouter aussi `www.ismahillproperties.com` (avec redirection).
3. Vercel affiche les **enregistrements DNS** à créer. Ils ressemblent à ceci
   (**recopiez toujours les valeurs exactes affichées par Vercel**) :

   | Type | Nom / Hôte | Valeur |
   |---|---|---|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

4. Connectez-vous chez le fournisseur où vous avez acheté le domaine (OVH, GoDaddy, Namecheap,
   Hostinger, etc.), section **DNS** ou **Zone DNS** :
   - supprimez les anciens enregistrements `A` sur `@` et `CNAME` sur `www` s'il y en a ;
   - ajoutez les deux enregistrements ci-dessus ;
   - enregistrez.
5. Revenez sur Vercel : au bout de quelques minutes (parfois jusqu'à 24 h), le domaine passe en
   **Valid Configuration**. Le certificat HTTPS (cadenas) est créé automatiquement et gratuitement.

### Étape 5 — Indiquer l'adresse définitive au site

Le site détecte automatiquement son adresse sur Vercel. Pour être certain que Google et les
aperçus WhatsApp utilisent votre domaine :

1. Dans `data/site.ts`, remplacez la ligne `url: "https://www.ismahillproperties.com"` par votre adresse exacte ;
2. ou, sur Vercel : **Settings → Environment Variables** → nom `NEXT_PUBLIC_SITE_URL`,
   valeur `https://www.votre-domaine.com` → **Save**, puis **Deployments → ⋯ → Redeploy**.

### Mettre à jour le site ensuite

À chaque modification d'un fichier sur GitHub (bouton ✏️ sur `data/biens.ts`, puis **Commit changes**),
Vercel republie le site **automatiquement** en environ 1 minute. Pour ajouter des photos :
ouvrez le dossier `public/biens` sur GitHub → **Add file → Upload files**.

---

## 4. Être trouvé sur Google (fortement recommandé)

1. **Google Business Profile** (gratuit, le plus efficace en local) : https://business.google.com.
   Créez la fiche « ISMAHILL PROPERTIES », catégorie *Agence immobilière*, adresse Bingerville,
   ajoutez le lien du site, le numéro, des photos de l'agence, et demandez des avis à vos clients.
2. **Google Search Console** : https://search.google.com/search-console → ajoutez votre domaine →
   **Sitemaps** → saisissez `sitemap.xml` → **Envoyer**.
3. Ajoutez le lien du site sur vos pages Facebook, Instagram et TikTok, et dans votre profil
   WhatsApp Business. Pensez aussi à renseigner `reseaux` dans `data/site.ts`.

Déjà en place dans le site : titres et descriptions optimisés pour chaque page (« agence immobilière
Bingerville », « gestion locative Abidjan », « terrain à vendre Bingerville »), données structurées
`RealEstateAgent`, `sitemap.xml`, `robots.txt`, aperçu Open Graph et favicon.

---

## 5. Organisation du projet

```
app/                 pages du site (accueil, services, proprietaires, biens, a-propos, contact…)
  biens/[slug]/      fiche détaillée d'un bien (générée pour chaque bien de data/biens.ts)
  sitemap.ts         plan du site pour Google
  icon.png …         favicon
components/          éléments réutilisables (en-tête, pied de page, cartes, galerie, formulaire…)
data/site.ts         ✏️ textes, coordonnées, services
data/biens.ts        ✏️ liste des biens
lib/utils.ts         outils (liens WhatsApp, format des prix en FCFA, images)
public/              logo, image de partage (og.jpg), vos photos (images/, biens/)
scripts/             génération du logo détouré, de la favicon et de og.jpg
PHOTOS.md            liste des photos provisoires à remplacer
```

## 6. Hébergeurs alternatifs (gratuits, usage commercial autorisé)

Le site produit un dossier `out/` de pages HTML statiques.

- **Netlify** : https://app.netlify.com → *Add new site → Import from GitHub* → commande de build
  `npm run build`, dossier de publication `out` → *Deploy*. Domaine : *Domain management*.
- **Cloudflare Pages** : https://dash.cloudflare.com → *Workers & Pages → Create → Pages → Connect to Git*
  → preset *Next.js (Static HTML Export)*, commande `npm run build`, dossier `out`.

---

## 7. Service « Vérifiez avant d'acheter » (diaspora)

La page **/verification/** et le bloc **« Dossier foncier vérifiable »** des fiches terrain permettent à un
acheteur à l'étranger de contrôler les documents d'une parcelle depuis chez lui :

- le **dossier foncier** de chaque terrain : références de l'ACD, documents, contrôles effectués (avec dates),
  position GPS sur une carte satellite ;
- l'**outil de vérification** : le client dépose le fichier reçu, son navigateur calcule l'empreinte numérique
  (SHA-256) et la compare au registre publié. Un seul octet modifié = « Document non reconnu ».
  Le fichier ne quitte jamais l'appareil du client ;
- la **recherche par référence** (ex. `ISM-T-2026-001`) : un client démarché par un intermédiaire vérifie que le
  dossier existe bien chez vous.

> ⚠️ Avant la mise en ligne, relisez les engagements de `data/verification.ts` : ne gardez que ce que l'agence
> applique réellement. Complétez aussi les liens officiels laissés vides (`lien: ""`).

### Publier le dossier d'un terrain

1. **Extrait masqué** (publié) : scannez l'ACD, masquez les données personnelles du titulaire (nom, n° de pièce
   d'identité, adresse), exportez en PDF et déposez-le dans `public/dossiers/` (nom sans espaces ni accents).
   Son empreinte est calculée automatiquement.
2. **Copie complète** (envoyée aux clients, jamais publiée) : préparez le PDF **définitif**, puis :

   ```bash
   npm run empreinte -- "chemin/vers/ACD complet.pdf"
   ```

   Copiez la ligne `empreinte: "…"` affichée dans le document correspondant de `data/biens.ts`.
3. Dans `data/biens.ts`, ajoutez le bloc `dossier: { … }` au terrain (copiez celui du terrain d'exemple) :
   référence unique, références de l'ACD, documents, contrôles (`"fait"`, `"en-cours"` ou `"votre-notaire"`),
   position GPS et date de mise à jour.
4. Publiez. Le registre se reconstruit tout seul ; le site refuse de se construire si un fichier manque, si une
   empreinte est mal copiée ou si une référence est utilisée deux fois.

**Position GPS** : sur place, ouvrez Google Maps, appui long sur la parcelle → les coordonnées s'affichent
(ex. `5.355300, -3.884700`) ; recopiez-les dans `position`.

**Règles d'or pour que la vérification fonctionne :**

- envoyez toujours **le même fichier** que celui dont vous avez publié l'empreinte : le ré-enregistrer, le
  compresser ou le re-scanner change l'empreinte ;
- sur WhatsApp, envoyez-le en **« Document »**, jamais en « Photo » (WhatsApp compresse les photos) ;
- si un document change (nouvel état foncier, par exemple), ajoutez la nouvelle empreinte et mettez à jour
  `misAJour`.

Supprimez le terrain d'exemple et le fichier `public/dossiers/exemple-acd-extrait.pdf` quand vous publiez vos vrais terrains.
