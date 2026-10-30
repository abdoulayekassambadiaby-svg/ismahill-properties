"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn, imgUrl } from "@/lib/utils";
import SmartImage from "./SmartImage";
import { IconChevron, IconClose } from "./Icons";

/** Galerie photos : grande image, vignettes, plein écran avec balayage (swipe) sur mobile. */
export default function Gallery({ photos, titre }: { photos: string[]; titre: string }) {
  const [index, setIndex] = useState(0);
  const [plein, setPlein] = useState(false);
  const n = photos.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (!plein) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlein(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [plein, go]);

  const fleche = "absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-marine shadow-lg hover:bg-white";

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] md:aspect-[16/10]">
        <button type="button" onClick={() => setPlein(true)} className="absolute inset-0 cursor-zoom-in" aria-label="Agrandir la photo">
          <SmartImage
            key={photos[index]}
            src={photos[index]}
            alt={`${titre} — photo ${index + 1} sur ${n}`}
            priority={index === 0}
            sizes="(min-width:1024px) 800px, 100vw"
            maxWidth={1440}
            className="absolute inset-0"
          />
        </button>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={cn(fleche, "left-3")} aria-label="Photo précédente">
              <IconChevron className="h-5 w-5 rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} className={cn(fleche, "right-3")} aria-label="Photo suivante">
              <IconChevron className="h-5 w-5" />
            </button>
            <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
              {index + 1} / {n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition md:h-20 md:w-28",
                i === index ? "ring-rose" : "opacity-70 ring-transparent hover:opacity-100",
              )}
            >
              <SmartImage src={p} alt="" sizes="112px" maxWidth={400} quality={55} className="absolute inset-0" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {plein && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photos — ${titre}`}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-marine-900/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlein(false)}
          >
            <m.img
              key={index}
              src={imgUrl(photos[index], 1600, 75)}
              alt={`${titre} — photo ${index + 1} sur ${n}`}
              className="max-h-[85vh] max-w-[94vw] rounded-xl object-contain"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              drag={n > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" onClick={() => setPlein(false)} className="absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Fermer">
              <IconClose className="h-6 w-6" />
            </button>
            {n > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} className={cn(fleche, "left-3 hidden md:grid")} aria-label="Photo précédente">
                  <IconChevron className="h-5 w-5 rotate-180" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} className={cn(fleche, "right-3 hidden md:grid")} aria-label="Photo suivante">
                  <IconChevron className="h-5 w-5" />
                </button>
                <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
                  {index + 1} / {n} <span className="md:hidden">· glissez pour changer</span>
                </p>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
