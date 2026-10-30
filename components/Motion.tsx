"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/** Charge uniquement les fonctions d'animation utiles (bundle plus léger). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/**
 * Apparition douce au défilement.
 * Le contenu reste visible tant que le JavaScript n'est pas chargé
 * (important sur connexion lente) : seuls les blocs encore sous l'écran
 * sont masqués puis révélés à leur arrivée.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    controls.set({ opacity: 0, y });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
          });
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [controls, delay, reduce, y]);

  return (
    <m.div ref={ref} animate={controls} className={className}>
      {children}
    </m.div>
  );
}
