import { story } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { SplitWords } from "@/components/Split";

/**
 * 04 — Story / mission as a cinematic editorial spread. The photograph
 * stays with the reader and slowly zooms while the letter unfolds.
 */
export function Story() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Title, word by word
      gsap.fromTo(
        q("[data-s-title] .split-word"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.05, ease: "premium", scrollTrigger: { trigger: q("[data-s-title]"), start: "top 85%", once: true } },
      );
      // Paragraphs rise one by one
      q<HTMLElement>("[data-s-p]").forEach((p) => {
        gsap.fromTo(p, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "premium", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
      });
      // Pull quote highlight sweeps in
      gsap.fromTo(
        q("[data-s-pull] .split-word"),
        { autoAlpha: 0.15 },
        { autoAlpha: 1, stagger: 0.04, ease: "none", scrollTrigger: { trigger: q("[data-s-pull]"), start: "top 80%", end: "bottom 55%", scrub: 0.5 } },
      );
      // Image zoom + overlay shift over the whole section
      gsap.fromTo(
        q("[data-s-img] img"),
        { scale: 1 },
        { scale: 1.12, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      // Velo chiaro che si alza: la fotografia emerge dal fondo pagina
      // anziché uscire dal buio.
      gsap.fromTo(
        q("[data-s-overlay]"),
        { opacity: 0.6 },
        { opacity: 0.08, ease: "none", scrollTrigger: { trigger: scope, start: "top 70%", end: "center center", scrub: 1 } },
      );
    });

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-s-img]"),
        { yPercent: -4 },
        { yPercent: 4, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1.2 } },
      );
    });
  });

  return (
    <section ref={ref} className="relative bg-sage-wash text-ink" aria-labelledby="story-title">
      <div className="grid lg:grid-cols-12">
        {/* Photograph — sticky on desktop, full-bleed on mobile */}
        <div className="relative lg:col-span-5">
          <div data-s-img className="relative h-[70svh] overflow-hidden lg:sticky lg:top-0 lg:h-[100svh]">
            <img src={story.image} alt={story.imageAlt} loading="lazy" className="h-full w-full object-cover object-[50%_35%] will-change-transform" />
            <div data-s-overlay aria-hidden="true" className="absolute inset-0 bg-sage-wash opacity-30" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sage-wash via-sage-wash/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-sage-wash/75" />
            <p className="label absolute bottom-6 left-[var(--gutter)] rounded-full bg-ivory/85 px-3.5 py-1.5 backdrop-blur-sm lg:left-8">{story.label}</p>
          </div>
        </div>

        {/* Letter */}
        <div className="relative lg:col-span-7">
          <div className="container-x py-[clamp(4rem,9vw,8rem)] lg:pl-[clamp(2rem,6vw,7rem)] lg:pr-[var(--gutter)]">
            <h2 id="story-title" data-s-title className="display display-lg font-normal">
              {story.title.map((line, i) => (
                <span key={i} className="block">
                  <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
                </span>
              ))}
            </h2>

            <div className="mt-12 max-w-[38rem] space-y-6 text-[clamp(1.05rem,1.3vw,1.2rem)] leading-[1.6] text-ink/75 lg:mt-16">
              {story.paragraphs.map((p, i) => (
                <p key={i} data-s-p className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:font-normal first-letter:text-sage-deep serif-accent-first" : ""}>
                  {p}
                </p>
              ))}
              <p data-s-p className="text-ink">
                {story.closing}
              </p>
            </div>

            <blockquote data-s-pull className="mt-10 max-w-[26ch] text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.1] tracking-[-0.03em] lg:mt-14">
              <SplitWords text={story.pull} wordClass="serif-accent text-ink" />
            </blockquote>

            <div className="mt-12" data-s-p>
              <Button to={story.cta.to} variant="ghost" arrow="up">
                {story.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
