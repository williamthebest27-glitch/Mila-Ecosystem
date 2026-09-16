import { community } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { SplitWords } from "@/components/Split";
import { Glow } from "@/components/Atmosphere";

const [imgA, imgB, imgC, imgD, imgE] = community.images;

/**
 * 07 — Community as an editorial photo collage. Every image moves at its
 * own pace; the headline sits over the composition.
 */
export function Community() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-c-title] .split-word"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.3, stagger: 0.07, ease: "premium", scrollTrigger: { trigger: q("[data-c-title]"), start: "top 85%", once: true } },
      );
      q<HTMLElement>("[data-c-reveal]").forEach((el, i) => {
        gsap.fromTo(el, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, delay: i * 0.1, ease: "premium", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      // Image zoom while the collage crosses the viewport
      q<HTMLElement>("[data-speed] img").forEach((img) => {
        gsap.fromTo(img, { scale: 1 }, { scale: 1.1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    });

    mm.add("(min-width: 48rem) and (prefers-reduced-motion: no-preference)", () => {
      const stage = q<HTMLElement>("[data-c-stage]")[0];
      q<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = Number(el.dataset.speed || 1);
        const amp = (speed - 1) * 260;
        gsap.fromTo(el, { y: -amp }, { y: amp, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      });
    });
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-sage-wash section-pad" aria-labelledby="community-title">
      <Glow tone="gold" size="36rem" intensity={0.28} duration={27} className="-right-28 top-[6%]" />

      <div className="container-x relative">
        <div data-c-stage className="relative grid grid-cols-12 gap-3 md:gap-5">
          {/* Headline block — overlaps the top of the collage */}
          <div className="relative z-20 col-span-12 md:col-span-8 md:pr-8">
            <p className="label" data-c-reveal>
              {community.label}
            </p>
            <h2 id="community-title" data-c-title className="display display-xl mt-5 font-normal">
              <SplitWords text={community.title} />
            </h2>
          </div>

          {/* B — tall portrait, top right, fastest */}
          <figure data-speed="1.18" className="col-span-5 col-start-8 row-start-1 md:col-span-4 md:col-start-9 md:row-span-2 md:mt-12 overflow-hidden mask-arch">
            <img src={imgB.src} alt={imgB.alt} loading="lazy" className="aspect-[3/4] h-full w-full object-cover will-change-transform" />
          </figure>

          {/* A — wide landscape, left */}
          <figure data-speed="0.92" className="col-span-7 col-start-1 row-start-2 md:col-span-6 md:col-start-1 md:row-start-2 md:mt-6 overflow-hidden rounded-[1.25rem]">
            <img src={imgA.src} alt={imgA.alt} loading="lazy" className="aspect-[3/2] w-full object-cover object-[50%_20%] will-change-transform" />
          </figure>

          {/* D — small square, floats over A's edge */}
          <figure data-speed="1.3" className="col-span-4 col-start-9 row-start-2 self-end md:col-span-2 md:col-start-7 md:row-start-2 md:-ml-10 md:self-end overflow-hidden rounded-[1rem]">
            <img src={imgD.src} alt={imgD.alt} loading="lazy" className="aspect-square w-full object-cover will-change-transform" />
          </figure>

          {/* C — landscape, centre bottom */}
          <figure data-speed="1.02" className="col-span-8 col-start-3 row-start-3 md:col-span-6 md:col-start-4 md:row-start-3 md:-mt-10 overflow-hidden rounded-[1.25rem]">
            <img src={imgC.src} alt={imgC.alt} loading="lazy" className="aspect-[16/10] w-full object-cover will-change-transform" />
          </figure>

          {/* E — small vertical crop, right edge */}
          <figure data-speed="0.82" className="hidden md:block md:col-span-2 md:col-start-11 md:row-start-3 md:mt-20 overflow-hidden mask-pebble">
            <img src={imgE.src} alt={imgE.alt} loading="lazy" className="aspect-[3/4] w-full object-cover object-[35%_25%] will-change-transform" />
          </figure>

          {/* Copy block, bottom left, sits in the whitespace */}
          <div className="relative z-20 col-span-12 row-start-4 md:col-span-5 md:col-start-1 md:row-start-3 md:self-end md:pb-2 lg:col-span-4 lg:col-start-1" data-c-reveal>
            <div className="glass rounded-[1.75rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_80px_-40px_rgba(28,26,23,0.4)] sm:p-8">
            <p className="text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.55] text-ink">
              {community.lede}
            </p>
            <div className="mt-7">
              <Button to={community.cta.to} variant="primary" size="lg">
                {community.cta.label}
              </Button>
            </div>
            </div>
          </div>
        </div>

        <p className="mt-16 max-w-2xl border-t hairline pt-8 text-[0.95rem] leading-relaxed text-mute md:mt-24" data-c-reveal>
          {community.footnote}
        </p>
      </div>
    </section>
  );
}
