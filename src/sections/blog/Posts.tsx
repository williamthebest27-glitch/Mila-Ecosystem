import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { blog } from "@/data/content";
import { useReveal } from "@/hooks/useGsap";
import { Link } from "@/components/Link";

/**
 * Gli articoli e i pensieri veloci (punto 32).
 *
 * Due elenchi, un interruttore: è la stessa divisione dell'app originale, e
 * regge perché le due cose si leggono in modi diversi — un articolo si sceglie,
 * un pensiero si attraversa.
 *
 * Gli articoli sono un indice editoriale, non delle schede: una riga per
 * titolo, categoria e data a sinistra, tempo di lettura a destra. È la stessa
 * forma delle risorse gratuite in homepage, e per la stessa ragione — con
 * sei voci una griglia di card è più rumore che informazione.
 *
 * Solo la lettera si apre. Gli altri titoli restano leggibili ma inerti, con
 * scritto "in arrivo": come le copertine provvisorie della libreria, mostrare
 * che esistono è utile, fingere che si aprano no.
 */
export function Posts() {
  const [tab, setTab] = useState<"articoli" | "pensieri">("articoli");
  const revealRef = useReveal<HTMLDivElement>([tab]);

  return (
    <section className="bg-ivory section-pad" aria-labelledby="blog-posts-title">
      <div className="container-x">
        <h2 id="blog-posts-title" className="sr-only">
          Articoli e pensieri
        </h2>

        {/* L'interruttore fra i due elenchi */}
        <div className="flex flex-wrap items-center gap-8 border-b hairline pb-4" role="tablist" aria-label="Cosa leggere">
          {(
            [
              ["articoli", blog.postsLabel, blog.posts.length],
              ["pensieri", blog.thoughtsLabel, blog.thoughts.length],
            ] as const
          ).map(([id, label, n]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`pannello-${id}`}
              onClick={() => setTab(id)}
              className={`relative -mb-[1.05rem] pb-4 text-[0.95rem] font-medium transition-colors duration-500 [transition-timing-function:var(--ease-premium)] ${
                tab === id ? "text-ink" : "text-mute-2 hover:text-mute"
              }`}
            >
              {label}
              <span className="num ml-2 text-[0.75rem] text-mute-2">{n}</span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-500 [transition-timing-function:var(--ease-premium)] ${
                  tab === id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div ref={revealRef}>
          {tab === "articoli" ? (
            <ol id="pannello-articoli" role="tabpanel" aria-labelledby="tab-articoli" className="mt-2">
              {blog.posts.map((post, i) => {
                const riga = (
                  <>
                    <span className="num text-[0.7rem] tracking-[0.2em] text-mute-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hidden md:block">
                      <span className="label !text-[0.625rem] text-ink">{post.category}</span>
                      <span className="mt-1 block text-[0.75rem] text-mute-2">{post.date}</span>
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`display display-sm block font-normal ${
                          post.to
                            ? "transition-transform duration-500 [transition-timing-function:var(--ease-premium)] group-hover:translate-x-2"
                            : ""
                        }`}
                      >
                        {post.title}
                      </span>
                      <span className="mt-2 block text-[0.9rem] text-mute md:hidden">
                        {post.category} · {post.date}
                      </span>
                      <span className="mt-2 block text-[0.9rem] leading-snug text-mute">{post.hook}</span>
                    </span>
                    <span className="flex items-center gap-3 justify-self-end">
                      <span className="num hidden whitespace-nowrap text-[0.78rem] text-mute-2 sm:block">
                        {post.minutes} {blog.reading}
                      </span>
                      {post.to ? (
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ink group-hover:text-ivory">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="rounded-full border border-gold/50 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-gold-deep">
                          {blog.soon}
                        </span>
                      )}
                    </span>
                  </>
                );

                const classi =
                  "grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b hairline py-6 md:grid-cols-[4rem_10rem_1fr_auto] md:gap-x-8 md:py-7 lg:-mx-4 lg:px-4";

                return (
                  <li key={post.title} data-reveal data-reveal-delay={String(i * 0.04)}>
                    {post.to ? (
                      <Link
                        to={post.to}
                        className={`group ${classi} transition-colors duration-500 hover:bg-ivory-2/50`}
                      >
                        {riga}
                      </Link>
                    ) : (
                      <div className={classi}>{riga}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <ul id="pannello-pensieri" role="tabpanel" aria-labelledby="tab-pensieri" className="mt-12 grid gap-6 lg:grid-cols-2">
              {blog.thoughts.map((pensiero, i) => (
                <li
                  key={pensiero}
                  data-reveal
                  data-reveal-delay={String(i * 0.06)}
                  className="rounded-[1.25rem] border border-ink/10 bg-ivory-2/50 p-7 sm:p-9"
                >
                  <span className="rule-gold mb-6 block w-10" />
                  <p className="serif-accent text-[clamp(1.2rem,2.2vw,1.6rem)] leading-snug text-ink">{pensiero}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
