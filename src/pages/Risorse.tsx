import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { resourcesPage } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Glow, Sparkles } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { Lista } from "@/sections/risorse/Lista";

/**
 * Punto 32 — le risorse gratuite.
 *
 * È la porta più bassa dell'ecosistema: non chiede soldi, non chiede un
 * percorso, non chiede nemmeno di capire cosa si vuole. Per questo la pagina
 * non vende niente e non ha una CTA verso i percorsi in cima: l'unica cosa che
 * deve succedere qui è che qualcuna trovi una cosa da scaricare.
 */

function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-ri-kicker]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-ri-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-ri-lede]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.7)
        .fromTo(q("[data-ri-kind]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06 }, 0.85);
    });
  });

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(3rem,7vw,5rem)]"
      aria-labelledby="risorse-title"
    >
      <Glow tone="gold" size="36rem" intensity={0.26} duration={25} className="-right-28 top-[4%]" />
      <Sparkles count={5} seed={606} tone="gold" minSize={7} maxSize={14} />

      <div className="container-x relative">
        <p
          data-ri-kicker
          className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-ivory px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-gold-deep"
        >
          {resourcesPage.kicker}
        </p>

        <h1 id="risorse-title" data-ri-title className="display display-xl mt-7 max-w-[13ch]">
          {resourcesPage.title.map((line, i) => (
            <span key={i} className="block">
              <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
            </span>
          ))}
        </h1>

        <p data-ri-lede className="lede mt-8 max-w-xl">
          {resourcesPage.lede}
        </p>

        <ul className="mt-9 flex flex-wrap gap-2.5">
          {resourcesPage.kinds.map((kind) => (
            <li
              key={kind}
              data-ri-kind
              className="rounded-full border border-ink/12 bg-ivory px-4 py-2 text-[0.82rem] text-mute"
            >
              {kind}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Risorse() {
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
        <Lista />
      </main>
      <Footer />
    </>
  );
}
