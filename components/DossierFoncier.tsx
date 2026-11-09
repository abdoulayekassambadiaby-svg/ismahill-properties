import Link from "next/link";
import type { Bien, Controle, DossierFoncier as Dossier } from "@/data/biens";
import { empreinteFichierPublic } from "@/lib/dossiers";
import { cn, waLink } from "@/lib/utils";
import { IconCheck, IconClock, IconDocument, IconFingerprint, IconPin, IconScale, IconShield, IconVideo, IconWhatsApp } from "./Icons";

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
/** "2026-10-18" -> "18 octobre 2026" (identique serveur / navigateur). */
export function dateFr(iso?: string) {
  if (!iso) return "";
  const [a, m, j] = iso.split("-").map(Number);
  return `${j === 1 ? "1er" : j} ${MOIS[m - 1]} ${a}`;
}

const statuts: Record<Controle["statut"], { label: string; icon: typeof IconCheck; classe: string }> = {
  fait: { label: "Contrôlé", icon: IconCheck, classe: "bg-emerald-600 text-white" },
  "en-cours": { label: "En cours", icon: IconClock, classe: "bg-or text-marine-900" },
  "votre-notaire": { label: "Par votre notaire", icon: IconScale, classe: "bg-marine text-white" },
};

const rempli = (v?: string | number) => v !== undefined && v !== "" && !String(v).includes("[À COMPLÉTER]");

/** Dossier foncier d'un terrain : références de l'ACD, documents, contrôles et position GPS. */
export default function DossierFoncier({ bien, dossier }: { bien: Bien; dossier: Dossier }) {
  const titre = `${bien.exemple ? "[EXEMPLE] " : ""}${bien.titre}`;
  const msgDossier = `Bonjour ISMAHILL PROPERTIES, je souhaite recevoir le dossier foncier complet du terrain « ${titre} » (référence ${dossier.reference}).\nNom :\nPays de résidence :`;
  const msgVisio = `Bonjour ISMAHILL PROPERTIES, je souhaite une visite en appel vidéo du terrain « ${titre} » (référence ${dossier.reference}).\nMes disponibilités (avec le fuseau horaire) :`;

  const acd = [
    ["N° d'ACD", dossier.acd.numero],
    ["Lotissement", dossier.acd.lotissement],
    ["Îlot", dossier.acd.ilot],
    ["Lot", dossier.acd.lot],
    ["Superficie (ACD)", dossier.acd.superficie && `${dossier.acd.superficie} m²`],
  ].filter(([, v]) => rempli(v || undefined)) as [string, string][];

  const pos = dossier.position;
  const coords = pos && `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;

  return (
    <section id="dossier-foncier" className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-marine text-white">
          <IconShield className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">Dossier foncier vérifiable</h2>
          <p className="text-sm text-encre/60">
            Référence <strong className="font-titre font-bold text-marine">{dossier.reference}</strong> · mis à jour le {dateFr(dossier.misAJour)}
          </p>
        </div>
      </div>

      <p className="mt-4 leading-relaxed text-encre/75">
        Titre de propriété : <strong className="font-semibold text-marine">Arrêté de Concession Définitive (ACD)</strong>. Ne nous croyez pas sur parole :
        recevez les documents, vérifiez-les ci-dessous et faites-les contrôler par votre notaire avant tout paiement.
      </p>

      {acd.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {acd.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-marine/5">
              <dt className="text-xs text-encre/55">{k}</dt>
              <dd className="font-titre font-bold text-marine">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Contrôles */}
      <h3 className="mt-8 text-lg font-bold">Contrôles effectués</h3>
      <ul className="mt-3 divide-y divide-marine/8 overflow-hidden rounded-2xl bg-white ring-1 ring-marine/5">
        {dossier.controles.map((c) => {
          const s = statuts[c.statut];
          return (
            <li key={c.libelle} className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="font-medium text-encre">{c.libelle}</p>
                {(c.detail || c.date) && (
                  <p className="mt-0.5 text-sm text-encre/55">
                    {c.date && `Le ${dateFr(c.date)}`}
                    {c.date && c.detail && " · "}
                    {c.detail}
                  </p>
                )}
              </div>
              <span className={cn("inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 font-titre text-xs font-bold", s.classe)}>
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-sm text-encre/55">
        Nos contrôles ne remplacent pas ceux de l'administration : seule la vérification par votre notaire fait foi.
      </p>

      {/* Documents */}
      <h3 className="mt-8 text-lg font-bold">Documents du dossier</h3>
      <ul className="mt-3 grid gap-3">
        {dossier.documents.map((d) => {
          const empreinteApercu = d.apercu ? empreinteFichierPublic(d.apercu) : undefined;
          return (
            <li key={d.nom} className="rounded-2xl bg-white p-4 ring-1 ring-marine/5">
              <div className="flex items-start gap-3">
                <IconDocument className="mt-0.5 h-5 w-5 shrink-0 text-or" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-marine">{d.nom}</p>
                  {d.description && <p className="mt-0.5 text-sm text-encre/65">{d.description}</p>}
                  {(d.delivrePar || d.date) && (
                    <p className="mt-1 text-xs text-encre/50">
                      {d.delivrePar}
                      {d.delivrePar && d.date && " · "}
                      {d.date && dateFr(d.date)}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {d.apercu ? (
                      <a href={d.apercu} target="_blank" rel="noopener" className="font-semibold text-rose hover:underline">
                        Voir l'extrait masqué
                      </a>
                    ) : (
                      <span className="text-encre/55">Copie envoyée sur demande</span>
                    )}
                    {d.empreinte && (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <IconFingerprint className="h-4 w-4" /> Copie complète vérifiable en ligne
                      </span>
                    )}
                  </div>
                  {empreinteApercu && (
                    <details className="mt-2 text-xs text-encre/45">
                      <summary className="cursor-pointer">Empreinte de l'extrait (SHA-256)</summary>
                      <code className="mt-1 block break-all">{empreinteApercu}</code>
                    </details>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Position */}
      {pos && (
        <>
          <h3 className="mt-8 text-lg font-bold">Où se trouve la parcelle</h3>
          <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-2xl bg-sable ring-1 ring-marine/10 sm:aspect-[16/9]">
            <iframe
              title={`Vue satellite de la parcelle ${dossier.reference}`}
              src={`https://www.google.com/maps?q=${pos.lat},${pos.lng}&t=k&z=18&hl=fr&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-encre/65">
              <IconPin className="h-4 w-4 shrink-0 text-rose" /> GPS : <code className="font-semibold text-marine">{coords}</code>
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${pos.lat},${pos.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rose hover:underline"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
          <p className="mt-1 text-xs text-encre/50">
            Position relevée sur place par notre équipe le {dateFr(pos.releveeLe)}. Elle n'est pas officielle : seul un bornage par un géomètre expert fait foi pour les limites exactes.
          </p>
        </>
      )}

      {/* Actions */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a href={waLink(msgDossier)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <IconWhatsApp className="h-5 w-5" /> Recevoir le dossier complet
        </a>
        <a href={waLink(msgVisio)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <IconVideo className="h-5 w-5" /> Visite en vidéo
        </a>
        <Link href={`/verification/?ref=${encodeURIComponent(dossier.reference)}#verifier`} className="btn btn-rose sm:col-span-2">
          <IconFingerprint className="h-5 w-5" /> Vérifier un document reçu
        </Link>
      </div>
    </section>
  );
}
