import { site } from "@/data/site";

/** Carte Google Maps (chargée en différé pour ne pas ralentir la page). */
export default function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] bg-sable ring-1 ring-marine/10 ${className}`}>
      <iframe
        title="Carte : ISMAHILL PROPERTIES, Bingerville, palais de justice"
        src={site.contact.carteEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
      />
      <a
        href={site.contact.carteLien}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 rounded-full bg-white px-4 py-2 font-titre text-sm font-semibold text-marine shadow-md hover:bg-marine hover:text-white"
      >
        Ouvrir l'itinéraire
      </a>
    </div>
  );
}
