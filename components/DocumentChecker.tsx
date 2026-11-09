"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type DragEvent } from "react";
import type { EntreeRegistre } from "@/lib/dossiers";
import { cn } from "@/lib/utils";
import { IconAlert, IconCheck, IconDocument, IconUpload } from "./Icons";

type Resultat = {
  id: string;
  nom: string;
  taille: number;
  empreinte?: string;
  correspondances: EntreeRegistre[];
  erreur?: string;
};

type Dossier = { reference: string; slug: string; bien: string; exemple: boolean };

async function sha256(fichier: File) {
  const octets = await fichier.arrayBuffer();
  const h = await crypto.subtle.digest("SHA-256", octets);
  return Array.from(new Uint8Array(h), (x) => x.toString(16).padStart(2, "0")).join("");
}

function taille(n: number) {
  return n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} Ko` : `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`;
}

const normaliser = (s: string) => s.trim().toUpperCase().replace(/\s+/g, "");

/**
 * Vérifie, DANS LE NAVIGATEUR, que les documents reçus par un client sont
 * identiques à ceux enregistrés par l'agence (empreinte SHA-256).
 * Aucun fichier n'est envoyé sur Internet.
 */
export default function DocumentChecker({ registre, dossiers }: { registre: EntreeRegistre[]; dossiers: Dossier[] }) {
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [survol, setSurvol] = useState(false);
  const [calcul, setCalcul] = useState(false);
  const [ref, setRef] = useState("");
  const [refCherchee, setRefCherchee] = useState("");
  const input = useRef<HTMLInputElement>(null);

  // Référence pré-remplie depuis une fiche terrain : /verification/?ref=ISM-T-…
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("ref");
    if (r) {
      setRef(r);
      setRefCherchee(r);
    }
  }, []);

  async function analyser(liste: FileList | null) {
    if (!liste?.length) return;
    if (!globalThis.crypto?.subtle) {
      setResultats([{ id: "x", nom: "", taille: 0, correspondances: [], erreur: "Votre navigateur ne permet pas ce calcul. Mettez-le à jour ou utilisez Chrome, Safari, Firefox ou Edge récents." }]);
      return;
    }
    setCalcul(true);
    const nouveaux: Resultat[] = [];
    for (const f of Array.from(liste)) {
      const id = `${f.name}-${f.size}-${f.lastModified}-${Math.random()}`;
      try {
        const e = await sha256(f);
        nouveaux.push({ id, nom: f.name, taille: f.size, empreinte: e, correspondances: registre.filter((r) => r.empreinte === e) });
      } catch {
        nouveaux.push({ id, nom: f.name, taille: f.size, correspondances: [], erreur: "Impossible de lire ce fichier." });
      }
    }
    setResultats((prev) => [...nouveaux, ...prev]);
    setCalcul(false);
    if (input.current) input.current.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setSurvol(false);
    analyser(e.dataTransfer.files);
  }

  const dossierTrouve = refCherchee ? dossiers.find((d) => normaliser(d.reference) === normaliser(refCherchee)) : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* --- Vérifier un fichier --- */}
      <div className="min-w-0 rounded-[1.75rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(1,47,109,0.5)] ring-1 ring-marine/5 md:p-8">
        <h3 className="text-xl font-bold">Vérifier un document reçu</h3>
        <p className="mt-2 text-encre/70">
          Déposez le PDF ou l'image que nous vous avons envoyé. Le contrôle se fait sur votre appareil : <strong className="font-semibold text-marine">le fichier n'est envoyé nulle part.</strong>
        </p>

        <label
          htmlFor="fichiers-a-verifier"
          onDragOver={(e) => {
            e.preventDefault();
            setSurvol(true);
          }}
          onDragLeave={() => setSurvol(false)}
          onDrop={onDrop}
          className={cn(
            "mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            survol ? "border-rose bg-rose/5" : "border-marine/20 bg-creme hover:border-marine/40",
          )}
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-marine text-white">
            <IconUpload className="h-7 w-7" />
          </span>
          <span className="font-titre font-semibold text-marine">
            {calcul ? "Vérification en cours…" : "Choisir un ou plusieurs fichiers"}
          </span>
          <span className="text-sm text-encre/55">ou glissez-les ici</span>
          <input
            ref={input}
            id="fichiers-a-verifier"
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => analyser(e.target.files)}
          />
        </label>

        <ul className="mt-6 space-y-4" aria-live="polite">
          {resultats.map((r) => {
            const ok = r.correspondances.length > 0;
            const m = r.correspondances[0];
            return (
              <li
                key={r.id}
                className={cn(
                  "rounded-2xl p-5 ring-1",
                  r.erreur ? "bg-sable ring-marine/10" : ok ? "bg-emerald-50 ring-emerald-600/25" : "bg-rose/5 ring-rose/30",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white",
                      r.erreur ? "bg-encre/50" : ok ? "bg-emerald-600" : "bg-rose",
                    )}
                  >
                    {ok ? <IconCheck className="h-5 w-5" /> : <IconAlert className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    {r.nom && (
                      <p className="flex items-center gap-1.5 text-sm break-all text-encre/60">
                        <IconDocument className="h-4 w-4 shrink-0" /> {r.nom} · {taille(r.taille)}
                      </p>
                    )}
                    {r.erreur ? (
                      <p className="mt-1 font-semibold text-marine">{r.erreur}</p>
                    ) : ok ? (
                      <>
                        <p className="mt-1 font-titre text-lg font-bold text-emerald-800">Document authentique : identique à notre original</p>
                        <p className="mt-1 text-encre/80">
                          <strong className="font-semibold">{m.document}</strong>
                          {m.version === "apercu" ? " (extrait publié sur le site)" : " (copie complète)"}, dossier{" "}
                          <strong className="font-semibold">{m.reference}</strong> : {m.bien}.
                        </p>
                        {m.exemple && (
                          <p className="mt-2 text-sm text-rose">Il s'agit du document d'EXEMPLE de démonstration, pas d'un vrai titre.</p>
                        )}
                        <Link href={`/biens/${m.slug}/#dossier-foncier`} className="mt-3 inline-block text-sm font-semibold text-rose hover:underline">
                          Voir le dossier foncier du terrain
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="mt-1 font-titre text-lg font-bold text-rose">Document non reconnu</p>
                        <p className="mt-1 text-encre/80">
                          Ce fichier ne correspond à aucun document enregistré par ISMAHILL PROPERTIES.{" "}
                          <strong className="font-semibold">Ne versez aucune somme sur la base de ce document.</strong>
                        </p>
                        <p className="mt-2 text-sm text-encre/65">
                          Reçu par WhatsApp ? Demandez-le en tant que « Document » et non en « Photo » : WhatsApp compresse les photos, ce qui modifie le fichier. Si le doute persiste, appelez-nous.
                        </p>
                      </>
                    )}
                    {r.empreinte && (
                      <details className="mt-3 text-xs text-encre/50">
                        <summary className="cursor-pointer">Empreinte calculée (SHA-256)</summary>
                        <code className="mt-1 block break-all">{r.empreinte}</code>
                      </details>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- Retrouver un dossier --- */}
      <div className="min-w-0 rounded-[1.75rem] bg-marine p-6 text-white md:p-8">
        <h3 className="text-xl font-bold !text-white">Retrouver un dossier</h3>
        <p className="mt-2 text-white/75">
          Un intermédiaire vous propose un de nos terrains ? Saisissez la référence qu'il vous a donnée pour vérifier que le dossier existe bien chez nous.
        </p>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setRefCherchee(ref);
          }}
        >
          <label htmlFor="reference-dossier" className="sr-only">Référence du dossier</label>
          <input
            id="reference-dossier"
            className="field"
            placeholder="Ex. ISM-T-2026-001"
            autoCapitalize="characters"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          <button type="submit" className="btn btn-rose shrink-0">Rechercher</button>
        </form>
        {refCherchee && (
          <div className="mt-5 rounded-2xl bg-white/10 p-5" aria-live="polite">
            {dossierTrouve ? (
              <>
                <p className="flex items-center gap-2 font-titre font-bold text-or-300">
                  <IconCheck className="h-5 w-5" /> Dossier {dossierTrouve.reference} trouvé
                </p>
                <p className="mt-1 text-white/85">
                  {dossierTrouve.exemple && "[EXEMPLE] "}
                  {dossierTrouve.bien}
                </p>
                <Link href={`/biens/${dossierTrouve.slug}/#dossier-foncier`} className="btn btn-outline-light mt-4 !min-h-10 !py-2 text-sm">
                  Ouvrir le dossier foncier
                </Link>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 font-titre font-bold text-or-300">
                  <IconAlert className="h-5 w-5" /> Aucun dossier « {refCherchee.trim()} »
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Vérifiez l'orthographe. Si la référence vous a été donnée en notre nom, contactez-nous avant toute démarche.
                </p>
              </>
            )}
          </div>
        )}
        <p className="mt-6 text-sm text-white/55">
          Seuls les terrains publiés sur ce site sont proposés par ISMAHILL PROPERTIES.
        </p>
      </div>
    </div>
  );
}
