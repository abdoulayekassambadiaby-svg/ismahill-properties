import type { Metadata } from "next";
import Link from "next/link";
import { photos, site } from "@/data/site";
import {
  controlesStandard,
  engagements,
  faqVerification,
  parcours,
  signauxAlerte,
  verification,
  verifierSoiMeme,
} from "@/data/verification";
import { biensAvecDossier, registre } from "@/lib/dossiers";
import { waLink } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import DocumentChecker from "@/components/DocumentChecker";
import PropertyCard from "@/components/PropertyCard";
import { Reveal } from "@/components/Motion";
import Ribbons from "@/components/Ribbons";
import {
  IconAlert,
  IconArrow,
  IconCheck,
  IconDocument,
  IconFingerprint,
  IconGlobe,
  IconPhone,
  IconScale,
  IconShield,
  IconVideo,
  IconWallet,
  IconWhatsApp,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Vérifiez avant d'acheter : terrains avec ACD pour la diaspora",
  description:
    "Achetez un terrain à Bingerville et Abidjan depuis l'étranger en toute confiance : terrains avec ACD, dossier foncier consultable, vérification en ligne des documents, visite en vidéo et paiement chez le notaire de votre choix.",
  alternates: { canonical: "/verification/" },
  openGraph: { url: "/verification/" },
};

const iconesEngagements = [IconShield, IconDocument, IconScale, IconWallet, IconVideo, IconFingerprint];

