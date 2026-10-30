import type { Metadata } from "next";
import { photos, site } from "@/data/site";
import { waLink } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import MapEmbed from "@/components/MapEmbed";
import { Reveal } from "@/components/Motion";
import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact — Agence immobilière à Bingerville, palais de justice",
  description: `Contactez ISMAHILL PROPERTIES à Bingerville (palais de justice) : WhatsApp ${site.contact.whatsapp}, téléphone ${site.contact.telephones.map((t) => t.affiche).join(" / ")}, e-mail ${site.contact.email}.`,
  alternates: { canonical: "/contact/" },
  openGraph: { url: "/contact/" },
};

export default function ContactPage() {
  const carte = "flex items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-marine/5 transition hover:ring-rose/30";
  const pastille = "grid h-12 w-12 shrink-0 place-items-center rounded-2xl";
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        text="Une question, un bien à confier, une recherche en cours ? Notre équipe vous répond rapidement, de préférence sur WhatsApp."
        image={photos.contact}
      />

      <section className="container-site py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Reveal>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className={carte}>
                <span className={`${pastille} bg-[#25D366]/15 text-[#128C4B]`}><IconWhatsApp className="h-6 w-6" /></span>
                <span>
                  <span className="block font-titre text-sm font-bold tracking-wider text-encre/55 uppercase">WhatsApp</span>
                  <span className="mt-1 block font-titre text-lg font-bold text-marine">{site.contact.whatsapp}</span>
                  <span className="mt-1 block text-sm text-rose">Écrire maintenant →</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <div className={carte}>
                <span className={`${pastille} bg-rose/10 text-rose`}><IconPhone className="h-6 w-6" /></span>
                <span>
                  <span className="block font-titre text-sm font-bold tracking-wider text-encre/55 uppercase">Téléphones</span>
                  {site.contact.telephones.map((t) => (
                    <a key={t.lien} href={`tel:${t.lien}`} className="mt-1 block font-titre text-lg font-bold text-marine hover:text-rose">
                      {t.affiche}
                    </a>
                  ))}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <a href={`mailto:${site.contact.email}`} className={carte}>
                <span className={`${pastille} bg-marine/10 text-marine`}><IconMail className="h-6 w-6" /></span>
                <span className="min-w-0">
                  <span className="block font-titre text-sm font-bold tracking-wider text-encre/55 uppercase">E-mail</span>
                  <span className="mt-1 block font-titre text-lg font-bold break-all text-marine">{site.contact.email}</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.15}>
              <a href={site.contact.carteLien} target="_blank" rel="noopener noreferrer" className={carte}>
                <span className={`${pastille} bg-or/15 text-or`}><IconPin className="h-6 w-6" /></span>
                <span>
                  <span className="block font-titre text-sm font-bold tracking-wider text-encre/55 uppercase">Adresse</span>
                  <span className="mt-1 block font-titre text-lg font-bold text-marine">{site.contact.adresse}</span>
                  <span className="block text-sm text-encre/60">{site.contact.region}, {site.contact.pays}</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={carte}>
                <span className={`${pastille} bg-marine text-or-300`}><IconClock className="h-6 w-6" /></span>
                <div className="w-full">
                  <span className="block font-titre text-sm font-bold tracking-wider text-encre/55 uppercase">Horaires</span>
                  <dl className="mt-2 space-y-1.5">
                    {site.horaires.map((h) => (
                      <div key={h.jours} className="flex flex-wrap justify-between gap-x-4 text-[0.95rem]">
                        <dt className="text-encre/70">{h.jours}</dt>
                        <dd className="font-semibold text-marine">{h.heures}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="h-full">
            <MapEmbed className="h-[360px] lg:h-full lg:min-h-[560px]" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
