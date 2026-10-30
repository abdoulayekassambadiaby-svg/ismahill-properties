import { waLink } from "@/lib/utils";
import { IconWhatsApp } from "./Icons";

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="group fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 md:right-6 md:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.5s] motion-reduce:hidden" />
      <IconWhatsApp className="h-7 w-7" />
      <span className="hidden pr-1 font-titre text-sm font-semibold md:inline">WhatsApp</span>
    </a>
  );
}
