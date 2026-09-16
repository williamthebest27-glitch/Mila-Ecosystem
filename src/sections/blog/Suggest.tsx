import { useState } from "react";
import { Send } from "lucide-react";
import { blog } from "@/data/content";
import { useReveal } from "@/hooks/useGsap";

/**
 * "Suggeriscimi un argomento" (punto 32), come nell'app originale.
 *
 * Il modulo è vero: valida, si può compilare, ricorda quello che hai scritto.
 * Quello che non fa è mentire sull'invio — senza un servizio a cui recapitare
 * il messaggio, il suggerimento non parte, e la pagina lo dice invece di
 * mostrare un "grazie!" che non corrisponde a niente.
 *
 * Il punto di innesto è `invia`: quando ci sarà un indirizzo a cui mandarlo,
 * lì dentro va una fetch e nient'altro cambia.
 */
export function Suggest() {
  const revealRef = useReveal<HTMLDivElement>();
  const [topic, setTopic] = useState("");
  const [more, setMore] = useState("");
  const [errore, setErrore] = useState(false);
  const [pronto, setPronto] = useState(false);

  function invia(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      setErrore(true);
      return;
    }
    setErrore(false);
    setPronto(true);
  }

  return (
    <section className="bg-ivory-2 section-pad" aria-labelledby="suggerimento-title">
      <div ref={revealRef} className="container-x">
        <div className="mx-auto max-w-2xl" data-reveal>
          <p className="label">{blog.suggest.label}</p>
          <h2 id="suggerimento-title" className="display display-md mt-5">
            {blog.suggest.title}
          </h2>
          <p className="body-copy mt-5">{blog.suggest.text}</p>

          {pronto ? (
            <div className="mt-9 rounded-[1.25rem] border border-gold/50 bg-ivory p-7">
              <p className="serif-accent text-[1.2rem] leading-snug text-sage-deep">{blog.suggest.sentTitle}</p>
              <p className="mt-3 text-[0.95rem] leading-snug text-mute">{blog.suggest.sentText}</p>

              <dl className="mt-6 grid gap-3 border-t hairline pt-5 text-[0.9rem]">
                <div className="grid gap-1">
                  <dt className="text-[0.75rem] uppercase tracking-[0.14em] text-mute-2">{blog.suggest.topic}</dt>
                  <dd className="text-ink">{topic}</dd>
                </div>
                {more.trim() && (
                  <div className="grid gap-1">
                    <dt className="text-[0.75rem] uppercase tracking-[0.14em] text-mute-2">Nota</dt>
                    <dd className="whitespace-pre-line text-ink">{more}</dd>
                  </div>
                )}
              </dl>

              <button
                type="button"
                onClick={() => {
                  setPronto(false);
                  setTopic("");
                  setMore("");
                }}
                className="link-underline mt-6 text-[0.85rem] font-medium text-mute"
              >
                Scrivine un altro
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={invia} className="mt-9 grid gap-5">
              <div>
                <label htmlFor="argomento" className="label !text-[0.6rem]">
                  {blog.suggest.topic}
                </label>
                <input
                  id="argomento"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (errore) setErrore(false);
                  }}
                  maxLength={120}
                  aria-invalid={errore}
                  aria-describedby={errore ? "argomento-errore" : undefined}
                  className={`mt-3 w-full rounded-[0.9rem] border bg-ivory px-4 py-3 text-[0.98rem] text-ink outline-none transition-colors duration-300 placeholder:text-mute-2 focus:border-sage-deep/50 ${
                    errore ? "border-terracotta" : "border-ink/12"
                  }`}
                  placeholder="Di cosa vorresti che scrivessi?"
                />
                {errore && (
                  <p id="argomento-errore" className="mt-2 text-[0.82rem] text-terracotta">
                    {blog.suggest.manca}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="nota" className="label !text-[0.6rem]">
                  {blog.suggest.more}
                </label>
                <textarea
                  id="nota"
                  value={more}
                  onChange={(e) => setMore(e.target.value)}
                  rows={4}
                  maxLength={800}
                  className="mt-3 w-full resize-y rounded-[0.9rem] border border-ink/12 bg-ivory p-4 text-[0.98rem] leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:text-mute-2 focus:border-sage-deep/50"
                  placeholder="Il perché, un esempio, una domanda…"
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  <span>{blog.suggest.cta}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
