import { ArrowUpRight } from "lucide-react";
import { milaReset } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";

/**
 * Punto 12 — Mila Reset, la porta d'ingresso in autonomia.
 *
 * Le otto cose che ci sono dentro stanno in una griglia fitta e paritaria:
 * nessuna e' il prodotto principale, e' l'insieme a essere l'offerta. Il
 * taglio e' volutamente piu' asciutto delle altre sezioni — qui si sta
 * spiegando cosa si compra, non si sta evocando un mondo.
 */
export function MilaReset() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-mr-title] .split-word"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-mr-title]"), start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        q("[data-mr-item]"),
        { y: 26, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.05,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-mr-grid]"), start: "top 85%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} id="mila-reset" className="relative overflow-x-clip bg-ivory section-pad scroll-mt-[var(--nav-h)]" aria-labelledby="reset-title">
      <Glow tone="gold" size="34rem" intensity={0.24} duration={26} className="-left-32 top-[8%]" />

      <div ref={revealRef} className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">{milaReset.kicker}</p>
            <h2 id="reset-title" data-mr-title className="display display-lg mt-5">
              <SplitWords text={milaReset.title} />
            </h2>
            <p className="lede mt-6 max-w-xl" data-reveal>
              {milaReset.lede}
            </p>
          </div>

          <p
            className="serif-accent text-[clamp(1.35rem,2.2vw,1.9rem)] leading-snug text-sage-deep lg:col-span-5 lg:justify-self-end lg:max-w-xs lg:text-right"
            data-reveal
            data-reveal-delay="0.15"
          >
            {milaReset.pitch}
          </p>
        </div>

        <p className="label mt-16 border-t hairline pt-6 lg:mt-24" data-reveal>
          {milaReset.itemsLabel}
        </p>

        <ul data-mr-grid className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {milaReset.items.map((item) => (
            <li key={item.title} data-mr-item className="border-t hairline pt-5">
              <p className="text-[1.05rem] font-medium tracking-[-0.015em]">{item.title}</p>
              <p className="mt-2 text-[0.9rem] leading-snug text-mute">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-8 rounded-[1.5rem] bg-ivory-2/70 p-8 lg:mt-24 lg:grid-cols-12 lg:items-center lg:p-10" data-reveal>
          <div className="lg:col-span-7">
            <p className="label">{milaReset.access.label}</p>
            <p className="body-copy mt-4 max-w-xl">{milaReset.access.text}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 lg:col-span-5 lg:justify-end">
            <Button to={milaReset.cta.to} variant="primary" size="lg" highlight>
              {milaReset.cta.label}
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center" data-reveal>
          <Link
            to={milaReset.secondary.to}
            className="link-underline inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-mute"
          >
            {milaReset.secondary.label}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
