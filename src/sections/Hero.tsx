import { Play, Plus, Sparkles, Sprout, Users } from "lucide-react";
import { hero } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { onIntroDone } from "@/lib/intro";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";

const ICONS = { users: Users, sprout: Sprout, sparkles: Sparkles } as const;

function Floats() {
  return (
    <>
      <Link
        to={hero.video.to}
        data-hero-float
        className="glass group inline-flex w-fit items-center gap-4 rounded-full border border-white/70 bg-white/45 py-2 pl-2 pr-6 text-ink shadow-[0_20px_50px_-30px_rgba(28,26,23,0.4)] transition-transform duration-500 [transition-timing-function:var(--ease-premium)] hover:-translate-y-1 lg:absolute lg:right-0 lg:top-[44svh]"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/85 text-[#8a6a4e] transition-transform duration-500 group-hover:scale-105">
          <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="text-[0.95rem] font-medium leading-tight">
          {hero.video.label[0]}
          <br />
          {hero.video.label[1]}
        </span>
      </Link>

      <div
        data-hero-float
        className="glass flex w-full max-w-[34rem] items-center gap-5 rounded-[2rem] border border-white/70 bg-white/50 p-3 pr-6 shadow-[0_24px_60px_-30px_rgba(28,26,23,0.45)] lg:absolute lg:right-0 lg:top-[70svh]"
      >
        <span className="flex shrink-0 items-center">
          {hero.proof.avatars.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              width={80}
              height={80}
              loading="eager"
              className={`h-12 w-12 rounded-[0.9rem] border-2 border-white object-cover shadow-sm lg:h-16 lg:w-16 lg:rounded-[1.1rem] ${i > 0 ? "-ml-3 lg:-ml-4" : ""}`}
            />
          ))}
          <span className="ml-2 grid h-9 w-9 place-items-center rounded-full text-ink/70">
            <Plus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </span>
        <p className="flex-1 text-[0.85rem] leading-snug text-ink/85">{hero.proof.text}</p>
      </div>
    </>
  );
}

/**
 * 01 — Hero. Full-bleed photograph on the right, editorial copy on the left,
 * floating glass elements (video pill, social proof), handwritten accent and
 * an arch image peeking from the bottom edge.
 * Entrance: headline from the left → photo from the right → navbar from the
 * top → lede, buttons and features from the bottom.
 */
