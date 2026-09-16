import { call, custom } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";

/**
 * Punto 14 — il percorso individuale.
 *
 * È l'unica cosa della pagina senza un contenuto definito, e la sezione è
 * costruita per dirlo invece che per nasconderlo: al posto dell'elenco di cosa
 * comprende c'è l'elenco di cosa resta aperto, con una riga puntinata che
 * attraversa ogni voce — un indice ancora da riempire. Il suggerimento a
 * destra è una domanda, non una risposta.
 *
 * Il brief la vuole "a parte", e lo è anche visivamente: niente griglia di
 * schede come nei tre livelli, ma una colonna sola su fondo salvia. Dopo il
 * banco dei percorsi, una stanza tranquilla.
 */
export function CustomPath() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-cp-title] .split-word"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-cp-title]"), start: "top 85%", once: true },
        },
      );

      // Le righe si scrivono una dopo l'altra, come un indice che si compila.
      gsap.fromTo(
        q("[data-cp-row]"),
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-cp-open]"), start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        q("[data-cp-leader]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          stagger: 0.1,
          delay: 0.2,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-cp-open]"), start: "top 85%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-x-clip bg-sage-wash section-pad" aria-labelledby="custom-title">
      <Glow tone="gold" size="32rem" intensity={0.24} duration={28} className="-right-24 top-[10%]" />

      <div ref={revealRef} className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label">{custom.label}</p>
          <h2 id="custom-title" data-cp-title className="display display-lg mt-5">
            {custom.title.map((line, i) => (
              <span key={i} className="block">
                <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
              </span>
            ))}
          </h2>
          <p className="lede mt-7" data-reveal>
            {custom.lede}
          </p>
        </div>

        {/* L'indice ancora da riempire */}
        <div
          data-cp-open
          className="mx-auto mt-14 max-w-2xl rounded-[1.5rem] border border-ink/10 bg-ivory p-7 sm:p-10 lg:mt-20"
        >
          <p className="label">{custom.openLabel}</p>

          <ul className="mt-7 grid gap-5">
            {custom.open.map((row) => (
              <li key={row.name} data-cp-row className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[1.05rem] font-medium tracking-[-0.015em] text-ink">{row.name}</span>
                {/* La riga puntinata che aspetta di essere riempita */}
                <span
                  aria-hidden="true"
                  className="order-last h-px min-w-8 flex-1 basis-full sm:order-none sm:basis-auto"
                >
                  <span
                    data-cp-leader
                    className="block h-px w-full origin-left border-t border-dotted border-ink/30"
                  />
                </span>
                <span className="serif-accent text-[0.95rem] text-mute">{row.hint}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 border-t hairline pt-6 text-[0.9rem] leading-snug text-mute">{custom.openNote}</p>
        </div>

        {/* Il modo per cominciare — ed è l'ancora a cui puntano tutte le CTA
            "Prenota la call" del sito, che finora non trovavano nulla. */}
        <div id="call-iniziale" className="mx-auto mt-16 max-w-2xl scroll-mt-[var(--nav-h)] text-center lg:mt-24" data-reveal>
          <hr className="rule-gold mx-auto w-40" aria-hidden="true" />
          <p className="label mt-10">{custom.call.label}</p>
          <p className="display display-md mt-4 font-normal">{custom.call.title}</p>
          <p className="body-copy mx-auto mt-5 max-w-xl">{custom.call.text}</p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5" aria-label="La call in breve">
            {call.facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-ink/12 bg-ivory px-3.5 py-1.5 text-[0.75rem] font-medium tracking-[0.02em] text-ink/80"
              >
                {fact}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex justify-center">
            <Button to={custom.call.cta.to} variant="primary" size="lg" arrow="up" highlight>
              {custom.call.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
