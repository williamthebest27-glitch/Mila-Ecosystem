import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { inviteLink, useAccount } from "@/lib/account/store";
import { Glow, Sparkles } from "@/components/Atmosphere";
import { useReveal } from "@/hooks/useGsap";

/**
 * Punto 26 — "Invita un'amica".
 *
 * Il brief chiede quattro cose (codice, link, pulsante copia, possibilità di
 * condividere) e poi dice la cosa più importante: "per ora mi interessa
 * soprattutto predisporre il sistema". Quindi qui funziona tutto quello che
 * può funzionare senza un server — il codice esiste, il link è il link vero di
 * questo sito, copia copia davvero, condividi apre la condivisione del
 * telefono — e chi arriva da un link di invito viene registrata (lo si vede
 * in fondo alla scheda).
 *
 * Quello che non c'è, non viene finto: il codice è provvisorio finché non
 * esiste l'accesso, e il premio non è ancora deciso. Il brief lo dice da sé,
 * e un premio inventato adesso diventerebbe una promessa fatta a nome di Mila.
 *
 * Nessun contatore di invitate: senza account non c'è niente da contare, e un
 * "0" fermo per sempre è peggio di una riga che spiega quando comincerà a
 * muoversi.
 */

/** Le possibilità che il brief elenca, nel suo stesso ordine. */
const PREMI = ["un ebook", "una mini guida", "un workbook", "un mini corso", "un contenuto", "uno sconto"];

const PASSI = [
  { n: "01", title: "Condividi il tuo link", text: "Per messaggio, in una storia, a voce: il codice si detta anche al telefono." },
  { n: "02", title: "Lei entra da lì", text: "Chi apre il tuo link arriva nell'ecosistema con il tuo codice già addosso." },
  { n: "03", title: "Il premio arriva a te", text: "Quando il premio sarà deciso, si accende qui: il sistema è già pronto a riconoscerlo." },
];

