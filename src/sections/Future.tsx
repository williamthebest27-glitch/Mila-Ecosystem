import { ArrowUpRight } from "lucide-react";
import { future } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Link } from "@/components/Link";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";

/**
 * Punto 8 — far percepire subito quanto sarà ampio l'ecosistema.
 *
 * Le aree già aperte sono schede cliccabili. Quelle in arrivo si intravedono:
 * descrizione sfocata e smorzata, scheda non cliccabile, dicitura COMING SOON.
 *
 * Il titolo dell'area resta invece nitido. Il brief chiede che «si intravedesse
 * quello che stiamo costruendo»: se si sfoca anche il nome non si intravede
 * niente — e un testo illeggibile non aiuterebbe nessuno.
 */
export function Future() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-fu-title] .split-word"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-fu-title]"), start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        q("[data-fu-card]"),
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.06,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-fu-grid]"), start: "top 85%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory-2 section-pad" aria-labelledby="future-title">
      <Glow tone="gold" size="38rem" intensity={0.26} duration={25} className="-right-32 top-[12%]" />

      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">{future.label}</p>
            <h2 id="future-title" data-fu-title className="display display-lg mt-5">
              {future.title.map((line, i) => (
                <span key={i} className="block">
                  <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
                </span>
              ))}
            </h2>
          </div>
          <p className="lede lg:col-span-5 lg:justify-self-end lg:max-w-sm">{future.lede}</p>
        </div>

        <ul data-fu-grid className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {future.areas.map((area) => {
            const open = Boolean(area.to);

            const body = (
              <>
                <span className="flex items-start justify-between gap-4">
                  <span className="display display-sm block font-normal">{area.title}</span>
                  {open ? (
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ink group-hover:text-ivory">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="mt-1.5 shrink-0 rounded-full border border-gold/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                      {future.soonLabel}
                    </span>
                  )}
                </span>
                {/* La descrizione è ciò che si intravede: sfocata e smorzata.
                    Resta nel DOM, quindi chi naviga con lo screen reader la
                    riceve per intero. */}
                <span className={`mt-3 block text-[0.95rem] leading-snug text-mute ${open ? "" : "select-none blur-[3px] opacity-55"}`}>
                  {area.description}
                </span>
              </>
            );

            const shell =
              "flex h-full flex-col rounded-[1.25rem] border p-6 transition-[border-color,transform,box-shadow] duration-500 [transition-timing-function:var(--ease-premium)]";

            return (
              <li key={area.title} data-fu-card>
                {open ? (
                  <Link
                    to={area.to!}
                    className={`group ${shell} border-ink/10 bg-ivory hover:-translate-y-1 hover:border-sage-deep/45 hover:shadow-[0_28px_60px_-40px_rgba(49,38,30,0.45)]`}
                  >
                    {body}
                  </Link>
                ) : (
                  <div
                    aria-disabled="true"
                    className={`${shell} pointer-events-none border-dashed border-ink/12 bg-ivory/45`}
                  >
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
