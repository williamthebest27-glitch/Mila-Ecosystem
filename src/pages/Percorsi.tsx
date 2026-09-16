import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { roads } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { MilaReset } from "@/sections/MilaReset";

/**
 * Apertura della pagina: riprende la biforcazione della home, ma qui le due
 * strade non sono un invito — sono l'indice di ciò che segue.
 *
 * Restano nominate e non cliccabili finché non esiste anche la sezione dei
 * percorsi strutturati (punto 13): un'ancora che non porta da nessuna parte è
 * peggio di nessuna ancora.
 */
function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "premium" } });
      tl.fromTo(q("[data-in-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-in-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-in-lede]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.7)
        .fromTo(q("[data-in-road]"), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12 }, 0.9);
    });
  });

  return (
    <section ref={ref} className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(4rem,9vw,7rem)]" aria-labelledby="percorsi-title">
      <Glow tone="gold" size="36rem" intensity={0.26} duration={24} className="-right-28 top-0" />
      <Glow tone="sage" size="28rem" intensity={0.22} duration={30} delay={5} className="-left-24 bottom-[-4rem]" />

      <div className="container-x relative">
        <p data-in-label className="label">
          {roads.label}
        </p>
        <h1 id="percorsi-title" data-in-title className="display display-xl mt-6 max-w-[16ch]">
          {roads.title.map((line, i) => (
            <span key={i} className="block">
              <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
            </span>
          ))}
        </h1>
        <p data-in-lede className="lede mt-8 max-w-xl">
          {roads.lede}
        </p>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] border hairline bg-line md:grid-cols-2 lg:mt-20">
          {roads.items.map((road, i) => (
            <li key={road.title} data-in-road className="bg-ivory-2 p-7 lg:p-8">
              <span className="num label !text-[0.625rem]">0{i + 1}</span>
              <p className="mt-3 text-[0.9rem] text-mute">{road.kicker}</p>
              <p className="display display-sm mt-1 font-normal">{road.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Percorsi() {
  // Font e immagini cambiano il layout dopo il mount: ricalcola i trigger.
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
        <MilaReset />
      </main>
      <Footer />
    </>
  );
}
