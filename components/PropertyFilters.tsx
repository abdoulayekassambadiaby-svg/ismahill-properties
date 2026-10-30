"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import type { Bien, TypeBien } from "@/data/biens";
import { cn, typeLabels, waLink } from "@/lib/utils";
import PropertyCard from "./PropertyCard";
import { IconWhatsApp } from "./Icons";

type Tri = "recent" | "prix-asc" | "prix-desc";
const TYPES: ("tous" | TypeBien)[] = ["tous", "location", "vente", "terrain"];

const toNumber = (v: string) => {
  const n = Number(v.replace(/\D/g, ""));
  return v.trim() && Number.isFinite(n) ? n : undefined;
};
const groupe = (v: string) => v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function PropertyFilters({ biens }: { biens: Bien[] }) {
  const params = useSearchParams();
  const initialType = params.get("type") as TypeBien | null;
  const [type, setType] = useState<"tous" | TypeBien>(
    initialType && TYPES.includes(initialType) ? initialType : "tous",
  );
  const [commune, setCommune] = useState("toutes");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [tri, setTri] = useState<Tri>("recent");

  const communes = useMemo(
    () => Array.from(new Set(biens.map((b) => b.commune))).sort((a, b) => a.localeCompare(b, "fr")),
    [biens],
  );

  const resultats = useMemo(() => {
    const min = toNumber(prixMin);
    const max = toNumber(prixMax);
    const r = biens.filter(
      (b) =>
        (type === "tous" || b.type === type) &&
        (commune === "toutes" || b.commune === commune) &&
        (min === undefined || b.prix >= min) &&
        (max === undefined || b.prix <= max),
    );
    if (tri === "prix-asc") r.sort((a, b) => a.prix - b.prix);
    else if (tri === "prix-desc") r.sort((a, b) => b.prix - a.prix);
    else r.sort((a, b) => b.date.localeCompare(a.date));
    return r;
  }, [biens, type, commune, prixMin, prixMax, tri]);

  const reset = () => {
    setType("tous");
    setCommune("toutes");
    setPrixMin("");
    setPrixMax("");
    setTri("recent");
  };

  const label = "mb-1.5 block font-titre text-xs font-bold tracking-wider text-marine/70 uppercase";

  return (
    <>
      <div className="relative z-10 -mt-16 rounded-3xl bg-white p-5 shadow-[0_30px_70px_-40px_rgba(1,47,109,0.55)] ring-1 ring-marine/5 md:p-7">
        <div role="group" aria-label="Type de bien" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 font-titre text-sm font-semibold transition-colors",
                type === t ? "bg-marine text-white" : "bg-sable text-marine hover:bg-marine/10",
              )}
            >
              {t === "tous" ? "Tous les biens" : t === "terrain" ? "Terrains" : typeLabels[t]}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="f-commune" className={label}>Commune</label>
            <select id="f-commune" className="field" value={commune} onChange={(e) => setCommune(e.target.value)}>
              <option value="toutes">Toutes les communes</option>
              {communes.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-min" className={label}>Prix min (FCFA)</label>
            <input id="f-min" className="field" inputMode="numeric" placeholder="Ex. 100 000" value={prixMin} onChange={(e) => setPrixMin(groupe(e.target.value))} />
          </div>
          <div>
            <label htmlFor="f-max" className={label}>Prix max (FCFA)</label>
            <input id="f-max" className="field" inputMode="numeric" placeholder="Ex. 50 000 000" value={prixMax} onChange={(e) => setPrixMax(groupe(e.target.value))} />
          </div>
          <div>
            <label htmlFor="f-tri" className={label}>Trier par</label>
            <select id="f-tri" className="field" value={tri} onChange={(e) => setTri(e.target.value as Tri)}>
              <option value="recent">Plus récents</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <p aria-live="polite" className="font-titre text-sm font-semibold text-marine">
          {resultats.length} bien{resultats.length > 1 ? "s" : ""} trouvé{resultats.length > 1 ? "s" : ""}
        </p>
        <button type="button" onClick={reset} className="text-sm font-semibold text-rose hover:underline">
          Réinitialiser
        </button>
      </div>

      {resultats.length > 0 ? (
        <m.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {resultats.map((b, i) => (
              <m.div
                key={b.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <PropertyCard bien={b} priority={i === 0} />
              </m.div>
            ))}
          </AnimatePresence>
        </m.div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-marine/20 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">Aucun bien ne correspond à votre recherche</h2>
          <p className="mx-auto mt-2 max-w-md text-encre/70">
            De nouveaux biens arrivent régulièrement. Dites-nous ce que vous cherchez, nous vous proposerons des offres adaptées.
          </p>
          <a
            href={waLink("Bonjour ISMAHILL PROPERTIES, je recherche un bien. Voici mes critères : ")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-6"
          >
            <IconWhatsApp className="h-5 w-5" /> Envoyer ma recherche
          </a>
        </div>
      )}
    </>
  );
}
