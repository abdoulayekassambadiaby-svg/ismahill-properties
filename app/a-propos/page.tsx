import type { Metadata } from "next";
import { aPropos, photos, services, site } from "@/data/site";
import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import SmartImage from "@/components/SmartImage";
import CtaFinal from "@/components/CtaFinal";
import { Reveal } from "@/components/Motion";
import { IconCheck } from "@/components/Icons";

export const metadata: Metadata = {
  title: "À propos de notre agence immobilière à Bingerville",
  description:
    "ISMAHILL PROPERTIES, agence immobilière installée à Bingerville près du palais de justice : notre mission, nos valeurs et notre engagement à vos côtés.",
  alternates: { canonical: "/a-propos/" },
  openGraph: { url: "/a-propos/" },
};

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Une agence engagée pour votre patrimoine"
        text={site.slogan + " : bien plus qu'un slogan, c'est notre façon de travailler."}
        image={photos.aPropos}
      />

      <section className="container-site grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle eyebrow="Qui sommes-nous" title={`${site.nom}, votre agence à Bingerville`} />
          <Reveal className="mt-6 space-y-5 leading-relaxed text-encre/80 md:text-lg">
            <p>{aPropos.intro}</p>
            <p>{aPropos.histoire}</p>
            <p className="border-l-4 border-or pl-5 font-semibold text-marine">{aPropos.mission}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <SmartImage
            src={photos.conseil}
            alt="Accompagnement d'un client"
            sizes="(min-width:1024px) 600px, 100vw"
            maxWidth={1080}
            className="aspect-[4/3] rounded-[2rem]"
          />
        </Reveal>
      </section>

      <section className="bg-sable/70 py-20 md:py-28">
        <div className="container-site">
          <SectionTitle center eyebrow="Nos valeurs" title="Ce qui nous guide au quotidien" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aPropos.valeurs.map((v, i) => (
              <Reveal key={v.titre} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-3xl bg-white p-7 text-center ring-1 ring-marine/5">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-marine font-titre font-extrabold text-or-300">
                    {v.titre.charAt(0)}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{v.titre}</h3>
                  <p className="mt-2 leading-relaxed text-encre/70">{v.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-20 md:py-28">
        <SectionTitle eyebrow="Ce que nous faisons" title="Nos domaines d'intervention" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="flex items-start gap-3 rounded-2xl bg-white p-5 ring-1 ring-marine/5">
              <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
              <div>
                <p className="font-titre font-bold text-marine">{s.titre}</p>
                <p className="mt-1 text-sm text-encre/70">{s.resume}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <CtaFinal />
    </>
  );
}
