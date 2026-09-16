import { thoughts } from "@/data/content";
import { useReveal } from "@/hooks/useGsap";
import { LogoMark } from "@/components/Logo";

/**
 * Pensieri da portare con te — the eight quotes as a slow editorial
 * marquee (paused on hover, static when reduced motion is requested).
 */
export function Thoughts() {
  const ref = useReveal<HTMLElement>();
  const row = [...thoughts.quotes, ...thoughts.quotes];

  return (
    <section ref={ref} className="overflow-hidden bg-ivory py-[clamp(4rem,8vw,7rem)]" aria-labelledby="thoughts-title">
      <div className="container-x">
        <p id="thoughts-title" className="label" data-reveal>
          {thoughts.label}
        </p>
      </div>

      <div className="marquee mt-10 border-y hairline py-8 lg:mt-14 lg:py-12" data-reveal>
        <ul className="marquee-track items-center" aria-hidden="true">
          {row.map((q, i) => (
            <li key={i} className="flex shrink-0 items-center gap-10 pr-10">
              <span className="serif-accent whitespace-nowrap text-[clamp(1.5rem,3vw,2.75rem)] leading-none text-ink">“{q}”</span>
              <LogoMark className="h-5 w-5 text-sage-deep" />
            </li>
          ))}
        </ul>
        {/* Accessible, non-moving list for screen readers and reduced motion */}
        <ul className="sr-only">
          {thoughts.quotes.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
