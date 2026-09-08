import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type MatchCtx = gsap.Context & { conditions?: Record<string, boolean> };

/**
 * Runs GSAP code scoped to a container with automatic cleanup.
 * `fn` receives a gsap.matchMedia instance so each effect can declare
 * exactly which viewport / motion preference it applies to.
 */
export function useGsap<T extends HTMLElement>(
  fn: (mm: gsap.MatchMedia, scope: T) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    fn(mm, el);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Generic scroll reveal for any [data-reveal] descendants.
 * Values: "up" (default), "fade", "scale", "left", "right".
 * data-reveal-delay="0.2" adds a delay in seconds.
 */
export function useReveal<T extends HTMLElement>(deps: DependencyList = []): RefObject<T | null> {
  return useGsap<T>((mm, scope) => {
    const items = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!items.length) return;

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx: MatchCtx) => {
        const { reduced } = ctx.conditions ?? {};
        if (reduced) {
          gsap.set(items, { clearProps: "all", opacity: 1 });
          return;
        }
        items.forEach((item) => {
          const kind = item.dataset.reveal || "up";
          const delay = Number(item.dataset.revealDelay || 0);
          const from: gsap.TweenVars = { opacity: 0 };
          if (kind === "up") Object.assign(from, { y: 40 });
          if (kind === "left") Object.assign(from, { x: -40 });
          if (kind === "right") Object.assign(from, { x: 40 });
          if (kind === "scale") Object.assign(from, { scale: 0.92, transformOrigin: "50% 60%" });
          gsap.fromTo(item, from, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.1,
            delay,
            ease: "premium",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
        });
      },
    );
  }, deps);
}

export { gsap, ScrollTrigger };
