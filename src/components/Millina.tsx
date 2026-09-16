import { useRef, useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { respond, type Answer } from "@/lib/millina/engine";
import type { Offer } from "@/lib/millina/catalog";
import { Link } from "./Link";

/**
 * Millina (punti 21-22).
 *
 * Il volto è leggermente robotico ma botanico: una testa arrotondata con due
 * occhi e un germoglio al posto dell'antenna. "Femminile, simpatica, delicata,
 * coerente con lo stile Mila" — quindi niente robot di metallo e niente faccina
 * generica, ma nemmeno un umano finto.
 *
 * La conversazione segue la catena del brief: bisogno → comprensione →
 * suggerimento → prossimo passo. La comprensione viene sempre detta ad alta
 * voce prima di proporre qualcosa: è ciò che distingue "ti ho ascoltata" da
 * "ecco un prodotto".
 */

export function MillinaFace({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" className="h-full w-full">
        <defs>
          <linearGradient id="millina-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sage-soft)" />
            <stop offset="100%" stopColor="var(--color-sage)" />
          </linearGradient>
        </defs>
        {/* il germoglio, al posto dell'antenna */}
        <path
          d="M24 11c0-3.4-2.2-5.6-5-6 .2 3.2 2 5.4 5 6Z"
          fill="var(--color-sage-deep)"
          opacity="0.8"
        />
        <path d="M24 12v-3" stroke="var(--color-sage-deep)" strokeWidth="1.4" strokeLinecap="round" />
        {/* la testa */}
        <rect x="7" y="12" width="34" height="29" rx="13" fill="url(#millina-skin)" />
        <rect
          x="7"
          y="12"
          width="34"
          height="29"
          rx="13"
          fill="none"
          stroke="var(--color-sage-deep)"
          strokeWidth="1.1"
          opacity="0.45"
        />
        {/* gli occhi, che ogni tanto sbattono */}
        <g className="millina-eyes" fill="var(--color-ink)">
          <circle cx="18" cy="25" r="2.1" />
          <circle cx="30" cy="25" r="2.1" />
        </g>
        {/* un accenno di sorriso */}
        <path
          d="M20.5 31.5c2 1.6 5 1.6 7 0"
          stroke="var(--color-ink)"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        {/* il fiorellino sulla guancia, il suo segno */}
        <circle cx="36" cy="33" r="1.5" fill="var(--color-gold)" opacity="0.85" />
      </svg>
    </span>
  );
}

function OfferCard({ offer, tone = "main" }: { offer: Offer; tone?: "main" | "quiet" }) {
  if (tone === "quiet") {
    return (
      <Link
        to={offer.to}
        className="link-underline inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-mute"
      >
        {offer.name}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <Link
      to={offer.to}
      className="card-hover group mt-4 block rounded-[1.1rem] border border-sage-deep/30 bg-ivory p-5 hover:border-sage-deep/60"
    >
      <span className="flex items-start justify-between gap-4">
        <span className="text-[1.05rem] font-medium tracking-[-0.015em]">{offer.name}</span>
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ink group-hover:text-ivory">
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </span>
      <span className="mt-2 block text-[0.9rem] leading-snug text-mute">{offer.line}</span>
    </Link>
  );
}

type Turn = { from: "tu" | "millina"; text?: string; answer?: Answer };

const APERTURA: Turn = {
  from: "millina",
  answer: {
    kind: "question",
    text: "Ciao. Dimmi cosa ti pesa in questo momento, o cosa vorresti cambiare: provo a capire da dove conviene partire.",
    options: ["Non so da dove partire", "Sto attraversando un periodo difficile", "Vorrei più indipendenza"],
  },
};

export function Millina() {
  const [turns, setTurns] = useState<Turn[]>([APERTURA]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setTurns((prev) => [...prev, { from: "tu", text: clean }, { from: "millina", answer: respond(clean) }]);
    setDraft("");
    // Il nuovo turno va portato in vista, ma senza strappare la pagina.
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-ivory-2/60 p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <MillinaFace />
        <div>
          <p className="display display-sm font-normal">Millina</p>
          <p className="text-[0.85rem] text-mute">La tua piccola assistente dentro l'ecosistema</p>
        </div>
      </div>

      <div className="mt-7 grid gap-5">
        {turns.map((turn, i) =>
          turn.from === "tu" ? (
            <p key={i} className="ml-auto max-w-[85%] rounded-[1.1rem] rounded-br-sm bg-sage-deep px-4 py-2.5 text-[0.95rem] text-ivory">
              {turn.text}
            </p>
          ) : (
            <div key={i} className="max-w-[92%]">
              {turn.answer?.kind === "question" ? (
                <>
                  <p className="text-[1rem] leading-snug text-ink">{turn.answer.text}</p>
                  {turn.answer.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {turn.answer.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => ask(opt)}
                          className="rounded-full border border-ink/15 bg-ivory px-3.5 py-1.5 text-[0.82rem] text-ink/80 transition-colors duration-300 hover:border-sage-deep/50 hover:bg-sage-soft"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : turn.answer ? (
                <>
                  {/* 1. la comprensione, prima di qualsiasi proposta */}
                  <p className="text-[1rem] leading-snug text-ink">{turn.answer.echo}</p>

                  {/* 2. una cosa sola */}
                  <OfferCard offer={turn.answer.main} />

                  {/* 3. le alternative, sottovoce */}
                  {turn.answer.alternatives.length > 0 && (
                    <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.85rem] text-mute-2">
                      <span>Oppure:</span>
                      {turn.answer.alternatives.map((alt) => (
                        <OfferCard key={alt.id} offer={alt} tone="quiet" />
                      ))}
                    </p>
                  )}

                  {/* 4. il prossimo passo: il gesto più piccolo possibile */}
                  {turn.answer.nextStep.id !== turn.answer.main.id && (
                    <p className="mt-4 rounded-[0.9rem] border border-gold/50 bg-ivory px-4 py-3 text-[0.88rem] leading-snug text-ink/80">
                      Se vuoi partire dal gesto più piccolo:{" "}
                      <Link to={turn.answer.nextStep.to} className="link-underline font-medium text-sage-deep">
                        {turn.answer.nextStep.name}
                      </Link>
                      .
                    </p>
                  )}

                  {turn.answer.note && (
                    <p className="serif-accent mt-3 text-[0.95rem] text-sage-deep">{turn.answer.note}</p>
                  )}
                </>
              ) : null}
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <form
        className="mt-7 flex items-center gap-2 rounded-full border border-ink/15 bg-ivory py-1.5 pl-5 pr-1.5 focus-within:border-sage-deep/50"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
      >
        <label htmlFor="millina-input" className="sr-only">
          Scrivi a Millina
        </label>
        <input
          id="millina-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Scrivi a Millina…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-[0.95rem] text-ink outline-none placeholder:text-mute-2"
        />
        <button
          type="submit"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-cta text-ivory transition-transform duration-500 [transition-timing-function:var(--ease-premium)] hover:scale-105 disabled:opacity-40"
          disabled={!draft.trim()}
        >
          <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="sr-only">Invia</span>
        </button>
      </form>

      <p className="mt-4 text-[0.75rem] leading-snug text-mute-2">
        Millina conosce tutto l'ecosistema e consiglia solo quello che c'è davvero. Non è una terapeuta: se stai
        male sul serio, parlane con una professionista.
      </p>
    </div>
  );
}
