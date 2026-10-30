import type { Metadata } from "next";
import { mentionsLegales as ml, site } from "@/data/site";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${site.nom}.`,
  alternates: { canonical: "/mentions-legales/" },
  robots: { index: false, follow: true },
};

export default function MentionsLegales() {
  const h2 = "mt-10 text-xl font-bold";
  return (
    <div className="container-site max-w-3xl py-16 md:py-24">
      <p className="eyebrow">Informations légales</p>
      <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Mentions légales</h1>
      <p className="mt-4 rounded-2xl bg-or/10 px-4 py-3 text-sm text-encre/75">
        Les éléments marqués [À COMPLÉTER] doivent être renseignés avant la mise en ligne définitive (fichier <code>data/site.ts</code>).
      </p>

      <h2 className={h2}>Éditeur du site</h2>
      <ul className="mt-3 space-y-1.5 leading-relaxed text-encre/80">
        <li><strong>Raison sociale :</strong> {ml.raisonSociale}</li>
        <li><strong>Forme juridique :</strong> {ml.formeJuridique}</li>
        <li><strong>Capital social :</strong> {ml.capital}</li>
        <li><strong>RCCM :</strong> {ml.rccm}</li>
        <li><strong>N° compte contribuable :</strong> {ml.ncc}</li>
        <li><strong>Siège :</strong> {ml.siege}</li>
        <li><strong>Téléphone :</strong> {site.contact.telephones.map((t) => t.affiche).join(" / ")} — WhatsApp {site.contact.whatsapp}</li>
        <li><strong>E-mail :</strong> {site.contact.email}</li>
        <li><strong>Directeur de la publication :</strong> {ml.directeurPublication}</li>
      </ul>

      <h2 className={h2}>Hébergement</h2>
      <p className="mt-3 leading-relaxed text-encre/80">{ml.hebergeur}</p>

      <h2 className={h2}>Propriété intellectuelle</h2>
      <p className="mt-3 leading-relaxed text-encre/80">
        Le logo, les textes et la charte graphique de {site.nom} sont protégés. Toute reproduction sans autorisation préalable est interdite.
        Certaines photographies proviennent provisoirement de la banque d'images libre de droits Unsplash (unsplash.com).
      </p>

      <h2 className={h2}>Données personnelles</h2>
      <p className="mt-3 leading-relaxed text-encre/80">
        Ce site ne collecte aucune donnée sur ses propres serveurs. Les formulaires ouvrent l'application WhatsApp avec votre message
        pré-rempli : les informations ne sont transmises que si vous choisissez de les envoyer. Elles servent uniquement à répondre à votre
        demande. Conformément à la loi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel, vous pouvez
        demander l'accès, la rectification ou la suppression de vos données en écrivant à {site.contact.email}. [À COMPLÉTER si besoin]
      </p>

      <h2 className={h2}>Cookies</h2>
      <p className="mt-3 leading-relaxed text-encre/80">
        Le site n'utilise pas de cookies publicitaires. La carte Google Maps intégrée peut déposer des cookies propres à Google.
      </p>

      <h2 className={h2}>Annonces</h2>
      <p className="mt-3 leading-relaxed text-encre/80">
        Les annonces sont fournies à titre indicatif et sans valeur contractuelle. Les biens marqués « EXEMPLE » sont fictifs.
        Prix exprimés en francs CFA (FCFA).
      </p>
      <p className="mt-10 text-sm text-encre/50">Site : {siteUrl}</p>
    </div>
  );
}
