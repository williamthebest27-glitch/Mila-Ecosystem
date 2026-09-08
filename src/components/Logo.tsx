import { logoLockup } from "@/data/logo";
import { Link } from "./Link";

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 5.5c6.5 4.6 6.5 16.4 0 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Header lockup. Both artworks are stacked and cross-faded — one drawn for
 * light glass, one re-coloured for dark — so crossing a dark section never
 * swaps a `src` and re-decodes an image mid-transition.
 */
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const face =
    "absolute inset-0 h-full w-full object-contain transition-opacity duration-700 [transition-timing-function:var(--ease-premium)]";

  return (
    <Link
      to="/"
      aria-label="Mila Ecosystem — Home"
      className={`group block h-8 shrink-0 sm:h-9 ${className}`}
    >
      <span
        className="relative block h-full transition-transform duration-700 [transition-timing-function:var(--ease-premium)] group-hover:scale-[1.04]"
        style={{ aspectRatio: String(logoLockup.ratio) }}
      >
        <img src={logoLockup.src} alt="Mila Ecosystem" className={face} style={{ opacity: light ? 0 : 1 }} />
        <img src={logoLockup.srcDark} alt="" aria-hidden="true" className={face} style={{ opacity: light ? 1 : 0 }} />
      </span>
    </Link>
  );
}
