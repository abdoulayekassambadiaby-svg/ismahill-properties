import { cn } from "@/lib/utils";

/**
 * Rubans courbes marine / rose / or (décor de la charte).
 * variant="dark" pour les fonds marine, "light" pour les fonds clairs.
 */
export default function Ribbons({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const first = variant === "dark" ? "#ffffff" : "#012F6D";
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute w-full", className)}
    >
      <path
        d="M0 250 C 260 140, 520 330, 820 220 S 1240 90, 1440 170"
        fill="none"
        stroke={first}
        strokeOpacity={variant === "dark" ? 0.18 : 0.9}
        strokeWidth="10"
        strokeLinecap="round"
        className="ribbon-draw"
      />
      <path
        d="M0 275 C 300 170, 560 340, 860 245 S 1260 120, 1440 200"
        fill="none"
        stroke="#E0027B"
        strokeWidth="6"
        strokeLinecap="round"
        className="ribbon-draw [animation-delay:150ms]"
      />
      <path
        d="M0 296 C 320 200, 600 350, 900 268 S 1280 150, 1440 228"
        fill="none"
        stroke="#C9A227"
        strokeWidth="3"
        strokeLinecap="round"
        className="ribbon-draw [animation-delay:300ms]"
      />
    </svg>
  );
}
