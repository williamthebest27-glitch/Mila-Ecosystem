import { areas, ecosystem } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";

/**
 * Punto 10 — la figura femminile al centro dell'ecosistema, avvolta da fasci
 * di luce a spirale che scendono con lo scroll. Man mano che la luce la
 * avvolge compaiono le tre aree: a sinistra il mindset, a destra il benessere,
 * infine il business.
 *
 * La spirale è un'elica vista di lato, calcolata e non disegnata a mano. Viene
 * spezzata nei tratti che passano *davanti* alla figura e in quelli che
 * passano *dietro*: i primi si disegnano sopra l'immagine, i secondi sotto e
 * più smorzati. È quello che fa leggere la luce come avvolgente invece che
 * appoggiata sopra.
 */

type Seg = { d: string; front: boolean; from: number; to: number };

function helix(cx: number, rx: number, y0: number, y1: number, turns: number, samples = 520): Seg[] {
  const T = turns * Math.PI * 2;
  const segs: Seg[] = [];
  let cur: string[] = [];
  let curFront = Math.cos(0) < 0;
  let start = 0;

  for (let i = 0; i <= samples; i++) {
    const f = i / samples;
    const t = f * T;
    const x = (cx + rx * Math.sin(t)).toFixed(1);
    const y = (y0 + f * (y1 - y0)).toFixed(1);
    // Con l'osservatore davanti, il tratto passa davanti alla figura quando la
    // sua profondità è negativa — cioè quando cos(t) < 0.
    const front = Math.cos(t) < 0;

    if (i === 0) {
      cur.push(`M${x} ${y}`);
    } else if (front !== curFront) {
      // Chiude il tratto sul punto di passaggio e ne apre uno nuovo da lì, così
      // davanti e dietro si saldano senza buchi.
      cur.push(`L${x} ${y}`);
      segs.push({ d: cur.join(" "), front: curFront, from: start, to: f });
      cur = [`M${x} ${y}`];
      curFront = front;
      start = f;
    } else {
      cur.push(`L${x} ${y}`);
    }
  }
  segs.push({ d: cur.join(" "), front: curFront, from: start, to: 1 });
  return segs;
}

const VB = { w: 1000, h: 1400 };
const SEGS = helix(500, 322, 70, 1340, 3.25);

/** Un capo dell'elica. `pathLength={1}` normalizza la lunghezza: lo scroll
 *  muove il dashoffset da 1 a 0 e il tratto si disegna. */
function Spiral({ front }: { front: boolean }) {
  const id = front ? "f" : "b";
  const mine = SEGS.filter((s) => s.front === front);
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`lux-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="70" x2="0" y2="1340">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
          <stop offset="22%" stopColor="var(--color-gold)" stopOpacity="0.95" />
          <stop offset="62%" stopColor="#FFFDF6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-sage-deep)" stopOpacity="0.25" />
        </linearGradient>
        <filter id={`soft-${id}`} x="-25%" y="-15%" width="150%" height="130%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <g opacity={front ? 1 : 0.38}>
        {/* L'alone sfocato sta in un gruppo unico sotto un solo filtro: con un
            `filter` per tratto il browser calcolerebbe otto regioni di blur a
            ogni fotogramma di scroll, invece di una. */}
        <g filter={`url(#soft-${id})`} opacity={0.45}>
          {mine.map((s, i) => (
            <path
              key={`h${i}`}
              data-lux
              data-from={s.from}
              data-to={s.to}
              d={s.d}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              fill="none"
              stroke={`url(#lux-${id})`}
              strokeWidth={24}
              strokeLinecap="round"
            />
          ))}
        </g>
        {/* Il filo di luce, nitido */}
        <g>
          {mine.map((s, i) => (
            <path
              key={`t${i}`}
              data-lux
              data-from={s.from}
              data-to={s.to}
              d={s.d}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              fill="none"
              stroke={`url(#lux-${id})`}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Le tre aree, ancorate con offset e mai con `translate`: lo spostamento in
 *  entrata lo guida GSAP via `transform` e le due cose si annullerebbero. */
const PLACE = [
  "left-0 top-[16%] w-[min(20rem,26vw)]",
  "right-0 top-[38%] w-[min(20rem,26vw)]",
  "left-[calc(50%-11rem)] bottom-[6%] w-[22rem] text-center",
];

export function EcosystemStage() {
  const ref = useGsap<HTMLDivElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const track = q<HTMLElement>("[data-dea-track]")[0];
      const panels = q<HTMLElement>("[data-dea-panel]");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });

      // La figura emerge per prima, poi la luce comincia a scendere.
      tl.fromTo(q("[data-dea-figure]"), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.14 }, 0);

      q<SVGPathElement>("[data-lux]").forEach((p) => {
        const from = Number(p.dataset.from);
        const to = Number(p.dataset.to);
        // La luce percorre l'elica fra il 6% e l'88% dello scroll, così ha
        // un respiro prima di partire e non finisce sull'ultimo pixel.
        const at = 0.06 + from * 0.82;
        tl.to(p, { strokeDashoffset: 0, duration: Math.max(0.004, (to - from) * 0.82) }, at);
      });

      const cues = [
        { at: 0.24, from: { x: -48, autoAlpha: 0 } },
        { at: 0.46, from: { x: 48, autoAlpha: 0 } },
        { at: 0.68, from: { y: 48, autoAlpha: 0 } },
      ];
      panels.forEach((panel, i) => {
        const cue = cues[i] ?? cues[2];
        tl.fromTo(panel, cue.from, { x: 0, y: 0, autoAlpha: 1, duration: 0.15 }, cue.at);
      });
    });
  });

  return (
    <div ref={ref} className="hidden lg:block motion-reduce:!hidden">
      {/* Il binario dà allo scroll lo spazio per srotolare la spirale. */}
      <div data-dea-track className="relative h-[250vh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]">
          <div className="container-x relative h-full w-full">
            {/* Figura e spirale, al centro della scena */}
            <div className="absolute inset-y-[4%] left-1/2 w-[min(34rem,40vw)] -translate-x-1/2">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
                style={{ background: "var(--gradient-glow)" }}
              />
              <Spiral front={false} />
              <img
                data-dea-figure
                src="/images/dea.webp"
                alt={ecosystem.stage.imageAlt}
                width={1100}
                height={1473}
                loading="lazy"
                className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain"
              />
              <Spiral front />
            </div>

            {/* Le tre aree, che si aprono mentre la luce scende */}
            {areas.map((a, i) => (
              <article
                key={a.slug}
                data-dea-panel
                className={`absolute z-10 ${PLACE[i] ?? PLACE[2]}`}
              >
                <p className="num label !text-[0.625rem]">{a.index}</p>
                <h3 className="display display-sm mt-2 font-normal">{a.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-snug text-mute">{a.tagline}</p>
                <p className="mt-3 text-[0.78rem] leading-relaxed text-ink/70">{a.themes.join(" · ")}</p>
              </article>
            ))}

            <p className="label absolute inset-x-0 top-0 text-center !text-[0.625rem]">{ecosystem.stage.hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
