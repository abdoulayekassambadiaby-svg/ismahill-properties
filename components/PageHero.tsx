import SmartImage from "./SmartImage";
import Ribbons from "./Ribbons";

/** Bandeau d'en-tête des pages intérieures. */
export default function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-marine">
      <SmartImage src={image} alt="" priority sizes="100vw" maxWidth={1440} quality={60} className="!absolute inset-0 -z-20 opacity-35" imgClassName="hero-zoom" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-marine via-marine/90 to-marine/50" />
      <div className="container-site relative pt-16 pb-24 md:pt-24 md:pb-32">
        <p className="eyebrow hero-in !text-or-300">{eyebrow}</p>
        <h1 className="hero-in mt-4 max-w-3xl text-[2rem] leading-tight font-extrabold !text-white [animation-delay:100ms] md:text-5xl">
          {title}
        </h1>
        {text && (
          <p className="hero-in mt-5 max-w-2xl text-base leading-relaxed text-white/80 [animation-delay:200ms] md:text-lg">
            {text}
          </p>
        )}
        {children && <div className="hero-in mt-8 [animation-delay:300ms]">{children}</div>}
      </div>
      <Ribbons variant="dark" className="-bottom-6 left-0 h-24 md:h-32" />
    </section>
  );
}
