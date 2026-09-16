import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { areas, ecosystem, routes } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Glow, Sparkles } from "@/components/Atmosphere";

type Node = {
  name: string;
  role: string;
  points: string[];
  area: string;
  index: string;
  pos: string; // desktop absolute position classes
  rotate: number;
  from: { x: number; y: number };
  speed: number;
};

const figures = areas.flatMap((a) => a.figures.map((f) => ({ ...f, area: a.title, index: a.index })));

const NODES: Node[] = [
  { ...figures[0], pos: "left-[2%] top-[6%]", rotate: -3, from: { x: -80, y: -40 }, speed: 0.9 },
  { ...figures[1], pos: "right-[4%] top-[2%]", rotate: 2.5, from: { x: 80, y: -60 }, speed: 1.15 },
  { ...figures[2], pos: "left-0 top-[44%]", rotate: 1.5, from: { x: -100, y: 0 }, speed: 1.3 },
  { ...figures[3], pos: "right-[1%] top-[40%]", rotate: -2, from: { x: 100, y: 20 }, speed: 0.8 },
  { ...figures[4], pos: "left-[8%] bottom-[4%]", rotate: 2, from: { x: -60, y: 80 }, speed: 1.2 },
  { ...figures[5], pos: "right-[22%] bottom-0", rotate: -1.5, from: { x: 40, y: 90 }, speed: 1 },
  { ...figures[6], pos: "left-[34%] top-0", rotate: 1, from: { x: 0, y: -90 }, speed: 1.1 },
];

