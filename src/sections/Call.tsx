import { call } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { SplitWords } from "@/components/Split";

/**
 * Il primo passo — the free initial call, staged as an editorial spread.
 */
export function Call() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-call-title] .split-word"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.06, ease: "premium", scrollTrigger: { trigger: q("[data-call-title]"), start: "top 85%", once: true } },
      );
      gsap.fromTo(
        q("[data-call-img] img"),
        { scale: 1.05 },
        { scale: 1.15, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      gsap.fromTo(
        q("[data-call-img]"),
        { clipPath: "inset(12% 0% 12% 0% round 999px 999px 1.5rem 1.5rem)", autoAlpha: 0.6 },
        { clipPath: "inset(0% 0% 0% 0% round 999px 999px 1.5rem 1.5rem)", autoAlpha: 1, duration: 1.6, ease: "premium", scrollTrigger: { trigger: q("[data-call-img]"), start: "top 80%", once: true } },
      );
    });
    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(q("[data-call-img]"), { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1.2 } });
    });
  });

  return (
    <section ref={ref} id="call-iniziale" className="bg-ivory section-pad" aria-labelledby="call-title">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Portrait */}
        <div className="lg:col-span-5 lg:pr-8">
          <figure data-call-img className="relative aspect-[3/4] overflow-hidden mask-arch">
            <img src={call.image} alt={call.imageAlt} loading="lazy" className="h-full w-full object-cover object-[50%_20%] will-change-transform" />
            <figcaption className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              {call.facts.map((f) => (
                <span key={f} className="rounded-full bg-ivory/90 px-3.5 py-1.5 text-[0.7rem] font-medium tracking-[0.04em] text-ink backdrop-blur">
                  {f}
                </span>
              ))}
            </figcaption>
          </figure>
        </div>

        {/* Copy + agenda */}
        <div ref={revealRef} className="flex flex-col justify-center lg:col-span-7 lg:pl-8">
          <p className="label" data-reveal>
            {call.label}
          </p>
          <h2 id="call-title" data-call-title className="display display-lg mt-5">
            {call.title.map((line, i) => (
              <span key={i} className="block">
                <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
              </span>
            ))}
          </h2>
          <p className="lede mt-6 max-w-xl" data-reveal>
            {call.lede}
          </p>

          <div className="mt-12 border-t hairline" data-reveal>
            <p className="label pt-6">{call.agendaTitle}</p>
            <ol className="mt-4 grid gap-x-10 sm:grid-cols-2">
              {call.agenda.map((a, i) => (
                <li key={a.title} className="flex gap-4 border-b hairline py-5 sm:last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                  <span className="num pt-1 text-[0.7rem] tracking-[0.2em] text-mute-2">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[1.05rem] font-medium tracking-[-0.01em]">{a.title}</span>
                    <span className="mt-1 block text-[0.9rem] leading-snug text-mute">{a.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5" data-reveal>
            <Button to={call.cta.to} variant="primary" size="lg" arrow="up">
              {call.cta.label}
            </Button>
            <span className="text-sm text-mute">{call.facts.join(" · ")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
