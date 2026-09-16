import { finalCta } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { SplitChars } from "@/components/Split";
import { Glow, Sparkles } from "@/components/Atmosphere";

/**
 * Final CTA as a manifesto: three enormous lines that scale into place while
 * the background warms up, then two quiet actions.
 */
export function FinalCta() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-f-title]"),
        { scale: 0.8, autoAlpha: 0, transformOrigin: "50% 100%" },
        { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: scope, start: "top 85%", end: "top 15%", scrub: 0.8 } },
      );
      gsap.fromTo(
        q("[data-f-title] .split-char"),
        { autoAlpha: 0, yPercent: 30 },
        { autoAlpha: 1, yPercent: 0, stagger: 0.02, duration: 0.8, ease: "premium", scrollTrigger: { trigger: q("[data-f-title]"), start: "top 80%", once: true } },
      );
      gsap.fromTo(
        scope,
        { backgroundColor: "#fefaf1" },
        { backgroundColor: "#e7f4e7", ease: "none", scrollTrigger: { trigger: scope, start: "top 70%", end: "bottom bottom", scrub: 1 } },
      );
      gsap.fromTo(
        q("[data-f-reveal]"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1, ease: "premium", scrollTrigger: { trigger: q("[data-f-reveal]")[0], start: "top 90%", once: true } },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory" aria-labelledby="final-title">
      {/* La chiusura è il momento più luminoso della pagina */}
      <Glow tone="gold" size="44rem" intensity={0.4} duration={26} className="-right-32 top-[2%]" />
      <Glow tone="sage" size="34rem" intensity={0.3} duration={32} delay={6} className="-left-28 bottom-[4%]" />
      <Sparkles count={9} seed={11} tone="gold" minSize={7} maxSize={17} />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-center py-[clamp(5rem,10vw,9rem)]">
        <h2 id="final-title" data-f-title className="display display-xl font-medium will-change-transform">
          {finalCta.lines.map((line, i) => (
            <span key={i} className={`block ${i === 2 ? "serif-accent font-light text-sage-deep" : ""}`}>
              <SplitChars text={line} />
            </span>
          ))}
        </h2>

        {/* Un filo dorato: l'unico accento prezioso della sezione. */}
        <hr className="rule-gold mt-14 lg:mt-20" aria-hidden="true" />
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          <p className="lede lg:col-span-5" data-f-reveal>
            {finalCta.lede}
          </p>
          <div className="flex flex-wrap gap-3 lg:col-span-7 lg:justify-end" data-f-reveal>
            <Button to={finalCta.primary.to} variant="primary" size="lg" arrow="up" highlight>
              {finalCta.primary.label}
            </Button>
            <Button to={finalCta.secondary.to} variant="ghost" size="lg">
              {finalCta.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
