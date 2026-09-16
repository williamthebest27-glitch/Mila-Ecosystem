import { library } from "@/data/content";
import { useGsap, gsap, useReveal } from "@/hooks/useGsap";
import { Button } from "@/components/Button";

/**
 * Punto 18 — la libreria.
 *
 * Le copertine sono provvisorie, come il brief consente, ma disegnate in
 * tipografia con il font e la palette del progetto invece che generate: nessun
 * artefatto, coerenza garantita, e si sostituiscono con l'artwork vero
 * cambiando una riga. Restano volutamente una serie — quattro variazioni della
 * stessa idea — perché è così che si legge la collana di un solo autore.
 */

/** Le quattro tinte della collana. Nessun fondo scuro: vale anche per gli oggetti. */
const COVER_TONES = [
  { ground: "var(--gradient-sage)", ink: "var(--color-ink)", meta: "var(--color-sage-deep)" },
  { ground: "var(--color-ivory)", ink: "var(--color-sage-deep)", meta: "var(--color-mute)" },
  { ground: "var(--color-ivory-2)", ink: "var(--color-ink)", meta: "var(--color-mute)" },
  { ground: "var(--color-ivory-3)", ink: "var(--color-ink)", meta: "var(--color-clay-deep)" },
] as const;

/**
 * Esportata: la usa anche "I tuoi percorsi" nell'area personale (punto 27),
 * perché un libro comprato deve avere la stessa copertina che aveva sullo
 * scaffale.
 */
export function Cover({ title, topic, tone }: { title: string; topic: string; tone: number }) {
  const t = COVER_TONES[tone] ?? COVER_TONES[0];
  return (
    <div
      aria-hidden="true"
      className="card-img relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-l-[3px] rounded-r-[0.6rem] p-6 shadow-[0_18px_40px_-22px_rgba(49,38,30,0.5)]"
      style={{ background: t.ground, color: t.ink }}
    >
      {/* Il dorso: una striscia in ombra sul bordo sinistro */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-3"
        style={{ background: "linear-gradient(90deg, rgba(49,38,30,0.16), rgba(49,38,30,0) 70%)" }}
      />
      {/* Il taglio delle pagine sul bordo destro */}
      <span
        className="pointer-events-none absolute inset-y-0 right-0 w-1.5"
        style={{ background: "linear-gradient(270deg, rgba(255,253,246,0.55), rgba(255,253,246,0))" }}
      />

      <span className="label !text-[0.55rem]" style={{ color: t.meta }}>
        Mila Ecosystem
      </span>

      <span className="block">
        <span className="rule-gold mb-4 block w-10" />
        <span className="display block text-[clamp(1.15rem,1.55vw,1.5rem)] font-normal leading-tight">{title}</span>
      </span>

      <span className="label !text-[0.55rem]" style={{ color: t.meta }}>
        {topic}
      </span>
    </div>
  );
}

export function Library() {
  const revealRef = useReveal<HTMLDivElement>();
  const ref = useGsap<HTMLElement>((mm, scope) => {
    const q = gsap.utils.selector(scope);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-lb-book]"),
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.09,
          ease: "premium",
          scrollTrigger: { trigger: q("[data-lb-shelf]"), start: "top 85%", once: true },
        },
      );
    });
  });

  return (
    <section ref={ref} className="relative overflow-x-clip bg-ivory section-pad" aria-labelledby="library-shelf">
      <div ref={revealRef} className="container-x">
        <p id="library-shelf" className="label" data-reveal>
          {library.preview}
        </p>

        <ul data-lb-shelf className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {library.books.map((book) => {
            const open = Boolean(book.to);
            return (
              <li key={book.title} data-lb-book className="group flex flex-col">
                <Cover title={book.title} topic={book.topic} tone={book.tone} />

                <p className="label mt-6 !text-[0.6rem]">{book.topic}</p>
                <h3 className="display display-sm mt-2 font-normal">{book.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-snug text-mute">{book.description}</p>

                {/* Le due CTA del brief si vedono sempre: servono a mostrare come
                    sarà. Finché il libro non ha un `to` restano inerti invece di
                    portare da nessuna parte. */}
                <div className="mt-auto pt-6">
                  {open ? (
                    <div className="flex flex-wrap gap-2.5">
                      <Button to={book.to!} variant="primary" className="!px-5 !py-3 !text-[0.85rem]">
                        {book.action ?? "Acquista"}
                      </Button>
                      <Button to={book.to!} variant="ghost" arrow="up" className="!px-5 !py-3 !text-[0.85rem]">
                        {library.discover}
                      </Button>
                    </div>
                  ) : (
                    <div aria-disabled="true" className="pointer-events-none select-none">
                      <div className="flex flex-wrap gap-2.5 opacity-40">
                        <span className="btn btn-primary !px-5 !py-3 !text-[0.85rem]">{book.action ?? "Acquista"}</span>
                        <span className="btn btn-ghost !px-5 !py-3 !text-[0.85rem]">{library.discover}</span>
                      </div>
                      <p className="mt-3 text-[0.75rem] uppercase tracking-[0.16em] text-gold-deep">{library.soon}</p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}

          {/* Il posto già pronto per il titolo che verrà */}
          <li data-lb-book className="flex flex-col">
            <div
              aria-hidden="true"
              className="flex aspect-[2/3] items-center justify-center rounded-l-[3px] rounded-r-[0.6rem] border border-dashed border-ink/20 bg-ivory-2/40"
            >
              <span className="text-[2rem] text-ink/15">+</span>
            </div>
            <p className="label mt-6 !text-[0.6rem]">{library.nextLabel}</p>
            <p className="mt-2 text-[0.9rem] leading-snug text-mute">{library.nextText}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
