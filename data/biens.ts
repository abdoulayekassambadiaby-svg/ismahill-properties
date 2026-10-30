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
   ===================================================================== */

export type TypeBien = "location" | "vente" | "terrain";

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
  },
];
