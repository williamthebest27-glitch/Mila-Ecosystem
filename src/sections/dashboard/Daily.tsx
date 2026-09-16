import { dailyQuotes } from "@/data/content";
import { Sparkles } from "@/components/Atmosphere";

/**
 * Punto 24 — la frase del giorno.
 *
 * La scelta è deterministica sulla data, non casuale: chi ricarica la pagina
 * tre volte deve trovare la stessa frase, altrimenti non è "la frase del
 * giorno", è una slot machine. Cambia a mezzanotte locale e il giro completo
 * dura ventiquattro giorni.
 */

function dayIndex(date = new Date()): number {
  // Giorni dall'epoca calcolati sulla data locale, così il cambio avviene a
  // mezzanotte di chi legge e non a mezzanotte UTC.
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local / 86_400_000);
}

export function quoteOfTheDay(date = new Date()): string {
  return dailyQuotes[dayIndex(date) % dailyQuotes.length];
}

export function Daily() {
  const today = new Date();
  const quote = quoteOfTheDay(today);
  const formatted = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/10 p-7 sm:p-9" style={{ backgroundImage: "var(--gradient-sage)" }}>
      <Sparkles count={5} seed={quote.length} tone="gold" minSize={7} maxSize={14} />

      <div className="relative">
        <p className="label !text-[0.625rem]">Frase del giorno</p>
        <p className="serif-accent mt-5 text-[clamp(1.4rem,2.6vw,2rem)] leading-snug text-ink">“{quote}”</p>
        <p className="mt-6 text-[0.8rem] capitalize text-ink/55">{formatted}</p>
      </div>
    </div>
  );
}
