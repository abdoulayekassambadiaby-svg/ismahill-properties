/* =====================================================================
   ISMAHILL PROPERTIES — SERVICE « VÉRIFIEZ AVANT D'ACHETER »
   ---------------------------------------------------------------------
   Textes de la page /verification/ et du « dossier foncier » affiché sur
   chaque fiche terrain.

   ⚠️ RELISEZ CHAQUE ENGAGEMENT AVANT DE PUBLIER : ce qui est écrit ici
   est une promesse faite aux clients. Ne gardez que ce que l'agence
   applique réellement, sans exception.

   Les liens laissés vides ("") ne s'affichent pas : complétez-les quand
   vous aurez l'adresse officielle exacte.
   ===================================================================== */

export const verification = {
  titre: "Vérifiez avant d'acheter",
  intro:
    "Vous vivez à l'étranger et vous hésitez à acheter un terrain à distance ? C'est normal. Ne nous croyez pas sur parole : pour chaque terrain, nous mettons à votre disposition les documents, les contrôles effectués et les moyens de tout vérifier par vous-même, auprès de l'administration et de votre propre notaire.",
};

/* ---------------------------------------------------------------------
   NOS ENGAGEMENTS (affichés en haut de la page)
   --------------------------------------------------------------------- */
export const engagements = [
  {
    titre: "Uniquement des terrains avec ACD",
    texte:
      "Nous ne proposons à la diaspora que des parcelles disposant d'un Arrêté de Concession Définitive (ACD), le titre de propriété de référence pour les terrains urbains.",
  },
  {
    titre: "Les documents avant tout paiement",
    texte:
      "Vous recevez la copie des documents du terrain et pouvez les faire vérifier avant de verser le moindre franc, y compris un acompte.",
  },
  {
    titre: "Le notaire de votre choix",
    texte:
      "La vente est signée chez un notaire que vous choisissez librement. Nous n'imposons aucun intermédiaire : votre notaire travaille pour vous, pas pour nous.",
  },
  {
    titre: "Jamais d'argent en espèces",
    texte:
      "Le prix du terrain est versé sur le compte du notaire, jamais en espèces ni à un agent. Si quelqu'un vous demande l'inverse en notre nom, ne payez pas et appelez-nous.",
  },
  {
    titre: "Le terrain en direct, en vidéo",
    texte:
      "Un membre de l'agence se rend sur la parcelle et vous la montre en appel vidéo WhatsApp, en direct, à l'heure qui vous convient.",
  },
  {
    titre: "Des documents vérifiables en ligne",
    texte:
      "Chaque document que nous vous envoyons possède une empreinte numérique publiée sur ce site : vous pouvez vérifier qu'il n'a pas été modifié en chemin.",
  },
];

/* ---------------------------------------------------------------------
   PARCOURS D'ACHAT À DISTANCE (étapes numérotées)
   --------------------------------------------------------------------- */
export const parcours = [
  {
    titre: "Vous choisissez un terrain",
    texte:
      "Chaque fiche terrain affiche son dossier foncier : référence, documents disponibles, contrôles effectués et position GPS de la parcelle.",
  },
  {
    titre: "Vous recevez le dossier complet",
    texte:
      "Après une courte prise de contact (nom, pays, pièce d'identité), nous vous envoyons par WhatsApp ou e-mail la copie complète des documents.",
  },
  {
    titre: "Vous vérifiez les fichiers sur ce site",
    texte:
      "Déposez chaque document reçu dans l'outil de vérification ci-dessous : il confirme qu'il s'agit exactement du document que nous avons enregistré.",
  },
  {
    titre: "Vous voyez le terrain en direct",
    texte:
      "Visite en appel vidéo sur la parcelle, avec la position GPS affichée à l'écran. Un proche sur place peut aussi visiter avec nous.",
  },
  {
    titre: "Votre notaire vérifie auprès de l'administration",
    texte:
      "Il contrôle l'authenticité de l'ACD et obtient un état foncier récent (hypothèques, oppositions, litiges). Vous pouvez aussi faire borner la parcelle par un géomètre expert.",
  },
  {
    titre: "Signature et paiement chez le notaire",
    texte:
      "Vous signez, au besoin par procuration, et vous payez sur le compte du notaire, qui s'occupe ensuite du transfert de propriété à votre nom.",
  },
];

/* ---------------------------------------------------------------------
   CE QUE NOUS CONTRÔLONS AVANT DE PROPOSER UN TERRAIN
   (le détail parcelle par parcelle se trouve dans data/biens.ts)
   --------------------------------------------------------------------- */
export const controlesStandard = [
  {
    titre: "Le titre",
    texte: "L'ACD existe, ses références (numéro, lot, îlot, superficie) concordent avec le plan et avec le terrain proposé.",
  },
  {
    titre: "Le vendeur",
    texte: "La personne qui vend est bien le titulaire de l'ACD, ou dispose d'une procuration en règle de sa part.",
  },
  {
    titre: "La situation juridique",
    texte: "Un état foncier récent est demandé : pas d'hypothèque, d'opposition ou de litige connu sur la parcelle.",
  },
  {
    titre: "L'urbanisme",
    texte: "La parcelle n'est pas située dans une emprise, une zone d'utilité publique ou une zone non constructible connue.",
  },
  {
    titre: "Le terrain lui-même",
    texte: "Visite sur place, photos datées, relevé de la position GPS et vérification de l'absence d'occupant.",
  },
];

