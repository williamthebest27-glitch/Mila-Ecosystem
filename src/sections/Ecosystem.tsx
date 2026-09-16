import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { areas, ecosystem, routes } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { EcosystemStage } from "./EcosystemStage";

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
        q("[data-eco-area]"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "premium", scrollTrigger: { trigger: q("[data-eco-areas]"), start: "top 88%", once: true } },
      );
    });

    mm.add("(max-width: 63.98rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-eco-grid] [data-eco-node]"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07, ease: "premium", scrollTrigger: { trigger: q("[data-eco-grid]"), start: "top 85%", once: true } },
      );
    });
  });

  // `overflow-x-clip` e non `overflow-hidden`: quest'ultimo renderebbe la
  // sezione un contenitore di scorrimento, e il `sticky` della scena si
  // ancorerebbe a lei invece che alla finestra, senza bloccarsi mai. `clip`
  // taglia in orizzontale — serve alla parola gigante sotto lg — senza
  // quell'effetto collaterale.
  return (
    <section ref={ref} id="ecosistema" className="relative overflow-x-clip bg-ivory section-pad scroll-mt-[var(--nav-h)]" aria-labelledby="eco-title">
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

        {/* Punto 9 — le tre dimensioni di vita su cui lavora l'ecosistema.
            Prima erano leggibili solo nella sezione "Le tre aree", molto più
            in basso: qui diventano la spina dorsale della sezione, e le
            schede che orbitano dichiarano a quale appartengono. */}
        <ul data-eco-areas className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] border hairline bg-line sm:grid-cols-3 lg:hidden motion-reduce:!grid">
          {areas.map((a) => (
            <li key={a.slug} data-eco-area className="bg-ivory p-6 lg:p-7">
              <span className="num label !text-[0.625rem]">{a.index}</span>
              <p className="display display-sm mt-3 font-normal">{a.title}</p>
              <p className="mt-1.5 text-[0.9rem] text-mute">{a.tagline}</p>
              <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5" aria-label={`Temi di ${a.title}`}>
                {a.themes.map((t) => (
                  <li key={t} className="rounded-full border border-ink/12 px-2.5 py-1 text-[0.72rem] leading-none text-ink/75">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* Punto 10: la figura al centro, avvolta dalla luce a spirale */}
        <EcosystemStage />

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
