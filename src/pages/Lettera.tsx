import { Fragment, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { blog, letter } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";

/**
 * "Lettera a mia nonna" — l'unico articolo del blog che si apre, perché è
 * l'unico di cui esiste il testo (punto 32).
 *
 * È una pagina di lettura e basta: nessuna colonna laterale, nessun articolo
 * correlato, nessun modulo in mezzo. La misura è una sola — poco più di
 * sessanta caratteri per riga — e il resto della pagina serve solo a non
 * disturbare.
 *
 * Gli a capo dentro i paragrafi sono voluti: la lettera è scritta a righe
 * corte, e comprimerle in un blocco unico le toglierebbe il respiro.
 */

function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-le-meta]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-le-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-le-hook]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.7)
        .fromTo(q("[data-le-img]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 }, 0.5)
        .fromTo(q("[data-le-img] img"), { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0.5);
    });
  });

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(3.5rem,9vw,7rem))] pb-[clamp(3rem,7vw,5rem)]"
      aria-labelledby="lettera-title"
    >
      <Glow tone="gold" size="32rem" intensity={0.24} duration={26} className="-left-24 top-[8%]" />

      <div className="container-x relative">
        <Link
          to={letter.back.to}
          className="link-underline inline-flex items-center gap-2 text-[0.85rem] font-medium text-mute"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {letter.back.label}
        </Link>

        <p data-le-meta className="label mt-8">
          {letter.category} · {letter.date} · {letter.minutes} {blog.reading}
        </p>

        <h1 id="lettera-title" data-le-title className="display display-lg mt-5 max-w-[16ch]">
          <SplitWords text={letter.title} />
        </h1>

        <p data-le-hook className="lede mt-7 max-w-xl">
          {letter.hook}
        </p>

        <figure data-le-img className="mt-12 overflow-hidden rounded-[1.5rem] lg:mt-16">
          <img
            src="/images/founder-story.webp"
            alt="Le mani di una nonna che tiene la mano di una bambina, in toni verdi"
            width={1152}
            height={768}
            className="aspect-[16/9] w-full object-cover object-[50%_40%] will-change-transform"
          />
        </figure>
      </div>
    </section>
  );
}

export default function Lettera() {
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1200);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main id="main">
        <Intro />

        <article className="bg-ivory section-pad">
          <div ref={revealRef} className="container-x">
            <div className="mx-auto max-w-[62ch]">
              <p className="label" data-reveal>
                {letter.sectionTitle}
              </p>

              <div className="mt-8 grid gap-7">
                {letter.blocks.map((blocco, i) =>
                  blocco.tone === "pull" ? (
                    <p
                      key={i}
                      data-reveal
                      className="serif-accent my-4 text-center text-[clamp(1.5rem,3.4vw,2.2rem)] leading-snug text-sage-deep"
                    >
                      {blocco.lines.join(" ")}
                    </p>
                  ) : (
                    <p key={i} data-reveal className="text-[1.05rem] leading-[1.8] text-ink/85">
                      {blocco.lines.map((riga, j) => (
                        <Fragment key={j}>
                          {j > 0 && <br />}
                          {riga}
                        </Fragment>
                      ))}
                    </p>
                  ),
                )}
              </div>

              <hr className="rule-gold my-14" />

              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Button to={letter.cta.to} variant="primary" arrow="right">
                  {letter.cta.label}
                </Button>
                <Link
                  to={letter.back.to}
                  className="link-underline inline-flex items-center gap-2 text-[0.9rem] font-medium text-mute"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {letter.back.label}
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
