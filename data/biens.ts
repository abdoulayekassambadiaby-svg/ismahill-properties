/* =====================================================================
   ISMAHILL PROPERTIES — LISTE DES BIENS
   ---------------------------------------------------------------------
   POUR AJOUTER UN BIEN : copiez un bloc { … } complet (de l'accolade
   ouvrante à l'accolade fermante suivie d'une virgule), collez-le en haut
   de la liste et modifiez les valeurs.

   - slug        : adresse de la fiche, en minuscules, sans accents ni
                   espaces (ex. "villa-4-pieces-bingerville-cite-feh").
                   Doit être UNIQUE.
   - type        : "location" | "vente" | "terrain"
   - prix        : nombre en FCFA, sans espaces (ex. 350000)
   - periode     : "mois" pour une location, sinon supprimez la ligne
   - photos      : la 1re photo est la photo principale. Déposez vos photos
                   dans public/biens/ et écrivez "/biens/nom-photo.jpg"
   - exemple     : true affiche le bandeau « EXEMPLE » (mettez false ou
                   supprimez la ligne pour vos vrais biens)
   - disponible  : false affiche « Loué / Vendu »
   - date        : date de publication AAAA-MM-JJ (tri : plus récent d'abord)
   - dossier     : (terrains) dossier foncier vérifiable affiché sur la
                   fiche et sur la page « Vérification ». Voir le modèle
                   sur le terrain d'exemple et le README (§ 7).
   ===================================================================== */

export type TypeBien = "location" | "vente" | "terrain";

/** Un document du dossier foncier. */
export type DocumentFoncier = {
  nom: string; // ex. "Arrêté de Concession Définitive (ACD)"
  description?: string;
  delivrePar?: string; // ex. "Ministère de la Construction"
  date?: string; // date du document AAAA-MM-JJ
  /** Version masquée publiée sur le site (fichier dans public/dossiers/…). Son empreinte est calculée automatiquement. */
  apercu?: string;
  /** Empreinte de la copie COMPLÈTE envoyée aux clients (non publiée) : obtenue avec `npm run empreinte -- fichier.pdf`. */
  empreinte?: string;
};

/** Un contrôle effectué sur la parcelle. */
export type Controle = {
  libelle: string;
  statut: "fait" | "en-cours" | "votre-notaire"; // "votre-notaire" : à faire faire par le notaire de l'acheteur
  date?: string; // AAAA-MM-JJ
  detail?: string;
};

export type DossierFoncier = {
  reference: string; // ex. "ISM-T-2026-001", unique, à communiquer aux clients
  acd: {
    numero?: string; // laissez vide si vous préférez ne le communiquer qu'en privé
    lotissement?: string;
    ilot?: string;
    lot?: string;
    superficie?: number; // en m², telle qu'inscrite sur l'ACD
  };
  /** Position relevée sur place (Google Maps : appui long sur le point → coordonnées). */
  position?: { lat: number; lng: number; releveeLe: string };
  documents: DocumentFoncier[];
  controles: Controle[];
  misAJour: string; // AAAA-MM-JJ
};

export type Bien = {
  slug: string;
  titre: string;
  type: TypeBien;
  commune: string;
  quartier?: string;
  prix: number;
  periode?: "mois";
  surface?: number; // en m²
  pieces?: number;
  chambres?: number;
  sallesDeBain?: number;
  description: string;
  caracteristiques: string[];
  photos: string[];
  exemple?: boolean;
  disponible?: boolean;
  date: string;
  dossier?: DossierFoncier;
};