export function Hero() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    const header = document.querySelector<HTMLElement>("[data-site-header]");

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Built paused: `fromTo` still renders its start values immediately, so
      // the hero sits hidden under the intro screen and only plays once the
      // intro hands over. See lib/intro.
      // Below lg the copy is re-ordered and the handwritten line is centred, so
      // a couple of cues land at different points in the sequence there.
      const stacked = window.matchMedia("(max-width: 63.98rem)").matches;
      const script = q<HTMLElement>("[data-hero-script]")[0];
      const tl = gsap.timeline({ defaults: { ease: "premium" }, paused: true });
      const idle: gsap.core.Tween[] = [];

      // The intro screen already dissolved in from ivory, so the veil is now
      // only a short bloom — it used to run 2.6s and held the stage blank long
      // after the intro had lifted. The photograph still settles slowly behind
      // everything else (zoom-out, blur to sharp).
      tl.fromTo(q("[data-hero-veil]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.85, ease: "power2.out" }, 0)
        .fromTo(
          q("[data-hero-photo]"),
          { autoAlpha: 0, scale: 1.12, filter: "blur(14px)", transformOrigin: "70% 40%" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 2.4, ease: "power2.out" },
          0,
        );

      // 1. Headline from the left
      tl.fromTo(q("[data-hero-label]"), { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1 }, 0.1)
        .fromTo(q("[data-hero-line]"), { x: -90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.3, stagger: 0.13 }, 0.2);

      // 2. Floating cards from the right — minus the handwritten line below
      //    lg, which is held back to close the sequence.
      const floats = q<HTMLElement>("[data-hero-float]");
      const drifting = stacked && script ? floats.filter((el) => el !== script) : floats;
      tl.fromTo(drifting, { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.3, stagger: 0.16 }, 0.75);

      // 3. Navbar from the top
      if (header) tl.fromTo(header, { y: -72, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, clearProps: "transform,opacity,visibility" }, 1.05);

      // 4. Lede, buttons, features and bottom rail from below
      tl.fromTo(q("[data-hero-lede]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 1.45)
        .fromTo(q("[data-hero-cta]"), { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12 }, stacked ? 0.5 : 1.6)
        .fromTo(q("[data-hero-feature]"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 1.9)
        .fromTo(q("[data-hero-bottom]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 2.15)
        .fromTo(q("[data-hero-arch]"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.4 }, 1.85);

      // 5. Below lg the handwritten line closes the hero, once everything else
      //    has settled.
      if (stacked && script) {
        tl.fromTo(script, { autoAlpha: 0, scale: 0.88, y: 16 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.15 }, 2.95);
      }

      // Perpetual gentle floating for the three cards, each on its own rhythm
      q<HTMLElement>("[data-hero-float]").forEach((el, i) => {
        gsap.set(el, { rotate: i === 0 ? -8 : 0 });
        idle.push(
          gsap.to(el, {
            y: i % 2 ? 10 : -10,
            rotate: i === 0 ? -7.4 : i % 2 ? 0.6 : -0.6,
            duration: 3.2 + i * 0.7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: (stacked && el === script ? 4.3 : 2.15) + i * 0.4,
            paused: true,
          }),
        );
      });

      const st = { trigger: scope, start: "top top", end: "bottom top", scrub: 1 };
      gsap.to(q("[data-hero-photo] img"), { scale: 1.1, yPercent: 6, ease: "none", scrollTrigger: st });
      gsap.fromTo(q("[data-hero-bottom]"), { opacity: 1 }, { opacity: 0, ease: "none", scrollTrigger: { ...st, end: "30% top" } });

      return onIntroDone(() => {
        tl.play();
        idle.forEach((t) => t.play());
      });
    });

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const st = { trigger: scope, start: "top top", end: "bottom top", scrub: 1 };
      gsap.to(q("[data-hero-float-wrap]"), { yPercent: -18, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-hero-arch]"), { yPercent: 30, ease: "none", scrollTrigger: st });
    });
  });

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ivory" aria-labelledby="hero-title">
      {/* Soft veil for the opening dissolve */}
      <div data-hero-veil aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 bg-ivory opacity-0" />

      {/* Photograph: full-bleed on desktop, top block on mobile */}
      <div data-hero-photo className="relative h-[38svh] w-full overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[64%]">
        <img
          src="/images/hero-photo.webp"
          alt={hero.photoAlt}
          width={2000}
          height={1125}
          fetchPriority="high"
          className="h-full w-full object-cover object-[70%_30%] will-change-transform lg:object-[60%_35%]"
        />
        {/* Fade into the page ground */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/25 to-transparent lg:bg-gradient-to-r lg:from-ivory lg:via-ivory/40 lg:via-30% lg:to-transparent lg:to-60%" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory/70 to-transparent" />

        {/* Handwritten accent. Below lg it is centred across the photograph
            instead of pinned to the corner; the wrapper owns the placement so
            GSAP is free to transform the paragraph itself. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 lg:left-auto lg:right-[7%] lg:top-[16%] lg:translate-x-0 lg:translate-y-0">
          <p
            data-hero-float
            data-hero-script
            className="script rotate-[-8deg] text-center text-[clamp(1.6rem,3vw,2.75rem)] text-ink lg:text-right lg:text-[#8a6a4e]"
            aria-hidden="true"
          >
            {hero.script.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            <svg viewBox="0 0 160 12" className="mx-auto mt-1 h-3 w-32 lg:mr-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 8c30-6 60-6 90-4s45 2 66 0" />
            </svg>
          </p>
        </div>
        <p className="sr-only">{hero.script.join(". ")}</p>
      </div>

      <div className="container-x relative flex min-h-0 flex-col pb-10 pt-6 lg:h-[100svh] lg:justify-between lg:pb-[min(2rem,3svh)] lg:pt-[calc(var(--nav-h)+min(2.5rem,4svh))]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Copy */}
          {/* Below lg the two CTAs move above the headline (order-2), so the
              primary actions sit near the top of the copy on a phone or
              tablet. `lg:block` drops back to source order on desktop. */}
          <div className="flex flex-col lg:block lg:col-span-6 xl:col-span-6">
            <p data-hero-label className="label order-1">
              {hero.label}
            </p>
            <h1 id="hero-title" className="display display-hero order-3 mt-8 text-ink lg:mt-[min(1.5rem,2.2svh)]">
              <span data-hero-line className="block">
                {hero.lines[0]}
              </span>
              <span data-hero-line className="block">
                Costruisci la tua
              </span>
              <span data-hero-line className="serif-accent block font-normal text-sage-deep">
                indipendenza.
              </span>
              <span data-hero-line className="block">
                {hero.lines[2]}
              </span>
            </h1>
            <p data-hero-lede className="lede order-4 mt-6 max-w-[32rem] lg:mt-[min(1.5rem,2.4svh)] lg:text-[min(1.2rem,2.3svh)] lg:leading-[1.45]">
              {hero.lede}
            </p>
            <div className="order-2 mt-7 flex flex-wrap items-center gap-3 lg:mt-[min(2rem,3svh)]">
              <span data-hero-cta className="inline-block">
                <Button to={hero.primary.to} variant="primary" size="lg">
                  {hero.primary.label}
                </Button>
              </span>
              <span data-hero-cta className="inline-block">
                <Button to={hero.secondary.to} variant="ghost" arrow="up" size="lg">
                  {hero.secondary.label}
                </Button>
              </span>
            </div>

            {/* Feature trio */}
            <ul className="order-5 mt-10 grid gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-ink/12 lg:mt-[min(2.5rem,3.6svh)]" aria-label="Cosa trovi">
              {hero.features.map((f) => {
                const Icon = ICONS[f.icon as keyof typeof ICONS];
                return (
                  <li key={f.text.join(" ")} data-hero-feature className="flex items-center gap-3 sm:px-5 sm:first:pl-0">
                    <Icon className="h-7 w-7 shrink-0 text-[#8a6a4e]" strokeWidth={1.2} aria-hidden="true" />
                    <span className="text-[0.85rem] leading-snug text-ink/80 lg:text-[min(0.85rem,1.75svh)]">
                      {f.text[0]}
                      <br />
                      {f.text[1]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Floating glass elements — in flow on mobile */}
          <div className="flex flex-col gap-4 lg:hidden">
            <Floats />
          </div>
        </div>

        {/* Bottom rail */}
        <div className="mt-auto hidden items-end justify-between pt-6 lg:flex [@media(max-height:680px)]:!hidden">
          <div data-hero-bottom className="flex items-center gap-4">
            <span className="flex h-10 w-6 items-start justify-center rounded-full border border-ink/25 pt-2">
              <span className="scroll-dot block h-1.5 w-1.5 rounded-full bg-ink" />
            </span>
            <span className="label !text-[0.625rem] leading-relaxed">
              {hero.scroll[0]}
              <br />
              {hero.scroll[1]}
            </span>
          </div>
          <div data-hero-bottom className="flex items-end gap-4">
            <span className="label !text-[0.625rem] leading-relaxed text-right !text-ink/80">
              {hero.tagline[0]}
              <br />
              {hero.tagline[1]}
            </span>
            <span className="mb-1.5 block h-px w-14 bg-ink/60" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Floating glass elements — desktop layer over the photograph */}
      <div data-hero-float-wrap className="pointer-events-none absolute inset-y-0 right-[var(--gutter)] z-10 hidden w-[44%] lg:block [&>*]:pointer-events-auto">
        <Floats />
      </div>

      {/* Arch image peeking from the bottom edge */}
      <figure
        data-hero-arch
        className="pointer-events-none absolute -bottom-1 left-[52%] hidden w-[clamp(16rem,22vw,22rem)] -translate-x-1/2 overflow-hidden rounded-t-full lg:block [@media(max-height:700px)]:!hidden"
        aria-hidden="true"
      >
        <img src="/images/garden-circle.webp" alt="" width={1000} height={1333} loading="lazy" className="h-[11svh] w-full object-cover object-[50%_20%]" />
      </figure>
    </section>
  );
}
