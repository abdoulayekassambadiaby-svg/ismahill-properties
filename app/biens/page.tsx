import type { Metadata } from "next";
import { Suspense } from "react";
import { photos } from "@/data/site";
import { biensTries, waLink } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";
import CtaFinal from "@/components/CtaFinal";

export const metadata: Metadata = {
  title: "Nos biens : maisons, appartements et terrains à vendre ou à louer",
  description:
    "Découvrez nos maisons et appartements à louer, nos villas à vendre et nos terrains à vendre à Bingerville et dans le Grand Abidjan. Prix en FCFA.",
  alternates: { canonical: "/biens/" },
  openGraph: { url: "/biens/" },
};

export default function BiensPage() {
  const biens = biensTries();
  return (
    <>
      <PageHero
        eyebrow="Nos biens"
        title="Trouvez le bien qui vous ressemble"
        text="Locations, ventes et terrains à Bingerville et dans le Grand Abidjan. Un bien vous intéresse ? Contactez-nous en un clic sur WhatsApp."
        image={photos.contact}
      />
      <section className="container-site pb-8">
        {/* Repli sans JavaScript : la liste complète reste visible */}
        <Suspense
          fallback={
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {biens.map((b) => <PropertyCard key={b.slug} bien={b} />)}
            </div>
          }
        >
          <PropertyFilters biens={biens} />
        </Suspense>
        <p className="mt-10 text-center text-sm text-encre/60">
          Vous ne trouvez pas votre bonheur ?{" "}
          <a href={waLink("Bonjour ISMAHILL PROPERTIES, je recherche un bien. Voici mes critères : ")} target="_blank" rel="noopener noreferrer" className="font-semibold text-rose underline-offset-4 hover:underline">
            Confiez-nous votre recherche
          </a>
        </p>
      </section>
      <CtaFinal title="Vous souhaitez louer ou vendre votre bien ?" text="Confiez-le à ISMAHILL PROPERTIES : nous le mettons en valeur auprès de notre clientèle." />
    </>
  );
}
