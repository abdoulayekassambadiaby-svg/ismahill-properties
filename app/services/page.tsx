import type { Metadata } from "next";
import Link from "next/link";
import { photos, services } from "@/data/site";
import { waLink } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import SmartImage from "@/components/SmartImage";
import CtaFinal from "@/components/CtaFinal";
import { Reveal } from "@/components/Motion";
import { IconCheck, IconWhatsApp, serviceIcons } from "@/components/Icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nos services immobiliers à Bingerville et Abidjan",
  description:
    "Vente et achat, location, gestion immobilière et locative, conseils personnalisés et assistance dans vos projets immobiliers à Bingerville et dans le Grand Abidjan.",
  alternates: { canonical: "/services/" },
  openGraph: { url: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos services"
        title="Des services immobiliers complets, pensés pour vous"
        text="Vendre, acheter, louer, faire gérer son bien ou se faire conseiller : ISMAHILL PROPERTIES vous accompagne à chaque étape, avec exigence et transparence."
        image={photos.services}
      >
        <nav aria-label="Accès rapide aux services" className="-mx-1 flex flex-wrap gap-2">
          {services.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-white/25 px-3.5 py-1.5 text-sm text-white/85 hover:border-white hover:text-white">
              {s.court}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-site space-y-20 py-20 md:space-y-28 md:py-28">
        {services.map((s, i) => {
          const Icon = serviceIcons[s.icone];
          const reverse = i % 2 === 1;
          return (
            <section key={s.id} id={s.id} className="scroll-mt-24 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={cn("relative", reverse && "lg:order-2")}>
                <SmartImage
                  src={s.photo}
                  alt={s.titre}
                  sizes="(min-width:1024px) 600px, 100vw"
                  maxWidth={1080}
                  className="aspect-[4/3] rounded-[2rem]"
                />
                <span className="absolute -top-5 left-6 grid h-16 w-16 place-items-center rounded-2xl bg-rose text-white shadow-lg">
                  <Icon className="h-8 w-8" />
                </span>
                <span className="absolute right-6 -bottom-5 font-titre text-6xl font-extrabold text-or/90 md:text-7xl" aria-hidden>
                  0{i + 1}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow">Service {i + 1}</p>
                <h2 className="mt-3 text-[1.6rem] leading-tight font-extrabold md:text-3xl">{s.titre}</h2>
                <p className="mt-4 leading-relaxed text-encre/75 md:text-lg">{s.description}</p>
                <ul className="mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marine text-white">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[0.97rem] text-encre/80">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={waLink(`Bonjour ISMAHILL PROPERTIES, je souhaite des informations sur votre service « ${s.titre} ».`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <IconWhatsApp className="h-5 w-5" /> Demander des informations
                  </a>
                  {(s.id === "location" || s.id === "gestion") && (
                    <Link href="/proprietaires/" className="btn btn-outline">Confier mon bien</Link>
                  )}
                  {s.id === "vente-achat" && (
                    <Link href="/biens/" className="btn btn-outline">Voir nos biens</Link>
                  )}
                </div>
              </Reveal>
            </section>
          );
        })}
      </div>

      <CtaFinal title="Un projet immobilier en tête ?" />
    </>
  );
}