export default function VerificationPage() {
  const terrains = biensAvecDossier();
  const reg = registre();
  const dossiers = terrains.map((b) => ({ reference: b.dossier.reference, slug: b.slug, bien: b.titre, exemple: !!b.exemple }));

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqVerification.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.r },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHero eyebrow="Diaspora · Achat de terrain" title={verification.titre} text={verification.intro} image={photos.conseil}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#verifier" className="btn btn-rose">
            <IconFingerprint className="h-5 w-5" /> Vérifier un document
          </a>
          <a href="#parcours" className="btn btn-outline-light">Comment ça marche</a>
        </div>
      </PageHero>

      {/* Engagements */}
      <section className="container-site py-20 md:py-28">
        <SectionTitle
          center
          eyebrow="Nos engagements"
          title="Acheter à distance, sans prendre de risque à l'aveugle"
          text="Six règles que nous appliquons à chaque terrain proposé, sans exception."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {engagements.map((e, i) => {
            const Icon = iconesEngagements[i % iconesEngagements.length];
            return (
              <Reveal key={e.titre} delay={(i % 3) * 0.08} className="h-full">
                <div className="h-full rounded-3xl border border-marine/8 bg-white p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose/10 text-rose">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{e.titre}</h3>
                  <p className="mt-2 leading-relaxed text-encre/70">{e.texte}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Parcours */}
      <section id="parcours" className="relative isolate scroll-mt-20 overflow-hidden bg-marine py-20 md:py-28">
        <Ribbons variant="dark" className="top-0 left-0 -z-10 h-32 rotate-180 opacity-70" />
        <div className="container-site">
          <SectionTitle
            light
            center
            eyebrow="Comment ça marche"
            title="Votre achat, étape par étape, depuis l'étranger"
            text="Vous gardez la main à chaque étape. Aucun paiement n'est demandé avant que vous ayez tout vérifié."
          />
          <ol className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {parcours.map((e, i) => (
              <li key={e.titre}>
                <Reveal delay={(i % 3) * 0.1}>
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-or bg-marine-900 font-titre text-lg font-extrabold text-or-300">
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

      {/* Outil */}
      <section id="verifier" className="container-site scroll-mt-20 py-20 md:py-28">
        <SectionTitle
          eyebrow="Vérification en ligne"
          title="Le document que vous avez reçu est-il authentique ?"
          text="Chaque document que nous envoyons est enregistré avec une empreinte numérique unique. Si un seul caractère est modifié (nom, numéro, date, superficie), le document n'est plus reconnu."
        />
        <div className="mt-10">
          <DocumentChecker registre={reg} dossiers={dossiers} />
        </div>
        <p className="mt-5 max-w-3xl text-sm text-encre/55">
          Ce contrôle prouve que le fichier est bien celui que nous avons enregistré. Il ne remplace pas la vérification de l'ACD auprès de
          l'administration, que votre notaire effectue avant la signature.
        </p>
      </section>

      {/* Contrôles + vérifier soi-même */}
      <section className="bg-sable/70 py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionTitle
              eyebrow="Avant publication"
              title="Ce que nous contrôlons sur chaque terrain"
              text="Le détail des contrôles, avec leurs dates, figure dans le dossier foncier de chaque fiche terrain."
            />
            <ul className="mt-8 space-y-4">
              {controlesStandard.map((c, i) => (
                <Reveal key={c.titre} delay={i * 0.06}>
                  <li className="flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-marine/5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                      <IconCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold">{c.titre}</h3>
                      <p className="mt-1 leading-relaxed text-encre/70">{c.texte}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle
              eyebrow="En toute indépendance"
              title="Vérifiez aussi par vous-même"
              text="Les professionnels et administrations ci-dessous ne dépendent pas de nous. C'est leur avis qui compte."
            />
            <ul className="mt-8 space-y-4">
              {verifierSoiMeme.map((v, i) => (
                <Reveal key={v.qui} delay={i * 0.06}>
                  <li className="rounded-2xl border border-marine/10 bg-white p-5">
                    <h3 className="flex items-center gap-2 font-bold">
                      <IconScale className="h-5 w-5 shrink-0 text-or" /> {v.qui}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-encre/70">{v.quoi}</p>
                    {v.lien && (
                      <a href={v.lien} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-rose hover:underline">
                        {v.libelleLien} <IconArrow className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Signaux d'alerte */}
      <section className="container-site py-20 md:py-28">
        <div className="grid gap-10 rounded-[2rem] border-2 border-rose/25 bg-white p-6 md:p-12 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose text-white">
              <IconAlert className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-[1.75rem] leading-tight font-extrabold md:text-3xl">Les signaux qui doivent vous alerter</h2>
            <p className="mt-4 leading-relaxed text-encre/70">
              Avec nous ou avec un autre vendeur : si vous constatez l'un de ces signes, arrêtez tout et demandez conseil à votre notaire.
            </p>
            <p className="mt-4 leading-relaxed text-encre/70">
              Quelqu'un vous contacte en se réclamant d'ISMAHILL PROPERTIES ? Vérifiez en nous appelant directement :
            </p>
            <div className="mt-3 space-y-2">
              {site.contact.telephones.map((t) => (
                <a key={t.lien} href={`tel:${t.lien}`} className="flex items-center gap-2 font-semibold text-marine hover:text-rose">
                  <IconPhone className="h-5 w-5 text-rose" /> {t.affiche}
                </a>
              ))}
            </div>
          </div>
          <ul className="space-y-3 self-center">
            {signauxAlerte.map((s) => (
              <li key={s} className="flex items-start gap-3 rounded-2xl bg-rose/5 px-4 py-3.5">
                <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                <span className="text-encre/85">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Terrains vérifiables */}
      {terrains.length > 0 && (
        <section className="bg-sable/70 py-20 md:py-28">
          <div className="container-site">
            <SectionTitle eyebrow="Nos terrains" title="Terrains avec dossier foncier vérifiable" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {terrains.map((b) => (
                <PropertyCard key={b.slug} bien={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-site py-20 md:py-28">
        <SectionTitle center eyebrow="Questions fréquentes" title="Vos questions sur la vérification" />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqVerification.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 ring-1 ring-marine/8 open:ring-marine/20">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-titre font-semibold text-marine">
                {f.q}
                <span aria-hidden className="mt-0.5 text-xl leading-none text-rose transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-encre/75">{f.r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-marine py-20 md:py-24">
        <div className="absolute -top-32 right-0 -z-10 h-80 w-80 rounded-full bg-rose/20 blur-3xl" />
        <div className="container-site grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <SectionTitle
            light
            eyebrow="Vous vivez à l'étranger ?"
            title="Parlons de votre projet de terrain"
            text="Dites-nous votre budget, la zone qui vous intéresse et votre pays de résidence : nous vous envoyons les terrains disponibles avec leur dossier foncier."
          />
          <Reveal className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href={waLink("Bonjour ISMAHILL PROPERTIES, je vis à l'étranger et je souhaite acheter un terrain avec ACD.\nBudget :\nZone souhaitée :\nPays de résidence :")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <IconWhatsApp className="h-5 w-5" /> Écrire sur WhatsApp
            </a>
            <Link href="/biens/" className="btn btn-outline-light">
              <IconGlobe className="h-5 w-5" /> Voir nos biens
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
