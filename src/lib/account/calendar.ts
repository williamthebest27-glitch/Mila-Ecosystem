import type { Booking, CollectiveEvent } from "./types";

/**
 * Il tempo dell'area personale: prenotazioni ed eventi (punti 28-30), il file
 * .ics che li porta nel calendario del telefono, e le formattazioni in
 * italiano.
 *
 * Le date si scrivono sempre in ora locale ("2026-09-22T18:00", senza fuso):
 * un incontro delle 18:00 è alle 18:00 per chi lo legge, e trasformarlo in UTC
 * da qualche parte nel mezzo è il modo più comune di far arrivare una donna
 * alla call con due ore di ritardo. L'unica conversione a UTC avviene dentro
 * il file .ics, dove lo standard la impone.
 */

export type AgendaEntry = {
  id: string;
  /** "prenotazione" per gli appuntamenti propri, il tipo dell'evento per gli altri. */
  kind: "prenotazione" | CollectiveEvent["kind"];
  title: string;
  /** La riga sotto al titolo: con chi, oppure in che percorso è compreso. */
  detail: string;
  start: Date;
  minutes: number;
  link?: string;
};

const parse = (s: string) => new Date(s);

export function agenda(bookings: Booking[], events: CollectiveEvent[]): AgendaEntry[] {
  const voci: AgendaEntry[] = [
    ...bookings.map((b) => ({
      id: b.id,
      kind: "prenotazione" as const,
      title: b.title,
      detail: `${b.type} · ${b.who}`,
      start: parse(b.start),
      minutes: b.minutes,
      link: b.link,
    })),
    ...events.map((e) => ({
      id: e.id,
      kind: e.kind,
      title: e.title,
      detail: e.who ? `${e.who} · incluso in ${e.includedIn}` : `Incluso in ${e.includedIn}`,
      start: parse(e.start),
      minutes: e.minutes,
      link: e.link,
    })),
  ];
  return voci.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** Raggruppa per mese, mantenendo l'ordine cronologico. */
export function perMese(voci: AgendaEntry[]): Array<{ mese: string; voci: AgendaEntry[] }> {
  const gruppi: Array<{ mese: string; voci: AgendaEntry[] }> = [];
  for (const voce of voci) {
    const mese = meseAnno(voce.start);
    const ultimo = gruppi[gruppi.length - 1];
    if (ultimo && ultimo.mese === mese) ultimo.voci.push(voce);
    else gruppi.push({ mese, voci: [voce] });
  }
  return gruppi;
}

/* ------------------------------------------------------------------
   Formattazioni
------------------------------------------------------------------- */
const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("it-IT", opts);

export const ora = (d: Date) => fmt({ hour: "2-digit", minute: "2-digit" }).format(d);
export const giorno = (d: Date) => fmt({ day: "numeric" }).format(d);
export const meseBreve = (d: Date) => fmt({ month: "short" }).format(d).replace(".", "");
export const giornoBreve = (d: Date) => fmt({ weekday: "short" }).format(d).replace(".", "");
export const meseAnno = (d: Date) => fmt({ month: "long", year: "numeric" }).format(d);

/** Quanti giorni di calendario mancano: 0 = oggi, 1 = domani. */
export function giorniDa(d: Date, now = new Date()): number {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** "oggi", "domani", "fra 5 giorni", "fra 3 settimane". Al passato: "è passata". */
export function quando(d: Date, now = new Date()): string {
  const g = giorniDa(d, now);
  if (g < 0) return "è passata";
  if (g === 0) return "oggi";
  if (g === 1) return "domani";
  if (g < 14) return `fra ${g} giorni`;
  const settimane = Math.round(g / 7);
  return settimane < 9 ? `fra ${settimane} settimane` : `fra ${Math.round(g / 30)} mesi`;
}

/** La fine dell'incontro, per mostrare "18:00 – 18:45". */
export const fine = (d: Date, minuti: number) => new Date(d.getTime() + minuti * 60_000);

/* ------------------------------------------------------------------
   iCalendar — "Aggiungi al calendario" del punto 29
------------------------------------------------------------------- */

/** RFC 5545: la virgola, il punto e virgola, la barra rovescia e gli a capo vanno protetti. */
const escape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const stamp = (d: Date) => `${d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`;

const byteLen = (cp: number) => (cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4);

/**
 * Le righe di un .ics non possono superare i 75 ottetti: si spezzano e si
 * riprendono con uno spazio. Il conto è in ottetti e non in caratteri perché
 * "è" ne occupa due, e spezzare a metà una lettera accentata rompe il file.
 */
function piega(riga: string): string {
  const out: string[] = [];
  let corrente = "";
  let lunghezza = 0;
  for (const ch of riga) {
    const n = byteLen(ch.codePointAt(0)!);
    const limite = out.length === 0 ? 75 : 74; // le righe successive iniziano con uno spazio
    if (lunghezza + n > limite) {
      out.push(corrente);
      corrente = "";
      lunghezza = 0;
    }
    corrente += ch;
    lunghezza += n;
  }
  out.push(corrente);
  return out.join("\r\n ");
}

export type CalendarEvent = {
  uid: string;
  title: string;
  start: Date;
  minutes: number;
  description?: string;
  location?: string;
  url?: string;
};

export function toIcs(ev: CalendarEvent): string {
  const righe = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mila Ecosystem//Area personale//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.uid}@mila-ecosystem`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(ev.start)}`,
    `DTEND:${stamp(fine(ev.start, ev.minutes))}`,
    `SUMMARY:${escape(ev.title)}`,
    ev.description ? `DESCRIPTION:${escape(ev.description)}` : "",
    ev.location ? `LOCATION:${escape(ev.location)}` : "",
    ev.url ? `URL:${escape(ev.url)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return righe.map(piega).join("\r\n") + "\r\n";
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "evento";

/** Scarica il .ics. Il calendario del telefono lo apre da solo. */
export function scaricaIcs(ev: CalendarEvent) {
  const blob = new Blob([toIcs(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(ev.title)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Il revoke immediato taglia il download su alcuni browser: un giro di
  // eventi basta perché il file sia stato preso.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
