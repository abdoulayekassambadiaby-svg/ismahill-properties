import Link from "next/link";
import type { Bien } from "@/data/biens";
import { cn, formatPrix, typeLabels } from "@/lib/utils";
import { IconBath, IconBed, IconPin, IconSurface } from "./Icons";
import SmartImage from "./SmartImage";

export function TypeBadge({ bien, className }: { bien: Bien; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 font-titre text-[0.7rem] font-bold tracking-wider uppercase shadow-sm ring-1 ring-white/40",
        bien.type === "location" && "bg-marine text-white",
        bien.type === "vente" && "bg-rose text-white",
        bien.type === "terrain" && "bg-or text-marine-900",
        className,
      )}
    >
      {typeLabels[bien.type]}
    </span>
  );
}

export function ExempleBadge() {
  return (
    <span className="rounded-full border border-dashed border-white bg-black/55 px-3 py-1 font-titre text-[0.7rem] font-bold tracking-[0.18em] text-white uppercase backdrop-blur">
      Exemple
    </span>
  );
}

export default function PropertyCard({ bien, priority = false }: { bien: Bien; priority?: boolean }) {
  const indispo = bien.disponible === false;
  return (
    <Link
      href={`/biens/${bien.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_45px_-30px_rgba(1,47,109,0.45)] ring-1 ring-marine/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(1,47,109,0.55)]"
    >
      <div className="relative aspect-[4/3]">
        <SmartImage
          src={bien.photos[0]}
          alt={bien.titre}
          priority={priority}
          sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw"
          maxWidth={1080}
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <TypeBadge bien={bien} />
          {bien.exemple && <ExempleBadge />}
        </div>
        {indispo && (
          <div className="absolute inset-0 grid place-items-center bg-marine/60">
            <span className="rounded-full bg-white px-4 py-1.5 font-titre text-sm font-bold text-marine">
              {bien.type === "location" ? "Loué" : "Vendu"}
            </span>
          </div>
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-black/45 px-2.5 py-1 text-xs text-white backdrop-blur">
          {bien.photos.length} photo{bien.photos.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-sm text-encre/60">
          <IconPin className="h-4 w-4 text-rose" />
          {bien.commune}
        </p>
        <h3 className="mt-1.5 text-lg leading-snug font-bold">
          {bien.exemple && <span className="text-rose">[EXEMPLE] </span>}
          {bien.titre}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-encre/70">
          {bien.surface && (
            <li className="flex items-center gap-1.5"><IconSurface className="h-4 w-4 text-or" />{bien.surface} m²</li>
          )}
          {bien.chambres && (
            <li className="flex items-center gap-1.5"><IconBed className="h-4 w-4 text-or" />{bien.chambres} ch.</li>
          )}
          {bien.sallesDeBain && (
            <li className="flex items-center gap-1.5"><IconBath className="h-4 w-4 text-or" />{bien.sallesDeBain} sdb</li>
          )}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-marine/10 pt-4">
          <p className="font-titre text-lg font-extrabold text-marine">{formatPrix(bien.prix, bien.periode)}</p>
          <span className="shrink-0 text-sm font-semibold text-rose group-hover:underline">Voir</span>
        </div>
      </div>
    </Link>
  );
}
