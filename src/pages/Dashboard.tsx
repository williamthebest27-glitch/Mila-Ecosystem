import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { dashboard } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { Millina } from "@/components/Millina";
import { Daily } from "@/sections/dashboard/Daily";
import { Wheel } from "@/sections/dashboard/Wheel";
import { Diary } from "@/sections/dashboard/Diary";

/**
 * Punto 20 — l'area personale.
 *
 * Quattro zone funzionano davvero — la frase del giorno (24), Millina (21-22),
 * la Ruota della Vita (23) e il diario (25) — e stanno in cima. Le altre
 * aspettano l'accesso e gli acquisti, e restano descritte in fondo.
 *
 * Nessun dato simulato, da nessuna parte: niente barre di avanzamento finte,
 * niente prenotazioni inventate, niente nome utente di fantasia. Dati falsi in
 * un'anteprima chiedono a chi guarda di fingere che siano veri, e rendono
 * impossibile distinguere più avanti quello che funziona da quello che è
 * ancora scenografia.
 */
export default function Dashboard() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-db-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-db-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-db-notice]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.75);

      gsap.fromTo(
        q("[data-db-zone]"),
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          stagger: 0.07,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-db-zones]"), start: "top 85%", once: true },
        },
      );
    });
  });

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
        <section
          ref={ref}
          className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(4rem,9vw,7rem)]"
          aria-labelledby="dashboard-title"
        >
          <Glow tone="gold" size="36rem" intensity={0.26} duration={26} className="-left-28 top-[4%]" />

          <div className="container-x relative">
            <p data-db-label className="label">
              {dashboard.label}
            </p>
            <h1 id="dashboard-title" data-db-title className="display display-xl mt-6 max-w-[14ch]">
              {dashboard.title.map((line, i) => (
                <span key={i} className="block">
                  <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
                </span>
              ))}
            </h1>

            {/* L'anteprima è dichiarata subito, non nascosta in fondo. */}
            <p
              data-db-notice
              className="mt-9 inline-flex max-w-xl rounded-full border border-gold/60 bg-ivory px-5 py-2.5 text-[0.85rem] leading-snug text-ink/80"
            >
              {dashboard.notice}
            </p>
          </div>
        </section>

        {/* Le quattro zone che funzionano davvero, in cima. */}
        <section className="relative overflow-x-clip bg-ivory pb-[clamp(3rem,7vw,5rem)] pt-[clamp(2.5rem,6vw,4rem)]">
          <div className="container-x grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Daily />
            </div>
            <div className="lg:col-span-7">
              <Millina />
            </div>
            <div className="lg:col-span-7">
              <Wheel />
            </div>
            <div className="lg:col-span-5">
              <Diary />
            </div>
          </div>
        </section>

        {/* Le due cose che il brief chiede di dire: cosa non è, e cosa
            deliberatamente non contiene. */}
        <section ref={revealRef} className="relative overflow-x-clip bg-ivory section-pad">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div data-reveal>
              <h2 className="display display-md font-normal">{dashboard.notArchive.title}</h2>
              <p className="body-copy mt-5 max-w-lg">{dashboard.notArchive.text}</p>
            </div>
            <div data-reveal data-reveal-delay="0.12" className="lg:border-l lg:hairline lg:pl-12">
              <h2 className="display display-md font-normal">{dashboard.noPoints.title}</h2>
              <p className="body-copy mt-5 max-w-lg">{dashboard.noPoints.text}</p>
            </div>
          </div>
        </section>

        <section className="relative overflow-x-clip bg-sage-wash section-pad" aria-labelledby="zones-title">
          <div className="container-x">
            <p id="zones-title" className="label">
              {dashboard.zonesLabel}
            </p>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-snug text-mute">{dashboard.zonesNote}</p>

            <ul data-db-zones className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border hairline bg-line sm:grid-cols-2 lg:mt-14">
              {dashboard.zones.map((zone) => (
                <li key={zone.name} data-db-zone className="bg-ivory p-7 lg:p-8">
                  <p className="display display-sm font-normal">{zone.name}</p>
                  <p className="mt-3 text-[0.92rem] leading-snug text-mute">{zone.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-14 flex flex-col items-center gap-5 text-center lg:mt-20">
              <Button to={dashboard.cta.to} variant="primary" size="lg">
                {dashboard.cta.label}
              </Button>
              <Link
                to={dashboard.secondary.to}
                className="link-underline inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-mute"
              >
                {dashboard.secondary.label}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
