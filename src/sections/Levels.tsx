import { ArrowUpRight } from "lucide-react";
import { areas, levels } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { SplitWords } from "@/components/Split";

/**
 * Punto 13 — i tre percorsi strutturati.
 *
 * La sezione è costruita attorno a una sola idea: non sono tre opzioni
 * parallele, sono una salita. Tre cose lo dicono insieme, senza doverlo
 * scrivere:
 *
 *  - le aree coperte si accendono una in più a ogni livello (1, 2, 3), ed è
 *    la stessa terna del punto 9, quindi il lettore la riconosce;
 *  - le schede partono più in basso a sinistra e salgono verso destra,
 *    allineate sul fondo: crescono come tre barre;
 *  - il materiale si fa via via più ricco — crema, crema bordata di salvia,
 *    e infine il fondo salvia con il filo d'oro.
 */

/** Riga di copertura: le tre aree, accese o spente. È il cuore della lettura. */
function Coverage({ covered }: { covered: string[] }) {
  return (
    <ul className="mt-4 grid gap-2.5">
      {areas.map((area) => {
        const on = covered.includes(area.slug);
        return (
          <li key={area.slug} className="flex items-center gap-3">
            <span className="relative block h-[3px] w-10 shrink-0 overflow-hidden rounded-full bg-ink/10">
              {on && <span data-lv-bar className="absolute inset-0 origin-left rounded-full bg-sage-deep" />}
            </span>
            <span className={`text-[0.82rem] ${on ? "font-medium text-ink" : "text-mute-2"}`}>{area.short}</span>
            <span className="sr-only">{on ? "inclusa" : "non inclusa"}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Progressione materica: ogni gradino pesa un po' di più del precedente. */
const SKIN = [
  "bg-ivory border-ink/10",
  "bg-ivory border-sage/70",
  "ground-sage border-sage-deep/35",
];

/** Le schede salgono da sinistra a destra ma restano allineate sul fondo, così
 *  crescono come tre barre. Il gradino è 48px: sotto i 40 si legge come un
 *  disallineamento invece che come una salita. */
const RISE = ["lg:mt-24", "lg:mt-12", "lg:mt-0"];

export function Levels() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-lv-title] .split-word"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-lv-title]"), start: "top 85%", once: true },
        },
      );

      gsap.fromTo(
        q("[data-lv-card]"),
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-lv-grid]"), start: "top 82%", once: true },
        },
      );

      // Le barre si riempiono dopo le schede: è il gesto che racconta la salita.
      gsap.fromTo(
        q("[data-lv-bar]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.7,
          stagger: 0.07,
          delay: 0.5,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-lv-grid]"), start: "top 82%", once: true },
        },
      );
    });
  });

  return (
    <section
      ref={ref}
      id="percorsi-strutturati"
      className="relative overflow-x-clip bg-ivory-2 section-pad scroll-mt-[var(--nav-h)]"
      aria-labelledby="levels-title"
    >
      <div ref={revealRef} className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">{levels.label}</p>
            <h2 id="levels-title" data-lv-title className="display display-lg mt-5">
              {levels.title.map((line, i) => (
                <span key={i} className="block">
                  <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
                </span>
              ))}
            </h2>
          </div>
          <p className="lede lg:col-span-5 lg:justify-self-end lg:max-w-sm" data-reveal>
            {levels.lede}
          </p>
        </div>

        <ol data-lv-grid className="mt-14 grid items-stretch gap-4 lg:mt-20 lg:grid-cols-3 lg:gap-5">
          {levels.items.map((level, i) => {
            const last = i === levels.items.length - 1;
            return (
              <li key={level.name} data-lv-card className={RISE[i]}>
                <article className={`flex h-full flex-col rounded-[1.5rem] border p-7 lg:p-8 ${SKIN[i]}`}>
                  <p className="num label !text-[0.7rem]">{level.index}</p>
                  <h3 className="display display-md mt-3 font-normal">{level.name}</h3>
                  <p className="serif-accent mt-3 text-[1.1rem] leading-snug text-sage-deep">{level.claim}</p>
                  <p className="body-copy mt-4">{level.description}</p>

                  <p className="label mt-8 border-t hairline pt-5">{levels.coverageLabel}</p>
                  <Coverage covered={level.areas} />

                  <p className="label mt-8 border-t hairline pt-5">{levels.includesLabel}</p>
                  <ul className="mt-4 grid gap-2">
                    {level.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.92rem] leading-snug text-ink/80">
                        <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-sage-deep" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {last && <hr className="rule-gold mt-8" aria-hidden="true" />}

                  <p className={`mt-auto pt-8 text-[0.88rem] leading-snug ${last ? "text-ink/75" : "text-mute"}`}>
                    {level.company}
                  </p>

                  {last && (
                    <p className="mt-4">
                      <Link
                        to={levels.triskell.to}
                        className="link-underline inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-sage-deep"
                      >
                        {levels.triskell.label}
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      </Link>
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex flex-col items-center gap-7 text-center lg:mt-20" data-reveal>
          <p className="max-w-xl text-[clamp(1.05rem,1.5vw,1.25rem)] leading-snug text-ink">{levels.note}</p>
          <Button to={levels.cta.to} variant="primary" size="lg" arrow="up" highlight>
            {levels.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