export const biens: Bien[] = [
  {
    slug: "exemple-villa-duplex-5-pieces-bingerville",
    titre: "Villa duplex 5 pièces avec jardin",
    type: "vente",
    commune: "Bingerville",
    quartier: "[À COMPLÉTER]",
    prix: 95000000,
    surface: 600,
    pieces: 5,
    chambres: 4,
    sallesDeBain: 4,
    description:
      "EXEMPLE — Belle villa duplex lumineuse dans un quartier calme de Bingerville. Grand séjour ouvert sur le jardin, cuisine équipée, quatre chambres autonomes et parking. Ce bien est fictif : remplacez-le par l'un de vos biens.",
    caracteristiques: [
      "Titre foncier (ACD)",
      "Cuisine équipée",
      "4 chambres autonomes",
      "Jardin arboré",
      "Parking 2 véhicules",
      "Quartier calme et sécurisé",
    ],
    photos: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    ],
    exemple: true,
    disponible: true,
    date: "2026-10-28",
  },
  {
    slug: "exemple-appartement-3-pieces-cocody",
    titre: "Appartement 3 pièces moderne",
    type: "location",
    commune: "Cocody",
    quartier: "[À COMPLÉTER]",
    prix: 350000,
    periode: "mois",
    surface: 95,
    pieces: 3,
    chambres: 2,
    sallesDeBain: 2,
    description:
      "EXEMPLE — Appartement moderne et bien entretenu au 2e étage d'une résidence sécurisée. Séjour spacieux, deux chambres avec placards, cuisine aménagée et balcon. Ce bien est fictif : remplacez-le par l'un de vos biens.",
    caracteristiques: [
      "Résidence sécurisée",
      "Balcon",
      "Cuisine aménagée",
      "Eau et électricité individuelles",
      "Parking",
    ],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    exemple: true,
    disponible: true,
    date: "2026-10-25",
  },
  {
    slug: "exemple-terrain-500-m2-bingerville",
    titre: "Terrain de 500 m² viabilisé",
    type: "terrain",
    commune: "Bingerville",
    quartier: "[À COMPLÉTER]",
    prix: 15000000,
    surface: 500,
    description:
      "EXEMPLE — Terrain plat et viabilisé, idéal pour une construction résidentielle, dans une zone en plein développement. Documents disponibles sur demande. Ce bien est fictif : remplacez-le par l'un de vos biens.",
    caracteristiques: [
      "Lot viabilisé (eau, électricité à proximité)",
      "Terrain plat",
      "Accès facile",
      "Documents vérifiables",
    ],
    photos: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    ],
    exemple: true,
    disponible: true,
    date: "2026-10-20",
    dossier: {
      reference: "ISM-T-EXEMPLE",
      acd: {
        numero: "", // [À COMPLÉTER] ou laissez vide
        lotissement: "[À COMPLÉTER]",
        ilot: "12",
        lot: "34",
        superficie: 500,
      },
      position: { lat: 5.3553, lng: -3.8847, releveeLe: "2026-10-18" }, // EXEMPLE : coordonnées approximatives de Bingerville
      documents: [
        {
          nom: "Arrêté de Concession Définitive (ACD)",
          description: "Extrait masqué : les données personnelles du titulaire sont cachées.",
          delivrePar: "Ministère en charge de la Construction et de l'Urbanisme",
          date: "2024-05-14",
          apercu: "/dossiers/exemple-acd-extrait.pdf",
        },
        {
          nom: "Plan de la parcelle",
          description: "Plan annexé à l'ACD, avec les cotes et les bornes.",
          delivrePar: "Annexe de l'ACD",
        },
        {
          nom: "État foncier",
          description: "Situation de la parcelle au livre foncier : propriétaire inscrit, hypothèques, oppositions.",
          delivrePar: "Conservation foncière",
          date: "2026-10-10",
        },
      ],
      controles: [
        { libelle: "ACD présenté et références concordantes avec le plan", statut: "fait", date: "2026-10-12" },
        { libelle: "Identité du vendeur conforme au titulaire de l'ACD", statut: "fait", date: "2026-10-12" },
        { libelle: "État foncier récent : aucune hypothèque ni opposition", statut: "fait", date: "2026-10-10" },
        { libelle: "Visite sur place, terrain libre de tout occupant", statut: "fait", date: "2026-10-18" },
        { libelle: "Situation au regard des emprises et zones non constructibles", statut: "en-cours" },
        {
          libelle: "Authenticité de l'ACD confirmée auprès de l'administration",
          statut: "votre-notaire",
          detail: "Votre notaire s'en charge avant la signature : c'est la vérification qui fait foi.",
        },
        {
          libelle: "Bornage contradictoire par un géomètre expert",
          statut: "votre-notaire",
          detail: "Recommandé : confirme les limites et la superficie réelles sur le terrain.",
        },
      ],
      misAJour: "2026-10-18",
    },
  },
];
