import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { library } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { Library } from "@/sections/Library";

function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-li-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-li-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-li-lede]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.7);
    });
  });

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(3rem,7vw,5rem)]"
      aria-labelledby="library-title"
    >
      <Glow tone="gold" size="34rem" intensity={0.26} duration={25} className="-right-24 top-[6%]" />

      <div className="container-x relative">
        <p data-li-label className="label">
          {library.label}
        </p>
        <h1 id="library-title" data-li-title className="display display-xl mt-6 max-w-[14ch]">
          {library.title.map((line, i) => (
            <span key={i} className="block">
              <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
            </span>
          ))}
        </h1>
        <p data-li-lede className="lede mt-8 max-w-xl">
          {library.lede}
        </p>
      </div>
    </section>
  );
}

export default function Libreria() {
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
        <Library />
      </main>
      <Footer />
    </>
  );
}
