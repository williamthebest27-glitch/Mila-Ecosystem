import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { salotto } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { Gestures, OneRoom, Faces } from "@/sections/Salotto";

function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-ci-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-ci-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-ci-lede]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.7)
        .fromTo(q("[data-ci-img]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 }, 0.5)
        .fromTo(q("[data-ci-img] img"), { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0.5);
    });

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-ci-img] img"),
        { yPercent: -3 },
        { yPercent: 3, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 1 } },
      );
    });
  });

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(4rem,9vw,7rem)]"
      aria-labelledby="salotto-title"
    >
      <Glow tone="gold" size="36rem" intensity={0.26} duration={26} className="-right-28 top-[4%]" />
      <Glow tone="sage" size="28rem" intensity={0.22} duration={31} delay={5} className="-left-24 bottom-[-4rem]" />

      <div className="container-x relative">
        <p data-ci-label className="label">
          {salotto.label}
        </p>
        <h1 id="salotto-title" data-ci-title className="display display-xl mt-6 max-w-[12ch]">
          {salotto.title.map((line, i) => (
            <span key={i} className="block">
              <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
            </span>
          ))}
        </h1>
        <p data-ci-lede className="lede mt-8 max-w-xl">
          {salotto.lede}
        </p>

        <figure data-ci-img className="mt-14 overflow-hidden rounded-[1.5rem] lg:mt-20">
          <img
            src="/images/community-circle.webp"
            alt={salotto.imageAlt}
            width={1152}
            height={928}
            className="aspect-[16/9] w-full object-cover object-[50%_35%] will-change-transform"
          />
        </figure>
      </div>
    </section>
  );
}

export default function Community() {
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
        <Gestures />
        <Faces />
        <OneRoom />
      </main>
      <Footer />
    </>
  );
}