/* ---------------------------------------------------------------------
   VÉRIFIER PAR VOUS-MÊME (autorités et professionnels indépendants)
   lien : adresse officielle, laissez "" tant que vous ne l'avez pas
   vérifiée vous-même. [À COMPLÉTER]
   --------------------------------------------------------------------- */
export const verifierSoiMeme = [
  {
    qui: "Votre notaire",
    quoi:
      "C'est votre meilleur allié. Il vérifie l'ACD auprès de l'administration, demande l'état foncier, rédige l'acte de vente et reçoit les fonds. Choisissez-le vous-même, sans passer par nous.",
    lien: "", // [À COMPLÉTER] ex. annuaire de la Chambre des notaires de Côte d'Ivoire
    libelleLien: "Trouver un notaire",
  },
  {
    qui: "Le ministère en charge de la Construction et de l'Urbanisme",
    quoi:
      "Il délivre les ACD des terrains urbains. Votre notaire, ou une personne munie de votre procuration, peut y vérifier l'authenticité et la situation de l'ACD.",
    lien: "", // [À COMPLÉTER] adresse officielle du service de vérification
    libelleLien: "Site officiel",
  },
  {
    qui: "La Conservation foncière",
    quoi:
      "Elle tient le livre foncier et délivre l'état foncier, qui indique le propriétaire inscrit et les éventuelles hypothèques ou oppositions.",
    lien: "", // [À COMPLÉTER]
    libelleLien: "Site officiel",
  },
  {
    qui: "Un géomètre expert",
    quoi:
      "Il peut réaliser un bornage contradictoire : il replace les bornes sur le terrain d'après le plan officiel et confirme la superficie réelle.",
    lien: "", // [À COMPLÉTER] ex. annuaire de l'Ordre des géomètres experts
    libelleLien: "Trouver un géomètre",
  },
];

/* ---------------------------------------------------------------------
   SIGNAUX D'ALERTE (à montrer aux clients)
   --------------------------------------------------------------------- */
export const signauxAlerte = [
  "On vous presse de payer « avant qu'un autre acheteur ne prenne le terrain ».",
  "On vous demande un paiement en espèces, par transfert d'argent ou sur un compte personnel.",
  "On refuse de vous envoyer la copie de l'ACD, ou on n'a qu'une « attestation » ou un « reçu ».",
  "Le nom du vendeur ne correspond pas à celui inscrit sur l'ACD, sans procuration notariée.",
  "On refuse que votre propre notaire intervienne.",
  "Le document reçu n'est pas reconnu par l'outil de vérification de ce site.",
];

/* ---------------------------------------------------------------------
   QUESTIONS FRÉQUENTES
   --------------------------------------------------------------------- */
export const faqVerification = [
  {
    q: "Que prouve exactement l'outil de vérification des documents ?",
    r: "Il prouve que le fichier que vous avez reçu est strictement identique, octet par octet, à celui que nous avons enregistré pour ce terrain. Un seul chiffre modifié, une date retouchée, et le document n'est plus reconnu. En revanche, il ne remplace pas la vérification de l'ACD auprès de l'administration : c'est le rôle de votre notaire.",
  },
  {
    q: "Mes fichiers sont-ils envoyés sur Internet quand je les vérifie ?",
    r: "Non. Le calcul se fait entièrement dans votre navigateur, sur votre téléphone ou votre ordinateur. Le document ne quitte jamais votre appareil.",
  },
  {
    q: "Le document que j'ai reçu n'est pas reconnu. Que faire ?",
    r: "Ne payez rien. Vérifiez d'abord que le fichier n'a pas été envoyé comme « photo » sur WhatsApp (WhatsApp compresse les photos, ce qui change l'empreinte) : demandez-le en tant que « document ». Si le problème persiste, contactez-nous directement aux numéros affichés sur ce site.",
  },
  {
    q: "Pourquoi les documents publiés sur le site sont-ils partiellement masqués ?",
    r: "Pour protéger les données personnelles du vendeur et éviter que des faussaires ne copient les documents. La copie complète vous est envoyée personnellement, et son empreinte est publiée ici.",
  },
  {
    q: "Puis-je acheter sans venir en Côte d'Ivoire ?",
    r: "Oui. Vous pouvez donner une procuration à un proche ou signer selon les modalités proposées par votre notaire. Renseignez-vous auprès de lui ou du consulat de Côte d'Ivoire de votre pays de résidence pour la légalisation de la procuration.",
  },
  {
    q: "La position GPS publiée est-elle officielle ?",
    r: "Non. Elle est relevée sur place par notre équipe et sert à situer la parcelle sur une carte satellite. Seul un bornage par un géomètre expert fait foi pour les limites exactes du terrain.",
  },
];
