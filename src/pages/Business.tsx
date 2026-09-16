import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { business } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { Directions } from "@/sections/Directions";

/**
 * Punto 15 — l'apertura: la crescita professionale come parte della persona,
 * e Triskell come lo strumento che la serve.
 */
function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-bi-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-bi-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-bi-copy]"), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12 }, 0.7)
        .fromTo(
          q("[data-bi-img]"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 },
          0.55,
        )
        .fromTo(q("[data-bi-img] img"), { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0.55);
    });

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-bi-img] img"),
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 1 },
        },
      );
    });
  });

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-ivory pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(4rem,9vw,7rem)]"
      aria-labelledby="business-title"
    >
      <Glow tone="gold" size="38rem" intensity={0.26} duration={25} className="-left-32 top-[4%]" />

      <div className="container-x relative">
        <p data-bi-label className="label">
          {business.label}
        </p>
        <h1 id="business-title" data-bi-title className="display display-xl mt-6 max-w-[14ch]">
          {business.title.map((line, i) => (
            <span key={i} className="block">
              <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <p data-bi-copy className="lede lg:col-span-6">
            {business.lede}
          </p>
          <div data-bi-copy className="lg:col-span-5 lg:col-start-8">
            <p className="label">{business.triskell.name}</p>
            <p className="body-copy mt-3">{business.triskell.text}</p>
          </div>
        </div>

        <figure data-bi-img className="mt-14 overflow-hidden rounded-[1.5rem] lg:mt-20">
          <img
            src="/images/business.webp"
            alt={business.imageAlt}
            width={1600}
            height={1063}
            className="aspect-[3/2] w-full object-cover will-change-transform"
          />
        </figure>
      </div>
    </section>
  );
}

export default function Business() {
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
        <Directions />
      </main>
      <Footer />
    </>
  );
}
