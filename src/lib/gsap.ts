import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: "premium", duration: 1 });

// Premium ease shared by every animation: cubic-bezier(0.22, 1, 0.36, 1)
gsap.registerEase("premium", (p: number) => {
  // Cubic-bezier approximation via CustomEase-free polynomial (expo-out flavour)
  const c1 = 0.22, c2 = 1, c3 = 0.36, c4 = 1;
  // Solve bezier x(t)=p for t (Newton), then return y(t)
  let t = p;
  for (let i = 0; i < 5; i++) {
    const x = bez(t, c1, c3) - p;
    const dx = dbez(t, c1, c3);
    if (Math.abs(dx) < 1e-6) break;
    t -= x / dx;
  }
  return bez(Math.min(1, Math.max(0, t)), c2, c4);
});

function bez(t: number, p1: number, p2: number) {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t;
}
function dbez(t: number, p1: number, p2: number) {
  const mt = 1 - t;
  return 3 * mt * mt * p1 + 6 * mt * t * (p2 - p1) + 3 * t * t * (1 - p2);
}

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 63.98rem) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger };
