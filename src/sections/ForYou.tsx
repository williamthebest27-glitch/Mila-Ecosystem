import { forYou } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";

const total = forYou.phrases.length;

/**
 * 06 — "Forse Mila è per te se…" as a pinned horizontal journey on desktop
 * (vertical scroll drives horizontal movement) and a native swipe rail on
 * touch devices.
 */
export function ForYou() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const track = q<HTMLElement>("[data-fy-track]")[0];
      const stage = q<HTMLElement>("[data-fy-stage]")[0];
      const counter = q<HTMLElement>("[data-fy-counter]")[0];
      const cards = q<HTMLElement>("[data-fy-card]");
      const distance = () => track.scrollWidth - stage.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          pin: true,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(total, Math.max(1, Math.round(self.progress * (total - 1)) + 1));
            counter.textContent = String(idx).padStart(2, "0");
          },
        },
      });

      // Each card settles in as it crosses the viewport
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 28, autoAlpha: 0.35 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 60%", scrub: true },
          },
        );
      });
    });

    mm.add("(max-width: 63.98rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-fy-head] > *"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: "premium", scrollTrigger: { trigger: q("[data-fy-head]"), start: "top 85%", once: true } },
      );
    });
  });

  return (
    <section ref={ref} className="relative bg-ivory" aria-labelledby="foryou-title">
      {/* Mobile / tablet header */}
      <div data-fy-head className="container-x pt-[clamp(5rem,10vw,9rem)] lg:hidden motion-reduce:!block">
        <p className="label">{forYou.label}</p>
        <h2 id="foryou-title" className="display display-lg mt-5">
          {forYou.title}
        </h2>
        <p className="lede mt-5 max-w-md">{forYou.lede}</p>
      </div>

      <div data-fy-stage className="relative flex h-auto flex-col justify-center overflow-hidden lg:h-[100svh] motion-reduce:!h-auto">
        <div
          data-fy-track
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 lg:mt-0 lg:grid lg:grid-flow-col lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-5 lg:snap-none lg:overflow-visible lg:pb-0 lg:will-change-transform motion-reduce:!mt-10 motion-reduce:!flex motion-reduce:!gap-4 motion-reduce:!overflow-x-auto motion-reduce:!pb-4"
          role="list"
          aria-label="Frasi in cui riconoscerti"
        >
          {/* Desktop intro panel */}
          <div className="hidden w-[34vw] shrink-0 flex-col justify-center pr-16 lg:row-span-2 lg:flex motion-reduce:!hidden" role="presentation">
            <p className="label">{forYou.label}</p>
            <h2 className="display display-lg mt-5">{forYou.title}</h2>
            <p className="lede mt-6 max-w-sm">{forYou.lede}</p>
            <p className="mt-10 flex items-baseline gap-2 num">
              <span data-fy-counter className="text-4xl font-medium tracking-[-0.04em]">
                01
              </span>
              <span className="text-sm text-mute-2">/ {String(total).padStart(2, "0")}</span>
            </p>
          </div>

          {forYou.phrases.map((phrase, i) => (
            <article
              key={i}
              data-fy-card
              role="listitem"
              className={`flex w-[80vw] shrink-0 snap-start flex-col justify-between rounded-[1.5rem] border border-ink/10 bg-ivory-2/70 p-6 sm:w-[60vw] md:w-[46vw] lg:min-h-[15rem] lg:w-[21rem] lg:p-7 ${
                i % 2 === 1 ? "lg:ml-16 motion-reduce:!ml-0" : ""
              }`}
            >
              <span className="num label !text-[0.625rem]">
                {String(i + 1).padStart(2, "0")} / {total}
              </span>
              <p className="mt-10 text-[clamp(1.2rem,1.45vw,1.45rem)] leading-[1.25] tracking-[-0.02em] text-ink lg:mt-10">{phrase}</p>
            </article>
          ))}

          {/* Closing panel */}
          <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center ground-sage rounded-[1.5rem] p-8 text-ink sm:w-[60vw] md:w-[46vw] lg:row-span-2 lg:w-[28rem] lg:p-10">
            <p className="label">Ti sei riconosciuta?</p>
            <p className="display display-sm mt-4">Allora siamo nel posto giusto.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Button to={forYou.primary.to} variant="primary">
                {forYou.primary.label}
              </Button>
              <Button to={forYou.secondary.to} variant="ghost" arrow="up">
                {forYou.secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA row */}
      <div className="container-x flex flex-wrap gap-3 pb-[clamp(5rem,10vw,9rem)] pt-8 lg:hidden motion-reduce:!flex">
        <Button to={forYou.primary.to} variant="primary">
          {forYou.primary.label}
        </Button>
        <Button to={forYou.secondary.to} variant="ghost" arrow="up">
          {forYou.secondary.label}
        </Button>
      </div>
    </section>
  );
}
