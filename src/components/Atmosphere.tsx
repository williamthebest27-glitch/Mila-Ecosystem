import { useEffect, useRef } from "react";

/**
 * Atmosfera — bagliori, brillantini e riflessi.
 *
 * Tutto è guidato da CSS (nessun ticker GSAP in più) e vive nel tempo, non nel
 * puntatore: gli effetti continuano anche a mouse fermo, come chiede il brief.
 * Ogni gruppo si mette in pausa quando esce dal campo visivo — la homepage è
 * lunga ~28.000px e senza quella pausa il browser comporrebbe di continuo
 * strati che nessuno sta guardando.
 */

type Tone = "gold" | "sage" | "cream";

/** Canale RGB dei token di palette, per comporre i gradienti radiali. */
const TONE: Record<Tone, string> = {
  gold: "217, 176, 107", // --color-gold
  sage: "128, 155, 128", // --color-sage-deep
  cream: "255, 253, 246",
};

/**
 * Mette in pausa l'elemento quando esce dal campo (con un margine, così
 * l'effetto è già in moto quando lo si raggiunge).
 *
 * Parte acceso di proposito e l'observer può solo spegnerlo: è
 * un'ottimizzazione, non un interruttore d'accensione. In ambienti dove
 * IntersectionObserver non consegna mai le callback — una scheda mai
 * dipinta, un prerender, un servizio di screenshot — partire spenti
 * lascerebbe l'atmosfera invisibile per sempre. Così, nel peggiore dei
 * casi, si perde la pausa ma non l'effetto.
 */
function useAwakeInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Ci si fida di "fuori campo" solo dopo aver visto almeno un "dentro
    // campo". In un documento che non viene dipinto l'observer riporta
    // isIntersecting: false per qualunque elemento, anche per uno in mezzo
    // allo schermo; senza questa guardia l'atmosfera si spegnerebbe lì e non
    // si riaccenderebbe più.
    let everSeen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          everSeen = true;
          el.dataset.atmo = "on";
        } else if (everSeen) {
          el.dataset.atmo = "off";
        }
      },
      { rootMargin: "30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Un bagliore morbido che respira e deriva lentamente.
 * Va messo come primo figlio di una sezione `relative`: resta dietro al
 * contenuto in flusso senza bisogno di toccare gli z-index del contenuto.
 */
export function Glow({
  tone = "gold",
  size = "34rem",
  intensity = 0.45,
  duration = 22,
  delay = 0,
  className = "",
}: {
  tone?: Tone;
  /** Diametro, in una qualsiasi unità CSS. */
  size?: string;
  /** Opacità al centro del gradiente, 0–1. Tenerla bassa: è luce, non colore. */
  intensity?: number;
  /** Durata del respiro in secondi. Lunga = elegante. */
  duration?: number;
  delay?: number;
  /**
   * Posizionamento, con classi di offset (es. "-top-24 right-[8%]").
   * Non usare `translate-*` qui: il respiro anima `transform` e le
   * sovrascriverebbe. Per centrare, usare offset calcolati —
   * es. size="30rem" con "left-[calc(50%-15rem)]".
   */
  className?: string;
}) {
  const ref = useAwakeInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-atmo="on"
      aria-hidden="true"
      className={`atmo-glow pointer-events-none absolute z-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${TONE[tone]}, ${intensity}) 0%, rgba(${TONE[tone]}, 0) 68%)`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/** PRNG deterministico: la stessa composizione a ogni render e a ogni build. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Brillantino a quattro punte: più prezioso di un semplice puntino. */
function Spark({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      className="atmo-spark absolute"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={style}
    >
      <path d="M12 0c0 6.6 5.4 12 12 12-6.6 0-12 5.4-12 12 0-6.6-5.4-12-12-12C6.6 12 12 6.6 12 0Z" />
    </svg>
  );
}

/**
 * Una pioggia rada di brillantini, distribuita su una griglia con jitter così
 * non si addensano mai in un angolo. Riempie il genitore `relative`.
 */
export function Sparkles({
  count = 8,
  seed = 1,
  tone = "gold",
  minSize = 6,
  maxSize = 14,
  className = "",
}: {
  count?: number;
  /** Cambia il seme per ottenere una composizione diversa ma stabile. */
  seed?: number;
  tone?: Tone;
  minSize?: number;
  maxSize?: number;
  className?: string;
}) {
  const ref = useAwakeInView<HTMLDivElement>();
  const rand = mulberry32(seed * 2654435761);

  // Griglia il più possibile quadrata, un brillantino per cella.
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  const sparks = Array.from({ length: count }, (_, i) => {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    return {
      left: ((cx + 0.15 + rand() * 0.7) / cols) * 100,
      top: ((cy + 0.15 + rand() * 0.7) / rows) * 100,
      size: minSize + rand() * (maxSize - minSize),
      duration: 5 + rand() * 7,
      delay: rand() * 9,
    };
  });

  const color = tone === "gold" ? "var(--color-gold)" : tone === "sage" ? "var(--color-sage-deep)" : "#fffdf6";

  return (
    <div
      ref={ref}
      data-atmo="on"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ color }}
    >
      {sparks.map((s, i) => (
        <Spark
          key={i}
          size={s.size}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Riflesso: un velo di luce che attraversa lentamente una superficie.
 * Si applica avvolgendo l'elemento — utile su ritratti e superfici vetro.
 */
export function Sheen({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useAwakeInView<HTMLDivElement>();
  return (
    <div ref={ref} data-atmo="on" className={`sheen ${className}`}>
      {children}
    </div>
  );
}
