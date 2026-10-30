import Link from "next/link";
import { navigation, services, site } from "@/data/site";
import { waLink } from "@/lib/utils";
import { IconMail, IconPhone, IconPin, IconWhatsApp } from "./Icons";
import Ribbons from "./Ribbons";

export default function Footer() {
  const reseaux = Object.entries(site.reseaux).filter(([, url]) => url);
  return (
    <footer className="relative overflow-hidden bg-marine-900 text-white/80">
      <Ribbons variant="dark" className="-top-24 left-0 h-48 opacity-60" />
      <div className="container-site relative grid gap-10 pt-20 pb-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
        <div>
          <picture>
            <source srcSet="/logo-mark-white.webp" type="image/webp" />
            <img src="/logo-mark-white.png" alt={site.nom} width={400} height={122} loading="lazy" className="h-12 w-auto" />
          </picture>
          <p className="mt-4 font-slogan text-lg italic text-or-300">{site.slogan}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Agence immobilière à Bingerville : location, vente, gestion locative et conseil dans tout le Grand Abidjan.
          </p>
          {reseaux.length > 0 && (
            <ul className="mt-5 flex gap-3">
              {reseaux.map(([nom, url]) => (
                <li key={nom}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm capitalize underline-offset-4 hover:text-white hover:underline">
                    {nom}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-titre text-sm font-bold tracking-[0.16em] text-white uppercase">Navigation</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-titre text-sm font-bold tracking-[0.16em] text-white uppercase">Nos services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services/#${s.id}`} className="hover:text-white">{s.titre}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-titre text-sm font-bold tracking-[0.16em] text-white uppercase">Contact</h2>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-white">
                <IconWhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" />
                <span>WhatsApp : {site.contact.whatsapp}</span>
              </a>
            </li>
            {site.contact.telephones.map((t) => (
              <li key={t.lien}>
                <a href={`tel:${t.lien}`} className="flex items-start gap-3 hover:text-white">
                  <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-or" />
                  <span>{t.affiche}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-start gap-3 break-all hover:text-white">
                <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-or" />
                <span>{site.contact.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-or" />
              <span>{site.contact.adresse}, {site.contact.pays}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 pb-24 text-xs text-white/50 md:flex-row md:items-center md:justify-between md:pb-6">
          <p>© {new Date().getFullYear()} {site.nom}. Tous droits réservés.</p>
          <Link href="/mentions-legales/" className="hover:text-white">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