export function Invite() {
  const { referral, invitedBy } = useAccount();
  const revealRef = useReveal<HTMLDivElement>();
  const [link, setLink] = useState("");
  const [copiato, setCopiato] = useState<null | "codice" | "link">(null);
  const [manuale, setManuale] = useState(false);
  const [puoiCondividere, setPuoiCondividere] = useState(false);
  const campoRef = useRef<HTMLInputElement>(null);
  const codiceRef = useRef<HTMLParagraphElement>(null);

  // Origine e API di condivisione esistono solo nel browser: si leggono dopo
  // il mount, non durante il render.
  useEffect(() => setLink(inviteLink(referral)), [referral]);
  useEffect(() => setPuoiCondividere(typeof navigator !== "undefined" && typeof navigator.share === "function"), []);

  async function copia(testo: string, cosa: "codice" | "link") {
    try {
      await navigator.clipboard.writeText(testo);
      setCopiato(cosa);
      setManuale(false);
      window.setTimeout(() => setCopiato(null), 2600);
    } catch {
      // Appunti negati (permesso rifiutato, pagina non sicura): si seleziona
      // quello che stava copiando e si dice come fare. Mai un "copiato" che
      // non è successo.
      setManuale(true);
      if (cosa === "link") {
        campoRef.current?.select();
      } else if (codiceRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codiceRef.current);
        const selezione = window.getSelection();
        selezione?.removeAllRanges();
        selezione?.addRange(range);
      }
    }
  }

  async function condividi() {
    try {
      await navigator.share({
        title: "Mila Ecosystem",
        text: "Ti va di guardarlo insieme a me? Questo è il mio invito.",
        url: link,
      });
    } catch {
      // Condivisione annullata: non è un errore, non si dice niente.
    }
  }

  return (
    <section
      ref={revealRef}
      id="invito"
      className="relative overflow-x-clip bg-sage-wash section-pad"
      aria-labelledby="invito-title"
    >
      <Glow tone="gold" size="32rem" intensity={0.24} duration={27} className="-right-24 top-[10%]" />

      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6" data-reveal>
          <p className="label">Invita un'amica</p>
          <h2 id="invito-title" className="display display-md mt-5 max-w-[14ch]">
            Portala <span className="serif-accent text-sage-deep">dentro</span> con te.
          </h2>
          <p className="body-copy mt-6 max-w-lg">
            Il codice qui sotto è tuo. Quando una tua amica entra da lì, l'ecosistema sa che è arrivata grazie a te —
            e quello che ricevi in cambio lo decidiamo presto.
          </p>

          {/* Il codice, grande abbastanza da leggersi ad alta voce. */}
          <div className="relative mt-9 overflow-hidden rounded-[1.25rem] border border-gold/50 bg-ivory p-6 sm:p-7">
            <Sparkles count={4} seed={referral.length * 7} tone="gold" minSize={7} maxSize={13} />
            <div className="relative">
              <p className="label !text-[0.6rem]">Il tuo codice</p>
              <p ref={codiceRef} className="num display mt-3 text-[clamp(1.6rem,4vw,2.3rem)] tracking-[0.06em]">
                {referral}
              </p>
              <button
                type="button"
                onClick={() => copia(referral, "codice")}
                className="link-underline mt-4 inline-flex items-center gap-2 text-[0.85rem] font-medium text-mute"
              >
                {copiato === "codice" ? (
                  <Check className="h-3.5 w-3.5 text-sage-deep" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                )}
                {copiato === "codice" ? "Copiato" : "Copia il codice"}
              </button>
            </div>
          </div>

          {/* Il link personale. */}
          <div className="mt-5">
            <label htmlFor="invito-link" className="label !text-[0.6rem]">
              Il tuo link
            </label>
            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
              <input
                ref={campoRef}
                id="invito-link"
                value={link}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 rounded-full border border-ink/15 bg-ivory px-5 py-3 text-[0.9rem] text-ink outline-none focus:border-sage-deep/50"
              />
              <div className="flex shrink-0 gap-2.5">
                <button type="button" onClick={() => copia(link, "link")} className="btn btn-primary !px-5 !py-3 !text-[0.85rem]">
                  {copiato === "link" ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  )}
                  <span>{copiato === "link" ? "Copiato" : "Copia"}</span>
                </button>
                {puoiCondividere && (
                  <button type="button" onClick={condividi} className="btn btn-ghost !px-5 !py-3 !text-[0.85rem]">
                    <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    <span>Condividi</span>
                  </button>
                )}
              </div>
            </div>

            <p aria-live="polite" className="mt-3 text-[0.8rem] leading-snug text-mute-2">
              {manuale
                ? "Il browser non mi lascia usare gli appunti: il testo è già selezionato, premi Ctrl+C (o Cmd+C)."
                : "Il codice è provvisorio: quando ci sarà l'accesso diventa definitivo e resta legato al tuo profilo."}
            </p>
          </div>

          {invitedBy && (
            <p className="mt-6 rounded-[0.9rem] border border-sage-deep/30 bg-ivory px-4 py-3 text-[0.85rem] leading-snug text-ink/80">
              Sei arrivata con l'invito di qualcuna: codice <span className="num font-medium">{invitedBy}</span>. Il
              sistema lo ha registrato — è esattamente quello che succederà anche alle tue amiche.
            </p>
          )}
        </div>

        <div className="lg:col-span-5 lg:col-start-8" data-reveal data-reveal-delay="0.12">
          <p className="label">Come funziona</p>
          <ol className="mt-6 grid gap-6">
            {PASSI.map((passo) => (
              <li key={passo.n} className="flex gap-5">
                <span className="num text-[0.75rem] tracking-[0.2em] text-mute-2">{passo.n}</span>
                <span className="min-w-0">
                  <span className="display block text-[1.05rem] font-normal leading-tight">{passo.title}</span>
                  <span className="mt-1.5 block text-[0.9rem] leading-snug text-mute">{passo.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-[1.1rem] border border-dashed border-ink/20 bg-ivory/60 p-6">
            <p className="label !text-[0.6rem]">Il premio</p>
            <p className="serif-accent mt-3 text-[1.15rem] leading-snug text-sage-deep">Non è ancora deciso.</p>
            <p className="mt-3 text-[0.9rem] leading-snug text-mute">
              Sul tavolo ci sono {PREMI.slice(0, -1).join(", ")} o {PREMI[PREMI.length - 1]}. Finché la scelta non è
              fatta, qui non compare niente: meglio un posto vuoto che una promessa che non abbiamo ancora fatto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
