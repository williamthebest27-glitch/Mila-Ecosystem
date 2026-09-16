import { business } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";

/**
 * Punti 16-17 — le due direzioni di Triskell.
 *
 * Il brief chiede un messaggio "molto semplice" e fornisce lui stesso le due
 * domande. Sono quindi loro l'elemento più grande della pagina: chi arriva non
 * sceglie fra due prodotti, risponde a una domanda su di sé e si ritrova dalla
 * parte giusta.
 *
 * Diverso di proposito dalla biforcazione dei Percorsi, che sono due schede
 * affiancate: là si sceglie quanto accompagnamento si vuole, qui si dichiara
 * da dove si parte. Due blocchi distesi in verticale, con il fondo che
 * alterna, così non si leggono come un confronto fra pari ma come due porte
 * distinte.
 */
export function Directions() {
  const ref = useGsap<HTMLDivElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      q<HTMLElement>("[data-dir-block]").forEach((block) => {
        const pick = <T extends HTMLElement>(sel: string) => block.querySelectorAll<T>(sel);
        gsap
          .timeline({ defaults: { ease: "premium" }, scrollTrigger: { trigger: block, start: "top 78%", once: true } })
          .fromTo(pick("[data-dir-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .fromTo(pick("[data-dir-q] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.15)
          .fromTo(pick("[data-dir-a]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.6)
          .fromTo(pick("[data-dir-col]"), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12 }, 0.75);
      });
    });
  });

  return (
    <div ref={ref}>
      {business.directions.map((dir, i) => {
        const sand = i % 2 === 1;
        return (
          <section
            key={dir.slug}
            id={dir.slug}
            className={`relative overflow-x-clip section-pad scroll-mt-[var(--nav-h)] ${sand ? "bg-ivory-2" : "bg-ivory"}`}
            aria-labelledby={`${dir.slug}-title`}
            data-dir-block
          >
            <Glow
              tone="gold"
              size="32rem"
              intensity={0.22}
              duration={26}
              delay={i * 4}
              className={i === 0 ? "-right-28 top-[6%]" : "-left-28 top-[10%]"}
            />

            <div className="container-x relative">
              <span
                data-dir-rule
                aria-hidden="true"
                className="block h-px w-full origin-left bg-sage-deep/35"
              />
              <p className="label mt-6">{dir.name}</p>

              {/* La domanda è l'elemento principale: è lei che smista. */}
              <h2 id={`${dir.slug}-title`} data-dir-q className="display display-lg mt-5 max-w-[20ch]">
                <SplitWords text={dir.question} />
              </h2>
              <p
                data-dir-a
                className="serif-accent mt-7 max-w-2xl text-[clamp(1.4rem,2.6vw,2.15rem)] leading-snug text-sage-deep"
              >
                {dir.answer}
              </p>

              <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
                <div data-dir-col className="lg:col-span-4">
                  <p className="label border-t hairline pt-5">{dir.forWho}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {dir.forWhoItems.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.98rem] leading-snug text-ink/80">
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-sage-deep" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div data-dir-col className="lg:col-span-8">
                  <p className="label border-t hairline pt-5">{dir.doesLabel}</p>
                  {/* Elenco lungo: come etichette si legge a colpo d'occhio,
                      come lista puntata diventerebbe una colonna infinita. */}
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {dir.does.map((item) => (
                      <li
                        key={item}
                        className={`rounded-full border border-ink/12 px-3.5 py-1.5 text-[0.85rem] text-ink/80 ${sand ? "bg-ivory" : "bg-ivory-2/70"}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Closing />
    </div>
  );
}

/** Chi non si riconosce in nessuna delle due domande ha comunque una via. */
function Closing() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="bg-sage-wash py-[clamp(4rem,8vw,7rem)]">
      <div className="container-x flex flex-col items-center gap-8 text-center">
        <p className="display display-sm max-w-xl font-normal" data-reveal>
          {business.closing.text}
        </p>
        <span data-reveal data-reveal-delay="0.1">
          <Button to={business.closing.cta.to} variant="primary" size="lg" arrow="up" highlight>
            {business.closing.cta.label}
          </Button>
        </span>
      </div>
    </section>
  );
}
