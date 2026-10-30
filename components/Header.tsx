"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { navigation, site } from "@/data/site";
import { cn, waLink } from "@/lib/utils";
import { IconClose, IconMenu, IconPhone, IconWhatsApp } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header
      className={cn(
        "sticky top-0 z-[45] border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || open
          ? "border-marine/10 bg-creme/95 shadow-[0_8px_30px_-18px_rgba(1,47,109,0.35)] backdrop-blur"
          : "border-transparent bg-creme",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="shrink-0" aria-label={`${site.nom} — accueil`}>
          <picture>
            <source srcSet="/logo-mark.webp" type="image/webp" />
            <img
              src="/logo-mark.png"
              alt={site.nom}
              width={400}
              height={122}
              className="h-10 w-auto md:h-12"
            />
          </picture>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 font-titre text-[0.9rem] font-semibold transition-colors",
                    isActive(item.href) ? "text-rose" : "text-marine hover:text-rose",
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded bg-or" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.contact.telephones[0].lien}`}
            className="hidden items-center gap-2 font-titre text-sm font-semibold text-marine xl:flex"
          >
            <IconPhone className="h-4 w-4 text-rose" />
            {site.contact.telephones[0].affiche}
          </a>
          <Link href="/proprietaires/" className="btn btn-rose hidden !min-h-11 !px-5 !text-sm md:inline-flex">
            Confier mon bien
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-marine hover:bg-marine/5 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto border-t border-marine/10 bg-creme lg:hidden"
          >
            <nav aria-label="Navigation mobile" className="container-site flex min-h-full flex-col py-6">
              <ul className="space-y-1">
                {navigation.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.08 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 font-titre text-lg font-semibold",
                        isActive(item.href) ? "bg-marine text-white" : "text-marine hover:bg-marine/5",
                      )}
                    >
                      {item.label}
                    </Link>
                  </m.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3 pt-8">
                <Link href="/proprietaires/" onClick={() => setOpen(false)} className="btn btn-rose w-full">
                  Confier mon bien
                </Link>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                  <IconWhatsApp className="h-5 w-5" /> Écrire sur WhatsApp
                </a>
                <a href={`tel:${site.contact.telephones[0].lien}`} className="btn btn-outline w-full">
                  <IconPhone className="h-5 w-5" /> {site.contact.telephones[0].affiche}
                </a>
                <p className="pt-2 text-center font-slogan text-sm italic text-marine/70">{site.slogan}</p>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
