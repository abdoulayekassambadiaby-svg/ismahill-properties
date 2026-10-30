import Link from "next/link";
import { site } from "@/data/site";
import { waLink } from "@/lib/utils";
import { IconArrow, IconWhatsApp } from "./Icons";
import { Reveal } from "./Motion";
import Ribbons from "./Ribbons";

export default function CtaFinal({
  title = "Votre patrimoine mérite l'excellence",
  text = "Location, vente, gestion ou conseil : parlons de votre projet. Réponse rapide sur WhatsApp.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-site py-16 md:py-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-marine px-6 py-14 text-center md:px-16 md:py-20">
          <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-rose/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-or/20 blur-3xl" />
          <Ribbons variant="dark" className="-bottom-10 left-0 -z-10 h-28" />
          <p className="font-slogan text-lg text-or-300 italic">{site.slogan}</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-[1.75rem] leading-tight font-extrabold !text-white md:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">{text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/proprietaires/" className="btn btn-rose">
              Confier mon bien <IconArrow className="h-4 w-4" />
            </Link>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <IconWhatsApp className="h-5 w-5" /> Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
