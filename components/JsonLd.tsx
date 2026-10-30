import { site } from "@/data/site";
import { siteUrl } from "@/lib/utils";

/** Données structurées « RealEstateAgent » pour Google (référencement local). */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/#agence`,
    name: site.nom,
    slogan: site.slogan,
    description: site.description,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/og.jpg`,
    telephone: site.contact.whatsapp.replace(/\s/g, ""),
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Près du palais de justice",
      addressLocality: site.contact.ville,
      addressRegion: site.contact.region,
      addressCountry: "CI",
    },
    hasMap: site.contact.carteLien,
    areaServed: [
      { "@type": "City", name: "Bingerville" },
      { "@type": "City", name: "Abidjan" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.whatsapp.replace(/\s/g, ""),
        contactType: "customer service",
        availableLanguage: ["French"],
      },
      ...site.contact.telephones.map((t) => ({
        "@type": "ContactPoint",
        telephone: t.lien,
        contactType: "customer service",
        availableLanguage: ["French"],
      })),
    ],
    knowsAbout: [
      "Vente immobilière",
      "Location immobilière",
      "Gestion locative",
      "Terrains à Bingerville",
      "Conseil immobilier",
    ],
    sameAs: Object.values(site.reseaux).filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
