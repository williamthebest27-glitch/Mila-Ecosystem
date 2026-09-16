import { areas } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";

/**
 * 05 — Pillars as vertical storytelling. Desktop: a sticky stage where the
 * number, content and image swap as the user scrolls. Mobile: a composed
 * stacked narrative with reveals.
 */
export function Pillars() {
  const n = areas.length;

  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const nums = q<HTMLElement>("[data-p-num]");
      const panels = q<HTMLElement>("[data-p-panel]");
      const images = q<HTMLElement>("[data-p-img]");
      const bar = q<HTMLElement>("[data-p-bar]")[0];

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q("[data-p-track]")[0], start: "top top", end: "bottom bottom", scrub: 0.6 },
      });

      // Initial state
      gsap.set(nums.slice(1), { autoAlpha: 0, y: 60 });
      gsap.set(panels.slice(1), { autoAlpha: 0 });
      gsap.set(images.slice(1), { autoAlpha: 0 });
      gsap.set(images[0]?.querySelector("img") ?? [], { scale: 1 });

      for (let i = 0; i < n; i++) {
        const at = i;
        if (i > 0) {
          // previous slides out
          tl.to(nums[i - 1], { autoAlpha: 0, y: -60, duration: 0.3 }, at)
            .to(panels[i - 1].querySelectorAll("[data-p-item]"), { autoAlpha: 0, y: -30, duration: 0.25, stagger: 0.02 }, at)
            .to(images[i - 1], { autoAlpha: 0, duration: 0.3 }, at)
            // new enters
            .fromTo(nums[i], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.1)
            .set(panels[i], { autoAlpha: 1 }, at + 0.1)
            .fromTo(panels[i].querySelectorAll("[data-p-item]"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.035 }, at + 0.12)
            .fromTo(images[i], { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, at + 0.1);
        }
        // Hold: gentle zoom while the pillar is active
        tl.to(images[i].querySelector("img"), { scale: 1.08, duration: 0.9 }, at + 0.1);
      }
      // Progress bar
      tl.fromTo(bar, { scaleY: 1 / n }, { scaleY: 1, duration: n }, 0);
    });

    // Below lg the sticky stage is replaced by a stacked narrative, which the
    // generic [data-reveal] fade left looking flat next to it. Each article
    // now composes itself: the index rises, the tagline slides in, the photo
    // wipes up while its image un-zooms, then the copy staggers in. The photo
    // also drifts as the article passes, so the block is never quite still.
    mm.add("(max-width: 63.98rem) and (prefers-reduced-motion: no-preference)", () => {
      q<HTMLElement>("[data-p-m-article]").forEach((article) => {
        const pick = <T extends HTMLElement>(sel: string) => article.querySelector<T>(sel);
        const figure = pick("[data-p-m-fig]");
        const image = pick<HTMLImageElement>("[data-p-m-fig] img");
        const items = article.querySelectorAll<HTMLElement>("[data-p-m-item]");

        gsap
          .timeline({
            defaults: { ease: "premium" },
            scrollTrigger: { trigger: article, start: "top 80%", once: true },
          })
          .fromTo(pick("[data-p-m-num]"), { yPercent: 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.95 }, 0)
          .fromTo(pick("[data-p-m-tag]"), { x: 28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.85 }, 0.12)
          .fromTo(figure, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15 }, 0.18)
          .fromTo(image, { scale: 1.16 }, { scale: 1, duration: 1.5 }, 0.18)
          .fromTo(items, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 0.5);

        gsap.fromTo(
          image,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: "none",
            scrollTrigger: { trigger: article, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    });
  });

  return (
    <section ref={ref} id="aree" className="relative bg-ivory-2 scroll-mt-[var(--nav-h)]" aria-labelledby="pillars-title">
      {/* Section intro (shared) */}
      <div className="container-x pt-[clamp(5rem,10vw,9rem)]">
        <div className="grid gap-6 border-b hairline pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="label">Le tre aree</p>
            <h2 id="pillars-title" className="display display-md mt-5 max-w-[16ch]">
              Mente, corpo e indipendenza economica. Ogni area ha le sue <span className="serif-accent text-sage-deep">specialiste</span>.
            </h2>
          </div>
          <p className="body-copy lg:col-span-4 lg:justify-self-end lg:max-w-xs">
            Per ogni area trovi risorse gratuite, percorsi in autonomia e percorsi personalizzati.
          </p>
        </div>
      </div>

      {/* Desktop sticky storytelling */}
      <div data-p-track className="relative hidden lg:block motion-reduce:!hidden" style={{ height: `${(n + 1) * 100}vh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="pillars-stage container-x grid h-full grid-cols-12 items-center gap-6 pt-[var(--nav-h)] pb-8 xl:gap-8">
            {/* Number + progress */}
            <div className="relative col-span-2 flex h-[60%] flex-col justify-between">
              <div className="relative h-[1.1em] text-[clamp(5rem,9vw,9rem)] font-medium leading-none tracking-[-0.06em] num">
                {areas.map((a) => (
                  <span key={a.index} data-p-num className="absolute left-0 top-0 text-ink">
                    {a.index}
                  </span>
                ))}
              </div>
              <div className="flex items-end gap-4">
                <span className="relative block h-32 w-px bg-ink/12">
                  <span data-p-bar className="absolute inset-0 origin-top bg-ink" />
                </span>
                <span className="label !text-[0.75rem]">{n} aree</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative col-span-7 h-[calc(100svh-var(--nav-h)-4rem)] xl:col-span-6">
              {areas.map((a) => (
                <div key={a.slug} data-p-panel className="absolute inset-0 flex flex-col justify-center">
                  <p data-p-item className="label !text-[0.85rem] text-sage-deep">
                    {a.tagline}
                  </p>
                  <h3 data-p-item className="display display-md mt-4">
                    {a.title}
                  </h3>
                  <p data-p-item className="lede mt-5 max-w-lg">
                    {a.description}
                  </p>
                  <ul className={`p-figures mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2 ${a.figures.length > 2 ? "lg:grid-cols-3" : ""}`} aria-label="Figure dell'area">
                    {a.figures.map((f) => (
                      <li key={f.name} data-p-item className={`border-t hairline pt-4 ${a.figures.length === 1 ? "sm:col-span-2" : ""} ${a.figures.length === 3 ? "lg:col-span-1" : ""}`}>
                        <p className="text-[1.15rem] font-medium tracking-[-0.015em]">{f.name}</p>
                        <p className="mt-1 text-[0.9rem] text-sage-deep">{f.role}</p>
                        <ul className={`p-points mt-3 space-y-2 text-[0.98rem] leading-snug text-ink/80 ${a.figures.length === 1 ? "sm:columns-2 sm:gap-8" : ""}`}>
                          {f.points.map((p) => (
                            <li key={p} className="flex gap-2 break-inside-avoid">
                              <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-sage-deep" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="relative col-span-3 h-[64%] xl:col-span-4 xl:pl-6">
              {areas.map((a) => (
                <figure key={a.slug} data-p-img className="absolute inset-0 overflow-hidden mask-arch">
                  <img src={a.image} alt={a.imageAlt} loading="lazy" className="h-full w-full object-cover will-change-transform" />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet narrative */}
      <div className="container-x pb-[clamp(5rem,10vw,9rem)] lg:hidden motion-reduce:!block">
        {areas.map((a) => (
          <article key={a.slug} data-p-m-article className="grid gap-6 border-b hairline py-12 last:border-b-0">
            <div className="flex items-baseline justify-between">
              <span data-p-m-num className="num text-[clamp(3.5rem,16vw,6rem)] font-medium leading-none tracking-[-0.06em]">{a.index}</span>
              <span data-p-m-tag className="label !text-[0.8rem] text-sage-deep">{a.tagline}</span>
            </div>
            <figure data-p-m-fig className="overflow-hidden mask-arch-sm">
              <img src={a.image} alt={a.imageAlt} loading="lazy" className="aspect-[4/3] max-h-[70vh] w-full object-cover will-change-transform" />
            </figure>
            <h3 data-p-m-item className="display display-md">
              {a.title}
            </h3>
            <p data-p-m-item className="lede">
              {a.description}
            </p>
            <ul className="grid gap-5 sm:grid-cols-2">
              {a.figures.map((f) => (
                <li key={f.name} data-p-m-item className="border-t hairline pt-4">
                  <p className="text-[1.15rem] font-medium">{f.name}</p>
                  <p className="mt-1 text-[0.95rem] text-sage-deep">{f.role}</p>
                  <ul className="mt-3 space-y-2 text-[1rem] leading-snug text-ink/80">
                    {f.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-sage-deep" aria-hidden="true" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
