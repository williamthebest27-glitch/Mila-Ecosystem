import { useEffect } from "react";
import { Pin } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { blog } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { Glow } from "@/components/Atmosphere";
import { SplitWords } from "@/components/Split";
import { Posts } from "@/sections/blog/Posts";
import { Suggest } from "@/sections/blog/Suggest";

/**
 * Punto 32 — il blog, "Pensieri di Mila".
 *
 * Era uno dei due ultimi vicoli ciechi del sito (l'altro erano le risorse
 * gratuite): il menu Esplora e il footer ci portavano, e si finiva su una
 * pagina segnaposto. Adesso c'è, con i contenuti dell'app originale.
 *
 * La lettera alla nonna sta in cima, fissata, com'è giusto: è il testo da cui
 * nasce tutto l'ecosistema, ed è l'unico che si apre davvero.
 */

function Intro() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "premium" } })
        .fromTo(q("[data-bl-label]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
        .fromTo(q("[data-bl-title] .split-word"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-bl-lede]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 0.7);
    });
  });

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-ivory-2 pt-[calc(var(--nav-h)+clamp(4rem,10vw,8rem))] pb-[clamp(3rem,7vw,5rem)]"
      aria-labelledby="blog-title"
    >
      <Glow tone="gold" size="34rem" intensity={0.26} duration={25} className="-right-24 top-[6%]" />

      <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-bl-label className="label">
            {blog.label}
          </p>
          <h1 id="blog-title" data-bl-title className="display display-xl mt-6 max-w-[13ch]">
            {blog.title.map((line, i) => (
              <span key={i} className="block">
                <SplitWords text={line} wordClass={i === 1 ? "serif-accent text-sage-deep" : ""} />
              </span>
            ))}
          </h1>
        </div>

        <div className="grid gap-5 lg:col-span-5 lg:max-w-md lg:justify-self-end">
          {blog.lede.map((p) => (
            <p key={p} data-bl-lede className="body-copy">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** La lettera, fissata in alto: il testo da cui nasce tutto l'ecosistema. */
function Pinned() {
  const revealRef = useReveal<HTMLDivElement>();

  return (
    <section className="bg-ivory pb-[clamp(3rem,7vw,5rem)] pt-[clamp(2rem,5vw,3.5rem)]" aria-labelledby="pinned-title">
      <div ref={revealRef} className="container-x">
        <p className="label" data-reveal>
          {blog.pinned.kicker}
        </p>

        <div
          data-reveal
          data-reveal-delay="0.08"
          className="card-hover group mt-6 grid gap-8 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-ivory-2/50 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10"
        >
          <figure className="overflow-hidden rounded-[1.1rem] lg:col-span-5">
            <img
              src="/images/founder-story.webp"
              alt="Le mani di una nonna che tiene la mano di una bambina, in toni verdi"
              width={1152}
              height={768}
              className="card-img aspect-[4/3] w-full object-cover"
            />
          </figure>

          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/55 bg-ivory px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-gold-deep">
              <Pin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              {blog.pinned.label}
            </p>
            <h2 id="pinned-title" className="display display-lg mt-6">
              {blog.pinned.title}
            </h2>
            <p className="body-copy mt-5 max-w-lg">{blog.pinned.text}</p>
            <div className="mt-8">
              <Button to={blog.pinned.cta.to} variant="primary" arrow="up">
                {blog.pinned.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Blog() {
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
        <Pinned />
        <Posts />
        <Suggest />
      </main>
      <Footer />
    </>
  );
}
