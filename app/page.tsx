import Link from "next/link";
import { atouts, photos, services, site } from "@/data/site";
import { biensTries, waLink } from "@/lib/utils";
import SmartImage from "@/components/SmartImage";
import Ribbons from "@/components/Ribbons";
import SectionTitle from "@/components/SectionTitle";
import PropertyCard from "@/components/PropertyCard";
import CtaFinal from "@/components/CtaFinal";
import { Reveal } from "@/components/Motion";
import {
  IconArrow,
  IconHeart,
  IconPhone,
  IconPin,
  IconShield,
  IconUsers,
  IconWhatsApp,
  serviceIcons,
} from "@/components/Icons";

export const metadata = {
  alternates: { canonical: "/" },
};

const atoutIcons = [IconPin, IconShield, IconUsers, IconHeart];

export default function Home() {
  const derniers = biensTries().slice(0, 3);

  return (
    <>
      {/* ===== GRAND BANDEAU ===== */}
      <section className="relative isolate overflow-hidden bg-marine">
        <SmartImage
          src={photos.accueil}
          alt="Villa moderne"
          priority
          sizes="100vw"
          quality={60}
          className="!absolute inset-0 -z-20"
          imgClassName="hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-marine/85 via-marine/70 to-marine/95 md:bg-gradient-to-r md:from-marine/95 md:via-marine/75 md:to-marine/20" />
        <div className="container-site flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-14 pb-36 md:min-h-[min(88vh,820px)] md:pb-44">
          <p className="eyebrow hero-in !text-or-300">{site.accroche}</p>
          <h1 className="hero-in mt-5 max-w-3xl text-[2.15rem] leading-[1.12] font-extrabold !text-white [animation-delay:100ms] sm:text-5xl md:text-6xl">
            Votre partenaire immobilier de confiance à Bingerville
          </h1>
          <p className="hero-in mt-5 max-w-xl font-slogan text-xl text-or-300 italic [animation-delay:200ms] md:text-2xl">
            {site.slogan}
          </p>
          <p className="hero-in mt-4 max-w-xl text-base leading-relaxed text-white/80 [animation-delay:250ms] md:text-lg">
            Location, vente, achat et gestion de vos biens immobiliers à Bingerville et dans tout le Grand Abidjan.
          </p>
          <div className="hero-in mt-8 flex flex-col gap-3 [animation-delay:350ms] sm:flex-row">
            <Link href="/proprietaires/" className="btn btn-rose">
              Confier mon bien <IconArrow className="h-4 w-4" />
            </Link>
            <Link href="/biens/" className="btn btn-outline-light">
              Voir nos biens
            </Link>
          </div>
        </div>
        <Ribbons variant="dark" className="bottom-0 left-0 h-28 md:h-40" />
      </section>

      {/* Bandeau contact rapide */}
      <div className="container-site relative z-10 -mt-14 md:-mt-16">
        <div className="grid gap-px overflow-hidden rounded-3xl bg-marine/10 shadow-[0_25px_60px_-30px_rgba(1,47,109,0.5)] sm:grid-cols-3">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-5 hover:bg-sable/60">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#128C4B]"><IconWhatsApp className="h-5 w-5" /></span>
            <span>
              <span className="block text-xs tracking-wider text-encre/55 uppercase">WhatsApp</span>
              <span className="font-titre font-bold text-marine">{site.contact.whatsapp}</span>
            </span>
          </a>
          <a href={`tel:${site.contact.telephones[0].lien}`} className="flex items-center gap-4 bg-white p-5 hover:bg-sable/60">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose/10 text-rose"><IconPhone className="h-5 w-5" /></span>
            <span>
              <span className="block text-xs tracking-wider text-encre/55 uppercase">Appelez-nous</span>
              <span className="font-titre font-bold text-marine">{site.contact.telephones[0].affiche}</span>
            </span>
          </a>
          <Link href="/contact/" className="flex items-center gap-4 bg-white p-5 hover:bg-sable/60">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-or/15 text-or"><IconPin className="h-5 w-5" /></span>
            <span>
              <span className="block text-xs tracking-wider text-encre/55 uppercase">Nous trouver</span>
              <span className="font-titre font-bold text-marine">{site.contact.adresse}</span>
            </span>
          </Link>
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <section className="container-site py-20 md:py-28">
        <SectionTitle
          eyebrow="Nos services"
          title="Un accompagnement complet pour votre patrimoine"
          text="De la recherche du bien idéal à la gestion de vos loyers, nous vous accompagnons avec rigueur et discrétion."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icone];
            return (
              <Reveal key={s.id} delay={i * 0.06} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                <Link
                  href={`/services/#${s.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-marine/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-rose/30 hover:shadow-[0_25px_50px_-30px_rgba(1,47,109,0.45)]"
                >
                  <span className="absolute top-0 left-7 h-1 w-12 rounded-b bg-or transition-all duration-300 group-hover:w-20 group-hover:bg-rose" />
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-marine text-white transition-colors group-hover:bg-rose">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg leading-snug font-bold">{s.titre}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-encre/70">{s.resume}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-rose">
                    En savoir plus <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===== POURQUOI NOUS CHOISIR ===== */}
      <section className="relative overflow-hidden bg-sable/70 py-20 md:py-28">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <SmartImage
              src={photos.conseil}
              alt="Accompagnement et signature d'un contrat immobilier"
              sizes="(min-width:1024px) 600px, 100vw"
              maxWidth={1080}
              className="aspect-[4/5] rounded-[2rem] sm:aspect-[4/3] lg:aspect-[4/5]"
            />
            <div className="absolute -right-2 -bottom-6 max-w-[16rem] rounded-2xl bg-marine p-5 text-white shadow-xl sm:right-6">
              <p className="font-slogan text-lg leading-snug text-or-300 italic">« {site.slogan} »</p>
            </div>
          </Reveal>
          <div>
            <SectionTitle
              eyebrow="Pourquoi nous choisir"
              title="Une agence qui prend soin de vous et de vos biens"
              text="Confier son bien ou son projet, c'est avant tout une question de confiance. Voici ce que nous nous engageons à vous offrir."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {atouts.map((a, i) => {
                const Icon = atoutIcons[i % atoutIcons.length];
                return (
                  <Reveal key={a.titre} delay={i * 0.08}>
                    <div>
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-rose shadow-sm ring-1 ring-or/30">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-4 text-base font-bold">{a.titre}</h3>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-encre/70">{a.texte}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIASPORA : VÉRIFICATION ===== */}
      <section className="container-site pt-20 md:pt-28">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[2rem] bg-white p-7 shadow-[0_30px_70px_-40px_rgba(1,47,109,0.5)] ring-1 ring-marine/5 md:p-12 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-marine text-white">
              <IconShield className="h-8 w-8" />
            </span>
            <div>
              <p className="eyebrow">Diaspora</p>
              <h2 className="mt-2 text-2xl leading-tight font-extrabold md:text-3xl">Achetez un terrain à distance, en vérifiant tout</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-encre/70">
                Terrains avec ACD uniquement, dossier foncier consultable en ligne, documents vérifiables sur ce site, visite en vidéo et
                paiement chez le notaire de votre choix.
              </p>
            </div>
            <Link href="/verification/" className="btn btn-rose shrink-0 self-start lg:self-auto">
              Vérifiez avant d'acheter <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ===== DERNIERS BIENS ===== */}
      <section className="container-site py-20 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Nos biens"
            title="Nos dernières offres"
            text="Maisons, appartements et terrains sélectionnés à Bingerville et dans le Grand Abidjan."
          />
          <Link href="/biens/" className="btn btn-outline shrink-0 self-start md:self-auto">
            Voir tous les biens <IconArrow className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {derniers.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.08} className="h-full">
              <PropertyCard bien={b} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== PROPRIÉTAIRES ===== */}
      <section className="relative isolate overflow-hidden bg-marine py-20 md:py-24">
        <div className="absolute -top-32 right-0 -z-10 h-80 w-80 rounded-full bg-rose/20 blur-3xl" />
        <div className="container-site grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <SectionTitle
            light
            eyebrow="Propriétaires"
            title="Vous avez un bien à louer ou à vendre ?"
            text="Confiez-le à ISMAHILL PROPERTIES : nous trouvons le bon locataire ou le bon acquéreur, et nous assurons le suivi pour vous, même si vous vivez à l'étranger."
          />
          <Reveal className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/proprietaires/" className="btn btn-rose">
              Confier mon bien <IconArrow className="h-4 w-4" />
            </Link>
            <a href={waLink("Bonjour ISMAHILL PROPERTIES, je souhaite vous confier mon bien.")} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              <IconWhatsApp className="h-5 w-5" /> En parler sur WhatsApp
            </a>
          </Reveal>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
