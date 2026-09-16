import { community, salotto, testimonials } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Glow } from "@/components/Atmosphere";
import { ArrowUpRight } from "lucide-react";

/**
 * Punto 19 — il salotto.
 *
 * Il brief chiede "un ambiente caldo e accogliente, non un forum freddo", e la
 * sezione è costruita soprattutto per sottrazione: non c'è nessuna lista di
 * discussioni, nessun contatore di messaggi, nessuna griglia di categorie —
 * cioè tutto il vocabolario con cui un forum si presenta.
 *
 * Al loro posto i cinque gesti del brief, ciascuno detto con una frase
 * concreta, disposti come le voci di un menu invece che come una griglia di
 * funzionalità.
 */
export function Gestures() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-sl-row]"),
        { y: 26, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.1,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-sl-list]"), start: "top 85%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-x-clip bg-ivory section-pad" aria-labelledby="gestures-title">
      <Glow tone="gold" size="32rem" intensity={0.22} duration={27} className="-left-28 top-[14%]" />

      <div className="container-x relative">
        <p id="gestures-title" className="label">
          {salotto.gesturesLabel}
        </p>

        <ul data-sl-list className="mt-10 border-t hairline lg:mt-14">
          {salotto.gestures.map((g) => (
            <li
              key={g.name}
              data-sl-row
              className="grid items-baseline gap-x-8 gap-y-2 border-b hairline py-7 lg:grid-cols-12 lg:py-9"
            >
              <p className="display display-sm font-normal lg:col-span-4">{g.name}</p>
              <p className="text-[clamp(1rem,1.3vw,1.15rem)] leading-snug text-mute lg:col-span-8">{g.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * La stanza unica. Il brief chiede di non dividere la community in sottogruppi
 * — l'app originale li ha, per fascia d'età e per tema — e qui la rinuncia è
 * girata in valore: la prova che funziona è l'arco di età che siede insieme,
 * dai 17 ai 62, preso dalle voci già raccolte invece che dichiarato.
 */
export function OneRoom() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-sl-age]"),
        { y: 16, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-sl-ages]"), start: "top 88%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-x-clip bg-sage-wash section-pad" aria-labelledby="oneroom-title">
      <div ref={revealRef} className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="oneroom-title" className="display display-lg" data-reveal>
            {salotto.oneRoom.title}
          </h2>
          <p className="lede mt-7" data-reveal>
            {salotto.oneRoom.text}
          </p>
          <p className="serif-accent mt-6 text-[1.2rem] text-sage-deep" data-reveal>
            {salotto.oneRoom.later}
          </p>
        </div>

        {/* La prova: chi c'è davvero, tutte nella stessa stanza. */}
        <p className="label mt-16 text-center lg:mt-20" data-reveal>
          {salotto.oneRoom.agesLabel}
        </p>
        <ul data-sl-ages className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {testimonials.map((t) => (
            <li
              key={t.name}
              data-sl-age
              className="rounded-full border border-ink/12 bg-ivory px-4 py-2 text-[0.85rem] text-ink/80"
            >
              {t.name}, <span className="num">{t.age}</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-5 lg:mt-20" data-reveal>
          <Button to={salotto.cta.to} variant="primary" size="lg" highlight>
            {salotto.cta.label}
          </Button>
          <Link
            to={salotto.secondary.to}
            className="link-underline inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-mute"
          >
            {salotto.secondary.label}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Le immagini rappresentative che il brief vuole mantenere, in una fascia. */
export function Faces() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-sl-face]"),
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "premium",
          scrollTrigger: { trigger: scope, start: "top 85%", once: true },
        },
      );
      q<HTMLElement>("[data-sl-face] img").forEach((img, i) => {
        gsap.fromTo(
          img,
          { yPercent: -3 - i },
          {
            yPercent: 3 + i,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );
      });
    });
  });

  const picks = [community.images[1], community.images[2], community.images[3]];

  return (
    <section ref={ref} className="overflow-x-clip bg-ivory pb-[clamp(4rem,9vw,7rem)]" aria-hidden="true">
      <div className="container-x grid gap-4 sm:grid-cols-3 sm:gap-5">
        {picks.map((img, i) => (
          <figure
            key={img.src}
            data-sl-face
            className={`overflow-hidden rounded-[1.25rem] ${i === 1 ? "sm:mt-10" : ""}`}
          >
            <img
              src={img.src}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover will-change-transform"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
