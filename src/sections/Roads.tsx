import { ArrowUpRight } from "lucide-react";
import { roads } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { SplitWords } from "@/components/Split";

/**
 * Punto 11 — la biforcazione dei percorsi.
 *
 * Due porte affiancate, e sotto le due colonne una linea che le riunisce: la
 * "direzione" del titolo resa visibile invece che soltanto affermata. Le due
 * strade entrano dai lati, ciascuna dal proprio, così il gesto racconta la
 * scelta.
 */
export function Roads() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-rd-title] .split-word"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-rd-title]"), start: "top 85%", once: true },
        },
      );

      // Ogni strada entra dal proprio lato.
      q<HTMLElement>("[data-rd-card]").forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i === 0 ? -44 : 44, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "premium",
            scrollTrigger: { trigger: q("[data-rd-grid]"), start: "top 82%", once: true },
          },
        );
      });

      // Il punto d'incontro si disegna dopo, quando le due strade ci sono già.
      gsap.fromTo(
        q("[data-rd-join]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          delay: 0.35,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-rd-grid]"), start: "top 70%", once: true },
        },
      );
      gsap.fromTo(
        q("[data-rd-meet]"),
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          delay: 0.6,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-rd-grid]"), start: "top 70%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-x-clip bg-ivory section-pad" aria-labelledby="roads-title">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">{roads.label}</p>
            <h2 id="roads-title" data-rd-title className="display display-lg mt-5">
              {roads.title.map((line, i) => (
                <span key={i} className="block">
                  <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
                </span>
              ))}
            </h2>
          </div>
          <p className="lede lg:col-span-5 lg:justify-self-end lg:max-w-sm">{roads.lede}</p>
        </div>

        <div data-rd-grid className="mt-14 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-20">
          {roads.items.map((road) => (
            <article
              key={road.title}
              data-rd-card
              className="flex flex-col rounded-[1.5rem] border border-ink/10 bg-ivory-2/60 p-7 lg:p-9"
            >
              <p className="label">{road.kicker}</p>
              <h3 className="display display-md mt-4 font-normal">{road.title}</h3>
              <p className="body-copy mt-4 max-w-sm">{road.description}</p>

              <ul className="mt-7 grid gap-2.5 border-t hairline pt-6">
                {road.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.95rem] text-ink/80">
                    <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-sage-deep" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <p className="serif-accent mt-auto pt-8 text-[1.15rem] leading-snug text-sage-deep">{road.note}</p>
            </article>
          ))}
        </div>

        {/* Il punto in cui le due strade si ritrovano */}
        <div className="mt-12 flex flex-col items-center text-center lg:mt-16">
          <span
            data-rd-join
            aria-hidden="true"
            className="rule-gold block w-[min(28rem,80%)] origin-center"
          />
          <p data-rd-meet className="mt-8 max-w-xl text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug text-ink">
            {roads.meeting}
          </p>
          <div data-rd-meet className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button to={roads.cta.to} variant="primary" size="lg">
              {roads.cta.label}
            </Button>
            <Link to={roads.secondary.to} className="link-underline inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-mute">
              {roads.secondary.label}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
