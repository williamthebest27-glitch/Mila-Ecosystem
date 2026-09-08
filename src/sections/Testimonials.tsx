import { testimonials } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";

const n = testimonials.length;

/**
 * 08 — Social proof as large typographic quotes. Desktop: a sticky stage
 * where each story enters from the left and leaves upward. Mobile: a
 * native swipe rail.
 */
export function Testimonials() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const quotes = q<HTMLElement>("[data-t-quote]");
      const counter = q<HTMLElement>("[data-t-counter]")[0];
      const bar = q<HTMLElement>("[data-t-bar]")[0];

      gsap.set(quotes.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q("[data-t-track]")[0],
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            const idx = Math.min(n, Math.floor(self.progress * n) + 1);
            counter.textContent = String(idx).padStart(2, "0");
          },
        },
      });

      for (let i = 0; i < n; i++) {
        const at = i;
        if (i > 0) {
          tl.to(quotes[i - 1].querySelectorAll("[data-t-line]"), { y: -50, autoAlpha: 0, duration: 0.3, stagger: 0.015 }, at)
            .set(quotes[i - 1], { autoAlpha: 0 }, at + 0.3)
            .set(quotes[i], { autoAlpha: 1 }, at + 0.2)
            .fromTo(quotes[i].querySelectorAll("[data-t-line]"), { x: -70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.03 }, at + 0.22);
        }
      }
      tl.fromTo(bar, { scaleX: 1 / n }, { scaleX: 1, duration: n }, 0);
    });

    mm.add("(max-width: 63.98rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-t-card]"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: "premium", scrollTrigger: { trigger: q("[data-t-rail]"), start: "top 85%", once: true } },
      );
    });
  });

  return (
    <section ref={ref} className="relative bg-ivory-2" aria-labelledby="testimonials-title">
      <div className="container-x pt-[clamp(5rem,10vw,9rem)] lg:pt-0 motion-reduce:!pt-[clamp(5rem,10vw,9rem)]">
        <h2 id="testimonials-title" className="sr-only">
          Storie della community
        </h2>
      </div>

      {/* Desktop sticky quotes */}
      <div data-t-track className="relative hidden lg:block motion-reduce:!hidden" style={{ height: `${n * 55 + 100}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden pt-[calc(var(--nav-h)+2rem)] pb-10">
          <div className="container-x flex items-center justify-between">
            <p className="label">Storie vere, raccontate con le loro parole</p>
            <p className="num flex items-baseline gap-2">
              <span data-t-counter className="text-3xl font-medium tracking-[-0.04em]">
                01
              </span>
              <span className="text-sm text-mute-2">/ {String(n).padStart(2, "0")}</span>
            </p>
          </div>

          <div className="container-x flex-1">
            <div className="relative h-full">
            {testimonials.map((t) => (
              <figure key={t.name} data-t-quote className="absolute inset-0 flex flex-col justify-center">
                <blockquote data-t-line className="max-w-[26ch] text-[clamp(1.75rem,3.2vw,3.4rem)] font-normal leading-[1.1] tracking-[-0.035em] text-pretty">
                  {t.quote}
                </blockquote>
                <figcaption data-t-line className="mt-10 flex items-center gap-4 text-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-ivory text-[0.8rem] font-medium">{t.name[0]}</span>
                  <span>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-mute">, {t.age} anni</span>
                  </span>
                  <span className="hidden text-[0.625rem] uppercase tracking-[0.16em] text-mute-2 xl:inline">· {t.note}</span>
                </figcaption>
              </figure>
            ))}
            </div>
          </div>

          <div className="container-x">
            <span className="block h-px w-full bg-ink/12">
              <span data-t-bar className="block h-px origin-left bg-ink" />
            </span>
          </div>
        </div>
      </div>

      {/* Mobile / tablet rail */}
      <div className="lg:hidden motion-reduce:!block pb-[clamp(5rem,10vw,9rem)]">
        <div className="container-x">
          <p className="label">Storie vere, raccontate con le loro parole</p>
        </div>
        <div data-t-rail className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2" role="list" aria-label="Testimonianze">
          {testimonials.map((t) => (
            <figure key={t.name} data-t-card role="listitem" className="flex w-[84vw] shrink-0 snap-start flex-col justify-between rounded-[1.5rem] bg-ivory p-6 sm:w-[64vw] md:w-[48vw]">
              <blockquote className="text-[clamp(1.2rem,4.6vw,1.6rem)] leading-[1.25] tracking-[-0.025em]">{t.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-ivory text-[0.75rem] font-medium">{t.name[0]}</span>
                <span>
                  <span className="font-medium">{t.name}</span>
                  <span className="text-mute">, {t.age} anni</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
