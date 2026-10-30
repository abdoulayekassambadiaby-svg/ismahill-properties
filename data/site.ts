/* =====================================================================
   ISMAHILL PROPERTIES — DONNÉES DU SITE
   ---------------------------------------------------------------------
   Tous les textes, coordonnées et services sont ici.
   Modifiez entre les guillemets "…", enregistrez, et le site se met à
   jour. Les mentions [À COMPLÉTER] sont à remplacer par vos informations.
   ===================================================================== */

export const site = {
  nom: "ISMAHILL PROPERTIES",
  nomCourt: "Ismahill Properties",
  slogan: "L'excellence au service de votre patrimoine",
  accroche: "Agence immobilière à Bingerville",

  // Adresse du site une fois en ligne (sans « / » final).
  // Sur Vercel, l'adresse est détectée automatiquement : ne changez ceci
  // que lorsque votre nom de domaine est branché.
  url: "https://www.ismahillproperties.com", // [À COMPLÉTER] votre nom de domaine

  description:
    "ISMAHILL PROPERTIES, agence immobilière à Bingerville (Abidjan) : location, vente et achat de maisons, appartements et terrains, gestion locative et conseil immobilier personnalisé.",

  motsCles: [
    "agence immobilière Bingerville",
    "gestion locative Abidjan",
    "terrain à vendre Bingerville",
    "location maison Bingerville",
    "villa à vendre Bingerville",
    "appartement à louer Abidjan",
    "agence immobilière Côte d'Ivoire",
  ],

  contact: {
    whatsapp: "+225 07 79 99 56 73",
    whatsappNumero: "2250779995673", // format international sans « + » ni espaces
    telephones: [
      { affiche: "07 47 17 10 63", lien: "+2250747171063" },
      { affiche: "27 22 25 72 04", lien: "+2252722257204" },
    ],
    email: "ismahill.group@gmail.com",
    adresse: "Bingerville, palais de justice",
    ville: "Bingerville",
    region: "Abidjan",
    pays: "Côte d'Ivoire",
    // Carte Google Maps intégrée (page Contact et Accueil)
    carteEmbed:
      "https://www.google.com/maps?q=Palais+de+justice+de+Bingerville,+C%C3%B4te+d%27Ivoire&hl=fr&z=15&output=embed",
    carteLien:
      "https://www.google.com/maps/search/?api=1&query=Palais+de+justice+de+Bingerville",
  },

  // Horaires d'ouverture [À COMPLÉTER]
  horaires: [
    { jours: "Lundi – Vendredi", heures: "[À COMPLÉTER]" },
    { jours: "Samedi", heures: "[À COMPLÉTER]" },
    { jours: "Dimanche", heures: "[À COMPLÉTER]" },
  ],

  // Réseaux sociaux : ajoutez vos liens (laissez "" pour masquer)
  reseaux: {
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
  },

  // Message pré-rempli du bouton WhatsApp flottant
  messageWhatsapp:
    "Bonjour ISMAHILL PROPERTIES, je vous contacte depuis votre site internet.",
};

export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Propriétaires", href: "/proprietaires/" },
  { label: "Nos biens", href: "/biens/" },
  { label: "À propos", href: "/a-propos/" },
  { label: "Contact", href: "/contact/" },
];

/* ---------------------------------------------------------------------
   PHOTOS DU SITE (provisoires, Unsplash — voir PHOTOS.md)
   Pour utiliser vos photos : déposez-les dans public/images/ puis
   remplacez l'adresse, par exemple "/images/facade-agence.jpg".
   --------------------------------------------------------------------- */
export const photos = {
  accueil: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
  proprietaires: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
  services: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  aPropos: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  conseil: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
  contact: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
};

/* ---------------------------------------------------------------------
   SERVICES (pages Accueil et Services)
   icone : "cle" | "maison" | "gestion" | "conseil" | "projet"
   --------------------------------------------------------------------- */
export type Service = {
  id: string;
  icone: "cle" | "maison" | "gestion" | "conseil" | "projet";
  titre: string;
  court: string; // libellé court (menus)
  resume: string;
  description: string;
  points: string[];
  photo: string;
};

