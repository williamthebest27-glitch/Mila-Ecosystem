import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { dashboard } from "@/data/content";
import { useAccount } from "@/lib/account/store";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Glow } from "@/components/Atmosphere";
import { Millina } from "@/components/Millina";
import { Welcome } from "@/sections/dashboard/Welcome";
import { Daily } from "@/sections/dashboard/Daily";
import { Wheel } from "@/sections/dashboard/Wheel";
import { MyPaths } from "@/sections/dashboard/MyPaths";
import { Board } from "@/sections/dashboard/Board";
import { Agenda } from "@/sections/dashboard/Agenda";
import { Diary } from "@/sections/dashboard/Diary";
import { QuickAccess } from "@/sections/dashboard/QuickAccess";
import { Invite } from "@/sections/dashboard/Invite";
import { SwitchEsempio } from "@/sections/dashboard/kit";

/**
 * L'area personale, nell'ordine che il punto 31 disegna:
 *
 *   Bentornata · frase del giorno · da dove vuoi partire (quiz + Millina) ·
 *   i tuoi percorsi · la tua bacheca (prenotazioni, eventi, agenda) ·
 *   diario · accesso rapido · invita un'amica
 *
 * Non è un ordine estetico: è una giornata. Si entra, si legge una frase, si
 * decide da dove ripartire, si riprende quello che si stava facendo, si guarda
 * cosa c'è in programma, si scrive. Le utilità — le porte e l'invito — stanno
 * in fondo, dove si va quando si è già fatto quello per cui si era entrate.
 *
 * Quello che funziona per davvero funziona senza account: frase del giorno,
 * Millina, la Ruota della Vita, il diario, il file .ics del calendario e tutto
 * il sistema di invito. Quello che ha bisogno di un account — percorsi
 * comprati, prenotazioni, eventi inclusi — è vuoto, e lo dice. L'interruttore
 * in cima accende dei dati di esempio dichiarati, per vedere l'area da piena.
 */

function Titolo({ title, note }: { title: string; note: string }) {
  return (
    <div className="pt-6 lg:col-span-12 lg:pt-10">
      <h2 className="display display-md font-normal">{title}</h2>
      <p className="body-copy mt-3 max-w-2xl">{note}</p>
    </div>
  );
}

export default function Dashboard() {
  const { demo } = useAccount();
  const revealRef = useReveal<HTMLDivElement>();
  const closingRef = useReveal<HTMLElement>();

  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-db-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-db-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-db-lede]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 0.65)
        .fromTo(q("[data-db-notice]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.85);
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
          className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(3rem,7vw,5rem)]"
          aria-labelledby="dashboard-title"
        >
          <Glow tone="gold" size="36rem" intensity={0.26} duration={26} className="-left-28 top-[4%]" />

          <div className="container-x relative">
            <Welcome />

            {/* Cosa funziona e cosa aspetta l'accesso: detto subito, non in fondo. */}
            <div data-db-notice className="mt-10 flex flex-col items-start gap-4">
              <p className="max-w-2xl rounded-[1rem] border border-gold/60 bg-ivory px-5 py-3 text-[0.85rem] leading-snug text-ink/80">
                {dashboard.notice}
              </p>
              <SwitchEsempio on={demo} />
              {demo && <p className="max-w-2xl text-[0.8rem] leading-snug text-mute-2">{dashboard.demoNote}</p>}
            </div>
          </div>
        </section>

        <section className="relative overflow-x-clip bg-ivory pb-[clamp(4rem,9vw,7rem)] pt-[clamp(2rem,5vw,3.5rem)]">
          <div ref={revealRef} className="container-x grid gap-5 lg:grid-cols-12">
            {/* Punto 24 */}
            <div data-reveal className="lg:col-span-12">
              <Daily />
            </div>

            {/* Punti 23 e 21-22 */}
            <Titolo title={dashboard.startLabel} note={dashboard.startNote} />
            <div id="ruota" data-reveal className="scroll-mt-[calc(var(--nav-h)+1rem)] lg:col-span-7">
              <Wheel />
            </div>
            <div id="millina" data-reveal className="scroll-mt-[calc(var(--nav-h)+1rem)] lg:col-span-5">
              <Millina />
            </div>

            {/* Punto 27 */}
            <div data-reveal className="pt-6 lg:col-span-12 lg:pt-10">
              <MyPaths />
            </div>

            {/* Punti 28, 29 e 30 */}
            <Titolo title={dashboard.boardLabel} note={dashboard.boardNote} />
            <div data-reveal className="lg:col-span-7">
              <Board />
            </div>
            <div className="lg:col-span-5">
              <Agenda />
            </div>

            {/* Punto 25 e punto 33 */}
            <div id="diario" data-reveal className="scroll-mt-[calc(var(--nav-h)+1rem)] pt-6 lg:col-span-7 lg:pt-10">
              <Diary />
            </div>
            <div data-reveal className="lg:col-span-5 lg:pt-10">
              <QuickAccess />
            </div>
          </div>
        </section>

        {/* Punto 26 */}
        <Invite />

        {/* Le due cose che il brief chiede di dire: cosa non è, e cosa
            deliberatamente non contiene. */}
        <section ref={closingRef} className="relative overflow-x-clip bg-ivory-2 section-pad">
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

          <div className="container-x mt-14 flex flex-col items-center gap-5 text-center lg:mt-20">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
