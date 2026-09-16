import { useId, type ReactNode } from "react";
import { setDemo } from "@/lib/account/store";

/**
 * Il vestiario comune dell'area personale.
 *
 * Le schede della dashboard erano già tutte uguali — stesso raggio, stesso
 * bordo, stessa etichetta in alto — ma scritte a mano una per una. Con cinque
 * sezioni nuove (punti 26-31) la ripetizione diventava il modo più semplice di
 * far divergere l'area da sé stessa, quindi la scheda vive qui.
 */

export function Card({
  id,
  title,
  note,
  right,
  className = "",
  ground = "ivory",
  children,
}: {
  id?: string;
  title: string;
  /** La riga sotto al titolo: cosa c'è dentro e perché. */
  note?: string;
  /** L'angolo in alto a destra: il segnalino dei dati di esempio, di solito. */
  right?: ReactNode;
  className?: string;
  ground?: "ivory" | "sand";
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`rounded-[1.5rem] border border-ink/10 p-6 sm:p-8 ${ground === "sand" ? "bg-ivory-2/60" : "bg-ivory"} ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 id={titleId} className="label">
          {title}
        </h2>
        {right}
      </div>
      {note && <p className="mt-3 max-w-xl text-[0.95rem] leading-snug text-mute">{note}</p>}
      {children}
    </section>
  );
}

/**
 * Lo stato vuoto.
 *
 * Non è un errore e non è un peccato: è il modo in cui l'area personale dice
 * la verità quando non c'è ancora niente. Quindi ha la stessa cura del resto —
 * dice cosa comparirà qui, e offre la strada più corta per farcelo arrivare.
 */
export function Vuoto({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="mt-7 rounded-[1.1rem] border border-dashed border-ink/20 bg-ivory-2/40 p-6 sm:p-7">
      <p className="serif-accent text-[1.15rem] leading-snug text-sage-deep">{title}</p>
      <p className="mt-3 max-w-lg text-[0.92rem] leading-snug text-mute">{text}</p>
      {children && <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">{children}</div>}
    </div>
  );
}

/** Il segnalino che accompagna ogni scheda mentre i dati di esempio sono accesi. */
export function Esempio({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-ivory px-3 py-1 text-[0.7rem] font-medium text-gold-deep">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
      Dati di esempio
    </span>
  );
}

/**
 * L'interruttore dei dati di esempio.
 *
 * Sta in cima alla pagina, acceso o spento si legge da lontano, e mentre è
 * acceso ogni scheda porta il suo segnalino: nessuno deve poter scambiare
 * l'esempio per la propria vita.
 */
export function SwitchEsempio({ on }: { on: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setDemo(!on)}
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[0.85rem] transition-colors duration-500 [transition-timing-function:var(--ease-premium)] ${
        on ? "border-gold/70 bg-ivory text-ink" : "border-ink/15 bg-ivory/60 text-mute hover:border-sage-deep/45"
      }`}
    >
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors duration-500 [transition-timing-function:var(--ease-premium)] ${on ? "bg-sage-cta" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-ivory transition-transform duration-500 [transition-timing-function:var(--ease-premium)] ${on ? "translate-x-3.5" : "translate-x-0.5"}`}
        />
      </span>
      {on ? "Dati di esempio accesi" : "Guarda l'area con dei dati di esempio"}
    </button>
  );
}
