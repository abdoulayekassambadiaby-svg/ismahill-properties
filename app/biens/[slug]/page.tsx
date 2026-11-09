import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { biens } from "@/data/biens";
import { site } from "@/data/site";
import { biensTries, formatPrix, imgUrl, siteUrl, typeLabels, waLink } from "@/lib/utils";
import Gallery from "@/components/Gallery";
import DossierFoncier from "@/components/DossierFoncier";
import PropertyCard, { TypeBadge } from "@/components/PropertyCard";
import { Reveal } from "@/components/Motion";
import { IconBath, IconBed, IconCheck, IconPhone, IconPin, IconRooms, IconShield, IconSurface, IconWhatsApp } from "@/components/Icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return biens.map((b) => ({ slug: b.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = biens.find((x) => x.slug === slug);
  if (!b) return {};
  const titre = `${b.exemple ? "[EXEMPLE] " : ""}${b.titre} — ${typeLabels[b.type]} à ${b.commune}`;
  const description = `${formatPrix(b.prix, b.periode).replace(/ /g, " ")} · ${b.description.slice(0, 140)}…`;
  const image = b.photos[0].startsWith("http") ? imgUrl(b.photos[0], 1200, 70) : b.photos[0];
  return {
    title: titre,
    description,
    alternates: { canonical: `/biens/${b.slug}/` },
    openGraph: { url: `/biens/${b.slug}/`, title: titre, description, images: [{ url: image, width: 1200, alt: b.titre }] },
    twitter: { card: "summary_large_image", title: titre, description, images: [image] },
  };
}

export default async function BienPage({ params }: Props) {
  const { slug } = await params;
  const b = biens.find((x) => x.slug === slug);
  if (!b) notFound();

  const url = `${siteUrl}/biens/${b.slug}/`;
  const message = `Bonjour ISMAHILL PROPERTIES, je suis intéressé(e) par ce bien : « ${b.exemple ? "[EXEMPLE] " : ""}${b.titre} » à ${b.commune} (${formatPrix(b.prix, b.periode).replace(/ /g, " ")}).\n${url}\nPouvez-vous me donner plus d'informations ?`;
  const autres = biensTries().filter((x) => x.slug !== b.slug).slice(0, 3);
  const infos = [
    b.surface && { icon: IconSurface, label: "Surface", value: `${b.surface} m²` },
    b.pieces && { icon: IconRooms, label: "Pièces", value: `${b.pieces}` },
    b.chambres && { icon: IconBed, label: "Chambres", value: `${b.chambres}` },
    b.sallesDeBain && { icon: IconBath, label: "Salles de bain", value: `${b.sallesDeBain}` },
  ].filter(Boolean) as { icon: typeof IconSurface; label: string; value: string }[];

  return (
    <>
      <div className="container-site pt-6 pb-16 md:pt-10 md:pb-24">
        <nav aria-label="Fil d'Ariane" className="text-sm text-encre/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-rose">Accueil</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/biens/" className="hover:text-rose">Nos biens</Link></li>
            <li aria-hidden>/</li>
            <li className="line-clamp-1 text-marine">{b.titre}</li>
          </ol>
        </nav>

        {b.exemple && (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-rose/50 bg-rose/5 px-5 py-3 text-sm text-rose">
            <strong className="font-titre tracking-wider">EXEMPLE</strong> — Ce bien est fictif et sert uniquement de démonstration. Il sera remplacé par un vrai bien.
          </div>
        )}

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-12">
          <div className="min-w-0">
            <Gallery photos={b.photos} titre={b.titre} />
          </div>

          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="sticky top-24 rounded-[1.75rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(1,47,109,0.5)] ring-1 ring-marine/5 md:p-8">
              <div className="flex flex-wrap gap-2">
                <TypeBadge bien={b} />
                {b.exemple && (
                  <span className="rounded-full border border-dashed border-rose px-3 py-1 font-titre text-[0.7rem] font-bold tracking-[0.18em] text-rose uppercase">Exemple</span>
                )}
                {b.disponible === false && (
                  <span className="rounded-full bg-encre/80 px-3 py-1 font-titre text-[0.7rem] font-bold tracking-wider text-white uppercase">
                    {b.type === "location" ? "Loué" : "Vendu"}
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-2xl leading-tight font-extrabold md:text-3xl">
                {b.exemple && <span className="text-rose">[EXEMPLE] </span>}
                {b.titre}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-encre/65">
                <IconPin className="h-4 w-4 text-rose" />
                {b.commune}
                {b.quartier && b.quartier !== "[À COMPLÉTER]" ? `, ${b.quartier}` : ""}
              </p>
              <p className="mt-5 font-titre text-[1.75rem] font-extrabold text-marine">{formatPrix(b.prix, b.periode)}</p>

              {infos.length > 0 && (
                <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-marine/10 py-5">
                  {infos.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <Icon className="h-5 w-5 shrink-0 text-or" />
                      <div>
                        <dt className="text-xs text-encre/55">{label}</dt>
                        <dd className="font-titre font-bold text-marine">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}

              <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6 w-full !text-base">
                <IconWhatsApp className="h-5 w-5" /> Je suis intéressé
              </a>
              <a href={`tel:${site.contact.telephones[0].lien}`} className="btn btn-outline mt-3 w-full">
                <IconPhone className="h-5 w-5" /> Appeler le {site.contact.telephones[0].affiche}
              </a>
              {b.dossier && (
                <a href="#dossier-foncier" className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm ring-1 ring-emerald-600/20 hover:ring-emerald-600/50">
                  <IconShield className="h-6 w-6 shrink-0 text-emerald-700" />
                  <span>
                    <strong className="block font-titre text-emerald-800">Titre ACD · dossier vérifiable</strong>
                    <span className="text-encre/65">Documents, contrôles et position GPS</span>
                  </span>
                </a>
              )}
              <p className="mt-4 text-center text-xs text-encre/50">Référence : {b.dossier?.reference ?? b.slug}</p>
            </div>
          </aside>

          <div className="min-w-0 lg:col-start-1">

            <Reveal>
              <h2 className="text-xl font-bold md:text-2xl">Description</h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-encre/80 md:text-lg">{b.description}</p>
            </Reveal>

            {b.caracteristiques.length > 0 && (
              <Reveal className="mt-10">
                <h2 className="text-xl font-bold md:text-2xl">Caractéristiques</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {b.caracteristiques.map((c) => (
                    <li key={c} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-marine/5">
                      <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {b.dossier && (
              <div className="mt-12">
                <DossierFoncier bien={b} dossier={b.dossier} />
              </div>
            )}
          </div>

        </div>
      </div>

      {autres.length > 0 && (
        <section className="bg-sable/70 py-16 md:py-24">
          <div className="container-site">
            <h2 className="text-2xl font-extrabold md:text-3xl">Autres biens</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {autres.map((x) => <PropertyCard key={x.slug} bien={x} />)}
            </div>
          </div>
        </section>
      )}

      {/* Bouton fixe sur mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-marine/10 bg-white/95 p-3 pr-24 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
          <IconWhatsApp className="h-5 w-5" /> Je suis intéressé
        </a>
      </div>
    </>
  );
}
