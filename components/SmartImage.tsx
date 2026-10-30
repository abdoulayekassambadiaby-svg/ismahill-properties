"use client";

import { useEffect, useRef, useState } from "react";
import { cn, imgSrcSet, imgUrl } from "@/lib/utils";

const WIDTHS = [400, 640, 828, 1080, 1440, 1920];

/**
 * Image légère et responsive :
 * - photos Unsplash redimensionnées et compressées automatiquement (WebP/AVIF) ;
 * - chargement différé (lazy) sauf pour l'image principale (priority) ;
 * - fond aux couleurs de la marque si la photo ne peut pas être chargée.
 */
export default function SmartImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
  maxWidth = 1920,
  quality = 70,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  maxWidth?: number;
  quality?: number;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // L'erreur a pu survenir avant le chargement du JavaScript : on la détecte ici.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);
  const widths = WIDTHS.filter((w) => w <= maxWidth);

  return (
    <div className={cn("photo-fallback overflow-hidden", !/(^|\s)!?absolute/.test(className ?? "") && "relative", className)}>
      {!failed && (
        <img
          ref={ref}
          src={imgUrl(src, Math.min(1080, maxWidth), quality)}
          srcSet={imgSrcSet(src, widths, quality)}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full object-cover text-transparent", imgClassName)}
        />
      )}
      {failed && (
        <div className="absolute inset-0 grid place-items-center">
          <img src="/icon-white.png" alt="" width={64} height={64} className="opacity-25" />
        </div>
      )}
    </div>
  );
}
