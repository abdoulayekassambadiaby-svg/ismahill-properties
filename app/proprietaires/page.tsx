import type { Metadata } from "next";
import { avantagesProprietaires, etapes, photos, site } from "@/data/site";
import { waLink } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import OwnerForm from "@/components/OwnerForm";
import { Reveal } from "@/components/Motion";
import Ribbons from "@/components/Ribbons";
import {
  IconCamera,
  IconChat,
  IconGlobe,
  IconPhone,
  IconShield,
  IconWallet,
  IconWhatsApp,
  IconHeart,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Propriétaires : confiez-nous votre bien — gestion locative à Abidjan",
  description:
    "Propriétaire à Bingerville ou à Abidjan ? Confiez votre maison, appartement ou terrain à ISMAHILL PROPERTIES : mise en location, sélection des locataires, suivi des loyers et gestion locative.",
  alternates: { canonical: "/proprietaires/" },
  openGraph: { url: "/proprietaires/" },
};

const icones = [IconHeart, IconShield, IconWallet, IconCamera, IconGlobe, IconChat];

export default function ProprietairesPage() {
  return (
    <>
      <PageHero
        eyebrow="Propriétaires"
        title="Confiez-nous votre bien, nous nous occupons de tout"
        text="Mise en location, vente, gestion des loyers et des locataires : ISMAHILL PROPERTIES protège et valorise votre patrimoine, que vous soyez à Bingerville, à Abidjan ou à l'étranger."
        image={photos.proprietaires}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#formulaire" className="btn btn-rose">Confier mon bien</a>
          <a
            href={waLink("Bonjour ISMAHILL PROPERTIES, je souhaite vous confier mon bien.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light"
          >
            <IconWhatsApp className="h-5 w-5" /> Écrire sur WhatsApp
          </a>
        </div>
      </PageHero>

      {/* Avantages */}
      <section className="container-site py-20 md:py-28">
        <SectionTitle
          center
          eyebrow="Vos avantages"
          title="Pourquoi nous confier votre bien ?"
          text="Gagnez du temps, sécurisez vos revenus et gardez l'esprit tranquille."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {avantagesProprietaires.map((a, i) => {
            const Icon = icones[i % icones.length];
            return (
              <Reveal key={a.titre} delay={(i % 3) * 0.08} className="h-full">
                <div className="h-full rounded-3xl border border-marine/8 bg-white p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose/10 text-rose">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{a.titre}</h3>
                  <p className="mt-2 leading-relaxed text-encre/70">{a.texte}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Étapes */}
      <section className="relative isolate overflow-hidden bg-marine py-20 md:py-28">
        <Ribbons variant="dark" className="top-0 left-0 -z-10 h-32 rotate-180 opacity-70" />
        <div className="container-site">
          <SectionTitle
            light
            center
            eyebrow="Comment ça marche"
            title="4 étapes simples"
            text="Un processus clair, du premier contact au suivi de votre bien."
          />
          <ol className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span aria-hidden className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-or/0 via-or/60 to-or/0 lg:block" />
            {etapes.map((e, i) => (
              <li key={e.titre} className="relative">
                <Reveal delay={i * 0.12}>
                  <div className="flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
                    <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-or bg-marine-900 font-titre text-xl font-extrabold text-or-300">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold !text-white">{e.titre}</h3>
                      <p className="mt-2 leading-relaxed text-white/70">{e.texte}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Formulaire */}
      <section id="formulaire" className="scroll-mt-20 container-site py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionTitle
              eyebrow="Confier mon bien"
              title="Parlez-nous de votre bien"
              text="Remplissez ce court formulaire : votre demande nous parvient directement sur WhatsApp et nous vous recontactons rapidement."
            />
            <Reveal className="mt-8 space-y-3">
              <p className="font-titre text-sm font-semibold text-marine">Vous préférez appeler ?</p>
              {site.contact.telephones.map((t) => (
                <a key={t.lien} href={`tel:${t.lien}`} className="flex items-center gap-3 text-lg font-semibold text-marine hover:text-rose">
                  <IconPhone className="h-5 w-5 text-rose" /> {t.affiche}
                </a>
              ))}
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-semibold text-marine hover:text-rose">
                <IconWhatsApp className="h-5 w-5 text-[#25D366]" /> {site.contact.whatsapp}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(1,47,109,0.5)] ring-1 ring-marine/5 md:p-10">
              <OwnerForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
