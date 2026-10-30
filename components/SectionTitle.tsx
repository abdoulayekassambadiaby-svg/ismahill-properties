import { cn } from "@/lib/utils";
import { Reveal } from "./Motion";

export default function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className={cn("eyebrow", center && "justify-center", light && "!text-or-300")}>{eyebrow}</p>
      <h2 className={cn("mt-3 text-[1.75rem] leading-tight font-extrabold md:text-4xl", light && "!text-white")}>
        {title}
      </h2>
      {text && (
        <p className={cn("mt-4 text-base leading-relaxed md:text-lg", light ? "text-white/75" : "text-encre/70")}>
          {text}
        </p>
      )}
    </Reveal>
  );
}
