import { ArrowUpRight } from "lucide-react";
import { resources } from "@/data/content";
import { useReveal } from "@/hooks/useGsap";
import { Link } from "@/components/Link";
import { SplitWords } from "@/components/Split";
import { useGsap, gsap } from "@/hooks/useGsap";

/**
 * Free resources as an editorial index: one row per item, hover reveals
 * the arrow, everything stays scannable.
 */
export function Resources() {
  const revealRef = useReveal<HTMLOListElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-r-title] .split-word"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.06, ease: "premium", scrollTrigger: { trigger: q("[data-r-title]"), start: "top 85%", once: true } },
      );
    });
  });

  return (
    <section ref={ref} className="bg-ivory-2 section-pad" aria-labelledby="resources-title">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">{resources.label}</p>
            <h2 id="resources-title" data-r-title className="display display-lg mt-5">
              <SplitWords text={resources.title} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end lg:max-w-sm">
            <p className="lede">{resources.lede}</p>
            <Link to={resources.all.to} className="link-underline mt-5 inline-flex items-center gap-2 text-sm font-medium">
              {resources.all.label}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ol ref={revealRef} className="mt-14 border-t hairline lg:mt-20">
          {resources.items.map((r, i) => (
            <li key={r.title} data-reveal data-reveal-delay={String(i * 0.04)}>
              <Link
                to={resources.cta.to}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b hairline py-6 transition-colors duration-500 hover:bg-ivory md:grid-cols-[4rem_10rem_1fr_auto] md:gap-x-8 md:py-7 lg:px-4 lg:-mx-4"
              >
                <span className="num text-[0.7rem] tracking-[0.2em] text-mute-2">{String(i + 1).padStart(2, "0")}</span>
                <span className="hidden md:block">
                  <span className="label !text-[0.625rem] text-ink">{r.kind}</span>
                  <span className="mt-1 block text-[0.75rem] text-mute-2">{r.meta}</span>
                </span>
                <span className="min-w-0">
                  <span className="display display-sm block font-normal transition-transform duration-500 [transition-timing-function:var(--ease-premium)] group-hover:translate-x-2">
                    {r.title}
                  </span>
                  <span className="mt-2 block text-[0.9rem] text-mute md:hidden">
                    {r.kind} · {r.meta}
                  </span>
                  <span className="mt-2 block text-[0.9rem] leading-snug text-mute">{r.description}</span>
                </span>
                <span className="flex items-center gap-3 justify-self-end">
                  <span className="hidden rounded-full border border-sage-deep/30 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-sage-deep sm:inline-block">
                    Gratis
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ink group-hover:text-ivory">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 [transition-timing-function:var(--ease-premium)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="sr-only">{resources.cta.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
