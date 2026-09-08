import { ArrowUpRight } from "lucide-react";
import { together } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";
import { Link } from "@/components/Link";
import { SplitWords } from "@/components/Split";

/**
 * Costruiamo insieme — a full-bleed photographic statement whose overlay
 * deepens as the text arrives.
 */
export function Together() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(q("[data-tg-bg] img"), { scale: 1 }, { scale: 1.12, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.fromTo(q("[data-tg-overlay]"), { opacity: 0.35 }, { opacity: 0.72, ease: "none", scrollTrigger: { trigger: scope, start: "top 80%", end: "center center", scrub: 1 } });
      gsap.fromTo(
        q("[data-tg-title] .split-word"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.05, ease: "premium", scrollTrigger: { trigger: q("[data-tg-title]"), start: "top 85%", once: true } },
      );
      q<HTMLElement>("[data-tg-reveal]").forEach((el, i) => {
        gsap.fromTo(el, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, delay: i * 0.1, ease: "premium", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
    });
  });

  return (
    <section ref={ref} data-nav="dark" className="relative isolate overflow-hidden bg-ink text-ivory" aria-labelledby="together-title">
      <div data-tg-bg className="absolute inset-0 -z-10">
        <img src="/images/community-circle.webp" alt="" loading="lazy" className="h-full w-full object-cover object-[50%_40%] will-change-transform" />
        <div data-tg-overlay aria-hidden="true" className="absolute inset-0 bg-ink opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/70" />
      </div>

      <div className="container-x section-pad grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <p className="label label-on-dark" data-tg-reveal>
            {together.label}
          </p>
          <h2 id="together-title" data-tg-title className="display display-lg mt-6 font-normal">
            {together.title.map((line, i) => (
              <span key={i} className="block">
                <SplitWords text={line} />
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-xl text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.55] text-ivory/80" data-tg-reveal>
            {together.text}
          </p>
          <p className="serif-accent mt-10 max-w-2xl text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.1] text-ivory" data-tg-reveal>
            {together.pull}
          </p>
        </div>

        <div className="lg:col-span-4 lg:self-end" data-tg-reveal>
          <Link
            to={together.feedback.cta.to}
            className="card-hover group block rounded-[1.5rem] border border-ivory/20 bg-ivory/10 p-7 backdrop-blur-md hover:border-ivory/40"
          >
            <span className="flex items-start justify-between gap-6">
              <span className="text-[1.25rem] font-medium leading-tight tracking-[-0.02em]">{together.feedback.title}</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/30 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ivory group-hover:text-ink">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </span>
            <span className="mt-4 block text-[0.95rem] leading-relaxed text-ivory/75">{together.feedback.text}</span>
            <span className="label label-on-dark mt-6 block !text-[0.625rem]">{together.feedback.cta.label} · anonimo</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
