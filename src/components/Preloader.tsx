import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { completeIntro } from "@/lib/intro";
import { logoFull } from "@/data/logo";

const { start, end } = logoFull.wordmark;

/**
 * Intro screen. The logo settles in and a rule fills beneath the logotype,
 * running from the "M" of Mila to the "m" of Ecosystem, before the panel lifts
 * away and hands the page its cue.
 *
 * Mounted above the router, so it plays once per page load and never on a
 * client-side navigation.
 */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const restore = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const logo = root.querySelector<HTMLElement>("[data-intro-logo]");
    const track = root.querySelector<HTMLElement>("[data-intro-track]");
    const fill = root.querySelector<HTMLElement>("[data-intro-fill]");
    let tl: gsap.core.Timeline | null = null;
    let started = false;

    const finish = () => {
      html.style.overflow = restore;
      // Positions measured while the intro held the page locked (and while its
      // images were still arriving) can be stale, which leaves scroll reveals
      // firing at the wrong point or not at all.
      ScrollTrigger.refresh();
      completeIntro();
      setGone(true);
    };

    const play = () => {
      if (started) return;
      started = true;
      if (reduced) {
        tl = gsap
          .timeline({ onComplete: finish })
          .fromTo(logo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power1.out" })
          .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "none" }, 0.1)
          .to(root, { autoAlpha: 0, duration: 0.4, ease: "power1.out", onStart: completeIntro }, "+=0.3");
        return;
      }
      tl = gsap
        .timeline({ onComplete: finish })
        .fromTo(
          logo,
          { autoAlpha: 0, scale: 0.96, yPercent: 4 },
          { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.95, ease: "premium" },
          0,
        )
        .fromTo(track, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, 0.3)
        .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1.25, ease: "power1.inOut" }, 0.45)
        .to([logo, track], { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, 1.78)
        // Hand over as the panel starts moving, not once it has gone: the hero
        // then animates in behind it and the reveal is continuous.
        .to(root, { yPercent: -105, duration: 0.8, ease: "premium", onStart: completeIntro }, 1.9);
    };

    startRef.current = play;
    // Start once the artwork has decoded, but never wait on it for long.
    if (ready.current) play();
    const fallback = window.setTimeout(play, 1200);
    // GSAP runs off requestAnimationFrame, which a background tab throttles to a
    // crawl. Wall-clock backstop so the page is never left locked behind the
    // intro, however slowly the frames arrive.
    const backstop = window.setTimeout(() => (tl ? tl.progress(1) : finish()), 6000);

    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(backstop);
      tl?.kill();
      html.style.overflow = restore;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Caricamento"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center will-change-transform"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, #FFFDF6 0%, var(--color-ivory) 55%, var(--color-ivory-2) 100%)",
      }}
    >
      <div className="w-[min(80vw,42rem)]">
        <img
          data-intro-logo
          src={logoFull.src}
          alt="Mila Ecosystem — Empowerment femminile"
          className="block w-full will-change-transform"
          style={{ aspectRatio: String(logoFull.ratio) }}
          onLoad={() => {
            ready.current = true;
            startRef.current();
          }}
          onError={() => {
            ready.current = true;
            startRef.current();
          }}
        />
        {/* Spans exactly the logotype: the "M" of Mila to the "m" of Ecosystem. */}
        <div
          data-intro-track
          aria-hidden="true"
          className="relative mt-8 h-[2px] rounded-full bg-ink/10 sm:mt-9"
          style={{ marginLeft: `${start * 100}%`, width: `${(end - start) * 100}%` }}
        >
          <span
            data-intro-fill
            className="absolute inset-0 block origin-left rounded-full bg-sage-deep"
          />
        </div>
      </div>
    </div>
  );
}