export const services: Service[] = [
  {
    id: "vente-achat",
    court: "Vente et achat",
    icone: "cle",
    titre: "Vente et achat de biens immobiliers",
    resume:
      "Maisons, villas, appartements et terrains : nous vous accompagnons pour vendre au juste prix ou acheter en toute sérénité.",
    description:
      "Que vous souhaitiez vendre un bien ou réaliser un achat, nous prenons en charge chaque étape de la transaction : estimation, mise en valeur, recherche d'acquéreurs ou de biens, visites, négociation et accompagnement jusqu'à la signature.",
    points: [
      "Estimation réaliste de votre bien selon le marché local",
      "Mise en valeur et diffusion de votre annonce",
      "Recherche ciblée de biens selon vos critères et votre budget",
      "Organisation et accompagnement des visites",
      "Vérification des documents et sécurisation de la transaction",
      "Accompagnement jusqu'à la signature chez le notaire",
    ],
    photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  },
  {
    id: "location",
    court: "Location",
    icone: "maison",
    titre: "Location de biens",
    resume:
      "Nous trouvons des locataires fiables pour les propriétaires et le logement idéal pour les locataires.",
    description:
      "Nous mettons en relation propriétaires et locataires avec rigueur : sélection des dossiers, visites, rédaction du bail et état des lieux. Pour les locataires, nous recherchons le bien qui correspond à vos besoins et à votre budget.",
    points: [
      "Mise en location rapide de votre maison, appartement ou local",
      "Sélection rigoureuse des locataires",
      "Rédaction du contrat de bail et état des lieux",
      "Recherche de logement pour les particuliers et les familles",
      "Visites organisées selon vos disponibilités",
    ],
    photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
  {
    id: "gestion",
    court: "Gestion immobilière",
    icone: "gestion",
    titre: "Gestion immobilière",
    resume:
      "Confiez-nous la gestion de votre bien : loyers, locataires, entretien. Vous êtes informé, nous nous occupons du reste.",
    description:
      "Notre service de gestion locative vous libère des contraintes du quotidien. Nous assurons le suivi administratif, financier et technique de votre bien, avec des comptes rendus réguliers pour que vous gardiez une vision claire de votre patrimoine.",
    points: [
      "Encaissement des loyers et reversement au propriétaire",
      "Suivi des locataires et gestion des relances",
      "Coordination de l'entretien et des petits travaux",
      "États des lieux d'entrée et de sortie",
      "Compte rendu régulier de la gestion de votre bien",
      "Gestion possible à distance pour les propriétaires de la diaspora",
    ],
    photo: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
  },
  {
    id: "conseil",
    court: "Conseils personnalisés",
    icone: "conseil",
    titre: "Accompagnement et conseils personnalisés",
    resume:
      "Des conseils adaptés à votre situation pour prendre les bonnes décisions et valoriser votre patrimoine.",
    description:
      "Chaque projet est unique. Nous prenons le temps de comprendre votre situation et vos objectifs pour vous orienter : choix d'un investissement, fixation d'un loyer, démarches administratives, valorisation d'un bien existant.",
    points: [
      "Écoute de votre projet et analyse de vos besoins",
      "Conseils pour investir dans l'immobilier",
      "Aide à la fixation du prix de vente ou du loyer",
      "Orientation dans les démarches administratives et foncières",
      "Conseils pour valoriser votre bien",
    ],
    photo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
  },
  {
    id: "assistance",
    court: "Assistance projets",
    icone: "projet",
    titre: "Assistance dans vos projets immobiliers",
    resume:
      "Achat de terrain, construction, investissement : nous restons à vos côtés du premier rendez-vous à la remise des clés.",
    description:
      "Vous avez un projet d'acquisition de terrain, de construction ou d'investissement locatif ? Nous vous assistons à chaque étape et vous mettons en relation avec des professionnels de confiance pour avancer sereinement.",
    points: [
      "Recherche et vérification de terrains",
      "Accompagnement dans les démarches foncières",
      "Mise en relation avec des professionnels du bâtiment",
      "Suivi de votre projet, y compris depuis l'étranger",
      "Un interlocuteur unique tout au long du projet",
    ],
    photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  },
];

/* ---------------------------------------------------------------------
   POURQUOI NOUS CHOISIR (aucun chiffre inventé)
   --------------------------------------------------------------------- */
export const atouts = [
  {
    titre: "Une agence de proximité",
    texte:
      "Installés à Bingerville, nous connaissons le terrain, les quartiers et les réalités du marché local.",
  },
  {
    titre: "Transparence et confiance",
    texte:
      "Des informations claires, des documents vérifiés et un suivi honnête à chaque étape de votre projet.",
  },
  {
    titre: "Un accompagnement sur mesure",
    texte:
      "Un interlocuteur dédié qui prend le temps de comprendre vos besoins et vous répond rapidement.",
  },
  {
    titre: "Votre patrimoine protégé",
    texte:
      "Sélection rigoureuse des locataires, suivi des loyers et entretien : votre bien est entre de bonnes mains.",
  },
];

/* ---------------------------------------------------------------------
   PAGE PROPRIÉTAIRES
   --------------------------------------------------------------------- */
export const avantagesProprietaires = [
  {
    titre: "Zéro souci au quotidien",
    texte:
      "Visites, dossiers, relances, entretien : nous gérons tout et vous tenons informé.",
  },
  {
    titre: "Des locataires sélectionnés",
    texte:
      "Chaque candidat est vérifié avec soin pour limiter les impayés et protéger votre bien.",
  },
  {
    titre: "Des loyers suivis",
    texte:
      "Encaissement, suivi et reversement des loyers, avec des comptes rendus clairs.",
  },
  {
    titre: "Votre bien mis en valeur",
    texte:
      "Présentation soignée, photos et diffusion de votre annonce auprès de notre clientèle.",
  },
  {
    titre: "Idéal pour la diaspora",
    texte:
      "Vous vivez loin d'Abidjan ? Nous sommes vos yeux et vos mains sur place.",
  },
  {
    titre: "Un interlocuteur unique",
    texte:
      "Joignable par WhatsApp, téléphone ou e-mail, pour une relation simple et directe.",
  },
];

export const etapes = [
  {
    titre: "Prise de contact",
    texte:
      "Vous nous présentez votre bien et vos attentes par WhatsApp, téléphone ou via le formulaire.",
  },
  {
    titre: "Visite du bien",
    texte:
      "Nous visitons votre bien, faisons le point ensemble et vous conseillons sur le loyer ou le prix.",
  },
  {
    titre: "Mise en location",
    texte:
      "Nous diffusons l'annonce, organisons les visites, sélectionnons le locataire et préparons le bail.",
  },
  {
    titre: "Suivi",
    texte:
      "Loyers, entretien, relation avec le locataire : nous assurons le suivi et vous rendons compte.",
  },
];

export const typesDeBien = [
  "Maison / Villa",
  "Appartement",
  "Studio",
  "Terrain",
  "Local commercial / Bureau",
  "Immeuble",
  "Autre",
];

export const communes = [
  "Bingerville",
  "Cocody",
  "Abobo",
  "Adjamé",
  "Anyama",
  "Attécoubé",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Songon",
  "Treichville",
  "Yopougon",
  "Grand-Bassam",
  "Autre",
];

/* ---------------------------------------------------------------------
   PAGE À PROPOS (texte provisoire)
   --------------------------------------------------------------------- */
export const aPropos = {
  intro:
    "[À COMPLÉTER] ISMAHILL PROPERTIES est une agence immobilière basée à Bingerville, près du palais de justice. Nous accompagnons particuliers, familles, investisseurs et membres de la diaspora dans leurs projets de location, de vente, d'achat et de gestion de biens immobiliers.",
  histoire:
    "[À COMPLÉTER] Racontez ici la naissance de l'agence : l'année de création, ce qui vous a motivé, votre connaissance de Bingerville et du Grand Abidjan, et ce qui vous distingue.",
  mission:
    "Notre mission : offrir à chaque client un service immobilier fiable, transparent et personnalisé, afin de protéger et de valoriser son patrimoine.",
  valeurs: [
    {
      titre: "Excellence",
      texte: "Un service soigné, de la première prise de contact au suivi de votre bien.",
    },
    {
      titre: "Confiance",
      texte: "Des échanges transparents et des engagements tenus.",
    },
    {
      titre: "Proximité",
      texte: "Une équipe disponible, qui connaît le terrain et ses réalités.",
    },
    {
      titre: "Rigueur",
      texte: "Des dossiers vérifiés et une gestion méthodique de chaque bien.",
    },
  ],
};

/* ---------------------------------------------------------------------
   MENTIONS LÉGALES [À COMPLÉTER]
   --------------------------------------------------------------------- */
export const mentionsLegales = {
  raisonSociale: "ISMAHILL PROPERTIES",
  formeJuridique: "[À COMPLÉTER] (ex. SARL, SARLU, entreprise individuelle…)",
  capital: "[À COMPLÉTER]",
  rccm: "[À COMPLÉTER]",
  ncc: "[À COMPLÉTER] (numéro de compte contribuable)",
  siege: "Bingerville, palais de justice — Côte d'Ivoire",
  directeurPublication: "[À COMPLÉTER] (fonction, ex. « Le gérant »)",
  hebergeur:
    "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com",
};