/** A figure card that opens on hover / focus (desktop) or tap (touch) and reveals a summary. */
function FigureCard({ node, open, onToggle, compact = false }: { node: Node; open?: boolean; onToggle?: () => void; compact?: boolean }) {
  return (
    <article className="group relative rounded-[1.25rem] border border-ink/10 bg-white shadow-[0_24px_60px_-36px_rgba(28,26,23,0.35)] transition-[border-color,box-shadow,transform] duration-500 [transition-timing-function:var(--ease-premium)] hover:-translate-y-1 hover:border-sage-deep/40 hover:shadow-[0_40px_80px_-40px_rgba(28,26,23,0.45)]">
      <button type="button" className={`block w-full text-left ${compact ? "p-4" : "p-5"}`} aria-expanded={open ?? false} onClick={onToggle}>
        <span className="flex items-center justify-between">
          <span className="num label !text-[0.625rem]">{node.index}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-sage-deep transition-transform duration-500 group-hover:scale-150" />
        </span>
        <span className={`mt-4 block font-medium leading-tight tracking-[-0.02em] ${compact ? "text-[0.95rem]" : "text-[1.05rem]"}`}>{node.name}</span>
        <span className={`mt-1.5 block leading-snug text-mute ${compact ? "text-[0.75rem]" : "text-[0.8rem]"}`}>{node.role}</span>
        <span className="mt-3 block text-[0.625rem] uppercase tracking-[0.16em] text-mute-2">{node.area}</span>
      </button>

      <div className="card-panel" data-open={open ? "true" : "false"}>
        <div>
          <div className={`card-panel-inner border-t border-ink/8 ${compact ? "px-4 pb-4 pt-3" : "px-5 pb-5 pt-4"}`}>
            <p className="label !text-[0.6rem] text-sage-deep">In sintesi</p>
            <ul className="mt-2 space-y-1.5 text-[0.85rem] leading-snug text-ink/80">
              {node.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-sage-deep" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link to={routes.percorsi} className="link-underline mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-sage-deep">
              Scopri il percorso
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * 03 — The ecosystem as an art-directed composition: a stable word at the
 * centre and the seven figures orbiting it. Each card opens on hover and
 * summarises what that figure offers.
 */
export function Ecosystem() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-eco-word]"),
        { scale: 0.85, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.6, ease: "premium", scrollTrigger: { trigger: q("[data-eco-stage]"), start: "top 75%", once: true } },
      );
    });

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const stage = q<HTMLElement>("[data-eco-stage]")[0];
      Array.from(stage.querySelectorAll<HTMLElement>("[data-eco-node]")).forEach((node, i) => {
        const n = NODES[i];
        gsap.fromTo(
          node,
          { x: n.from.x, y: n.from.y, rotate: n.rotate * 3, autoAlpha: 0 },
          { x: 0, y: 0, rotate: n.rotate, autoAlpha: 1, duration: 1.4, delay: i * 0.08, ease: "premium", scrollTrigger: { trigger: stage, start: "top 70%", once: true } },
        );
        gsap.fromTo(
          node.firstElementChild,
          { y: (n.speed - 1) * -140 },
          { y: (n.speed - 1) * 140, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
      });
      q<HTMLElement>("[data-eco-img]").forEach((img, i) => {
        gsap.fromTo(
          img,
          { y: 60 * (i + 1), autoAlpha: 0 },
          { y: -60 * (i + 1), autoAlpha: 1, ease: "none", scrollTrigger: { trigger: stage, start: "top 80%", end: "bottom top", scrub: 1 } },
        );
      });
    });

    // Hovering a card floats it to the middle of the screen and opens it, then
    // sends it home when the pointer leaves. Mouse only: on a wide touch screen
    // a tap would strand the card at the centre with no pointermove to release
    // it. The return is driven by pointermove against the card's home box
    // rather than by pointerleave, because the card slides out from under the
    // cursor the instant it starts moving and would otherwise flip-flop.
    mm.add("(min-width: 64rem) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const nodes = q<HTMLElement>("[data-eco-stage] [data-eco-node]");
      let active: { node: HTMLElement; index: number; home: DOMRect } | null = null;

      const within = (r: DOMRect, x: number, y: number, pad = 10) =>
        x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;

      const send = (node: HTMLElement, index: number) => {
        if (active?.node === node) return;
        if (active) home();
        const rect = node.getBoundingClientRect();
        // The panel opens downward, so the card's centre drops by half of what
        // the panel adds. Aim at where the centre will end up, not where it is.
        const panel = node.querySelector<HTMLElement>(".card-panel > div");
        const grows = panel ? panel.scrollHeight : 0;
        const tall = rect.height + grows;
        active = { node, index, home: rect };
        setOpenIdx(index);
        gsap.set(node, { zIndex: 60 });
        gsap.to(node, {
          x: window.innerWidth / 2 - (rect.left + rect.width / 2),
          y: window.innerHeight / 2 - (rect.top + rect.height / 2 + grows / 2),
          scale: Math.min(1.32, (window.innerHeight * 0.82) / tall),
          rotate: 0,
          duration: 0.85,
          ease: "premium",
          overwrite: "auto",
        });
      };

      const home = () => {
        if (!active) return;
        const { node, index } = active;
        active = null;
        setOpenIdx((v) => (v === index ? null : v));
        gsap.to(node, {
          x: 0,
          y: 0,
          scale: 1,
          rotate: NODES[index].rotate,
          duration: 0.8,
          ease: "premium",
          overwrite: "auto",
          onComplete: () => gsap.set(node, { clearProps: "zIndex" }),
        });
      };

      const onMove = (e: PointerEvent) => {
        if (!active) return;
        // Keep it out while the pointer is either still over where the card was
        // or over the card itself, so the expanded card stays reachable.
        if (within(active.home, e.clientX, e.clientY)) return;
        if (within(active.node.getBoundingClientRect(), e.clientX, e.clientY)) return;
        home();
      };

      const enters = nodes.map((node, i) => {
        const fn = () => send(node, i);
        node.addEventListener("pointerenter", fn);
        return fn;
      });
      window.addEventListener("pointermove", onMove);
      window.addEventListener("scroll", home, { passive: true });

      return () => {
        nodes.forEach((node, i) => node.removeEventListener("pointerenter", enters[i]));
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", home);
        home();
      };
    });

    mm.add("(max-width: 63.98rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-eco-grid] [data-eco-node]"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07, ease: "premium", scrollTrigger: { trigger: q("[data-eco-grid]"), start: "top 85%", once: true } },
      );
    });
  });

  return (
    <section ref={ref} id="ecosistema" className="relative overflow-hidden bg-ivory section-pad scroll-mt-[var(--nav-h)]" aria-labelledby="eco-title">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">{ecosystem.label}</p>
            <h2 id="eco-title" className="display display-md mt-5">
              {ecosystem.intro}
            </h2>
            <p className="mt-4 text-sm text-mute"><span className="lg:hidden">Tocca una figura per scoprire cosa fa.</span><span className="hidden lg:inline">Passa il mouse su una figura per scoprire cosa fa.</span></p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:col-span-5 lg:justify-end" aria-label="Livelli di accesso">
            {ecosystem.levels.map((l, i) => (
              <li key={l} className="flex items-center gap-2 text-sm text-mute">
                <span className="num text-[0.625rem] tracking-[0.2em] text-mute-2">0{i + 1}</span>
                {l}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop stage */}
        <div data-eco-stage className="relative mt-16 hidden h-[min(88vh,820px)] lg:block">
          {/* La parola al centro sta dentro un alone dorato che pulsa piano */}
          <Glow tone="gold" size="34rem" intensity={0.3} duration={21} className="left-[calc(50%-17rem)] top-[calc(50%-17rem)]" />
          <Sparkles count={10} seed={7} tone="gold" minSize={6} maxSize={15} />
          {/* Split per letter so each one lifts and greens under the pointer.
              The paragraph stays pointer-events-none and only the glyphs opt
              back in, so the gaps around the word never steal hovers from the
              figure cards orbiting it. */}
          <p
            data-eco-word
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(4rem,9.2vw,9rem)] font-medium leading-none tracking-[-0.06em] text-ink"
          >
            {Array.from(ecosystem.word).map((ch, i) => (
              <span key={i} className="eco-letter">
                {ch}
              </span>
            ))}
          </p>

          {NODES.map((n, i) => (
            <div key={n.name} data-eco-node className={`absolute z-10 w-[clamp(220px,17vw,270px)] hover:z-30 focus-within:z-30 ${n.pos}`}>
              <FigureCard node={n} open={openIdx === i} onToggle={() => setOpenIdx((v) => (v === i ? null : i))} />
            </div>
          ))}

          <figure data-eco-img className="absolute left-[21%] bottom-[18%] w-[9vw] max-w-[150px] overflow-hidden rounded-[1rem]">
            <img src="/images/coaching-square.webp" alt="" width={900} height={900} loading="lazy" className="aspect-square w-full object-cover" />
          </figure>
          <figure data-eco-img className="absolute right-[13%] top-[18%] w-[8vw] max-w-[130px] overflow-hidden mask-arch-sm">
            <img src="/images/garden-circle.webp" alt="" width={1000} height={1333} loading="lazy" className="aspect-[3/4] w-full object-cover" />
          </figure>
          <figure data-eco-img className="absolute right-[31%] bottom-[18%] w-[7vw] max-w-[110px] overflow-hidden mask-pebble">
            <img src="/images/community-circle-crop.webp" alt="" width={900} height={1100} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </figure>
        </div>

        {/* Mobile / tablet composition */}
        <div className="mt-12 lg:hidden">
          <p aria-hidden="true" className="select-none text-[clamp(3.25rem,15vw,7rem)] font-medium leading-none tracking-[-0.06em] text-ink">
            {ecosystem.word}
          </p>
          <div data-eco-grid className="mt-8 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3">
            {NODES.map((n, i) => (
              <div key={n.name} data-eco-node className="self-start" style={{ rotate: `${n.rotate * 0.4}deg` }}>
                <FigureCard node={n} compact open={openIdx === i} onToggle={() => setOpenIdx((v) => (v === i ? null : i))} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t hairline pt-10 lg:mt-24 lg:grid-cols-12 lg:items-center">
          <p className="body-copy max-w-xl lg:col-span-7">{ecosystem.expansion}</p>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button to={ecosystem.primary.to} variant="primary">
              {ecosystem.primary.label}
            </Button>
            <Button to={ecosystem.secondary.to} variant="ghost" arrow="up">
              {ecosystem.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
