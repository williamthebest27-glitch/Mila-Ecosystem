import { impact } from "@/data/content";
import { useGsap, gsap } from "@/hooks/useGsap";

/**
 * 09 — Numbers already present on the homepage, counted up on entry.
 */
export function Impact() {
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      q<HTMLElement>("[data-i-item]").forEach((item, i) => {
        const num = item.querySelector<HTMLElement>("[data-i-num]");
        if (!num) return;
        const target = Number(num.dataset.iNum || 0);
        const counter = { v: 0 };
        num.textContent = "0";
        gsap.fromTo(item, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, delay: i * 0.08, ease: "premium", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v));
          },
        });
      });
    });
  });

  return (
    <section ref={ref} className="bg-ivory section-pad" aria-labelledby="impact-title">
      <div className="container-x">
        <p id="impact-title" className="label">
          {impact.label}
        </p>
        <ul className="mt-12 grid gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5 lg:gap-x-8">
          {impact.items.map((it) => (
            <li key={it.caption} data-i-item className="border-t hairline pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <p className="num whitespace-nowrap text-[clamp(3.25rem,7vw,5.75rem)] font-medium leading-none tracking-[-0.06em]">
                {it.prefix ? <span className="text-mute-2">{it.prefix}</span> : null}
                <span data-i-num={it.value}>
                  {it.value}
                </span>
                {it.suffix ? <span className="ml-1 text-[0.4em] font-normal tracking-normal text-mute">{it.suffix}</span> : null}
              </p>
              <p className="mt-4 max-w-[18rem] text-[0.9rem] leading-snug text-mute">{it.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
