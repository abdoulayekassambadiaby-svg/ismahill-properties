import { site } from "@/data/site";
import { biens, type Bien, type TypeBien } from "@/data/biens";

/** Adresse publique du site (domaine personnalisé > domaine Vercel > valeur de data/site.ts). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : site.url)
).replace(/\/$/, "");

/** Lien WhatsApp avec message pré-rempli. */
export function waLink(message: string = site.messageWhatsapp) {
  return `https://wa.me/${site.contact.whatsappNumero}?text=${encodeURIComponent(message)}`;
}

/** 15000000 -> "15 000 000 FCFA" (formatage identique serveur / navigateur). */
export function formatPrix(prix: number, periode?: "mois") {
  const n = String(Math.round(prix)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n} FCFA${periode === "mois" ? " / mois" : ""}`;
}

export const typeLabels: Record<TypeBien, string> = {
  location: "À louer",
  vente: "À vendre",
  terrain: "Terrain",
};

export function biensTries(): Bien[] {
  return [...biens].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Adapte la taille d'une photo Unsplash (poids réduit, format WebP/AVIF auto).
 * Les photos locales (/images/…, /biens/…) sont renvoyées telles quelles.
 */
export function imgUrl(src: string, width: number, quality = 70) {
  if (!src.includes("images.unsplash.com")) return src;
  const base = src.split("?")[0];
  return `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function imgSrcSet(src: string, widths: number[], quality = 70) {
  if (!src.includes("images.unsplash.com")) return undefined;
  return widths.map((w) => `${imgUrl(src, w, quality)} ${w}w`).join(", ");
}

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
