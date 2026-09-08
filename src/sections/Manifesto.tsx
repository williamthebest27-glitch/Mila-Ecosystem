import { Fragment } from "react";
import { manifesto } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";

const HIGHLIGHT = new Set(manifesto.highlights.map((w) => w.toLowerCase()));

function normalize(w: string) {
  return w.toLowerCase().replace(/[.,:;]/g, "");
}

/**
 * 02 — Manifesto. A light, sticky statement in black Apple-style type:
 * the title sharpens and scales, the statement lights up word by word.
 */
export function Manifesto() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    const words = q<HTMLElement>("[data-m-word]");

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 64rem)",
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });

        tl.fromTo(
          q("[data-m-title]"),
          { autoAlpha: 0, scale: 0.9, filter: desktop ? "blur(14px)" : "blur(0px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.32 },
          0,
        )
          .fromTo(q("[data-m-label]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.05)
          .fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: { each: 0.5 / words.length }, duration: 0.5 }, 0.36)
          .fromTo(q("[data-m-foot]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.86)
          .to(q("[data-m-title]"), { scale: 1.04, duration: 0.5 }, 0.5);
      },
    );
  });

  const words = manifesto.statement.split(" ");

  return (
    <section ref={ref} className="relative bg-ivory-2 text-ink h-[240vh] lg:h-[300vh] motion-reduce:!h-auto" aria-labelledby="manifesto-title">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-[var(--nav-h)] pb-6 motion-reduce:!static motion-reduce:!h-auto motion-reduce:py-[clamp(5rem,12vw,11rem)]">
        <div className="container-x relative">
          <p data-m-label className="label">
            {manifesto.label}
          </p>
          <h2 id="manifesto-title" data-m-title className="display m-title mt-6 max-w-[12ch] font-semibold tracking-[-0.05em] text-ink will-change-transform lg:mt-8">
            Un ecosistema per <span className="serif-accent font-normal text-sage-deep">migliorarti</span> a 360°.
          </h2>

          <p className="m-statement mt-8 max-w-5xl font-medium leading-[1.15] tracking-[-0.03em] text-ink lg:mt-12">
            {words.map((w, i) => {
              const hl = HIGHLIGHT.has(normalize(w));
              return (
                <Fragment key={i}>
                  <span data-m-word className={`inline-block ${hl ? "serif-accent font-normal text-sage-deep" : ""}`}>
                    {w}
                  </span>{" "}
                </Fragment>
              );
            })}
          </p>

          <p data-m-foot className="mt-6 max-w-xl text-[clamp(0.9rem,1.9svh,1rem)] leading-relaxed text-mute lg:mt-10">
            {manifesto.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
