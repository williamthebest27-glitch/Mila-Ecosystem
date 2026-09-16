import { levels, library, milaReset, resources, routes } from "@/data/content";
import type { AccountData } from "@/lib/account/types";

/**
 * I dati di esempio dell'area personale — e il fatto che questo file esista da
 * solo, separato da tutto il resto, è il punto.
 *
 * L'area personale, senza un account, è vuota: nessun percorso comprato,
 * nessuna prenotazione, nessun evento. È così che la vede chi entra oggi, ed è
 * giusto che sia così. Ma un'area vuota non fa vedere com'è quando è piena, e
 * il brief ha bisogno di vederlo. Da qui l'interruttore "dati di esempio":
 * accende questo file, e mentre è acceso la pagina lo dichiara in ogni scheda.
 *
 * Due regole, per non scivolare nei dati finti:
 *
 * 1. I nomi arrivano da `content.ts`. Se un percorso cambia nome, l'esempio lo
 *    chiama subito nel modo giusto — e non esistono percorsi inventati.
 * 2. Nessun link fasullo. Le call di esempio non hanno un indirizzo di
 *    videochiamata, perché non esiste: al suo posto la pagina dice la verità,
 *    che il link arriva prima dell'incontro.
 *
 * Le date si calcolano rispetto a oggi: un esempio con le date del mese scorso
 * mostrerebbe un'agenda scaduta e non si capirebbe più niente.
 */

export const VUOTO: AccountData = { items: [], bookings: [], events: [] };

const due = (n: number) => String(n).padStart(2, "0");

/** Quanti giorni fa, in millisecondi: serve per "Riprendi da qui". */
const giorniFa = (n: number, oggi: Date) => oggi.getTime() - n * 86_400_000;

/** "fra tre giorni alle 18:00", scritto in ora locale come tutto il resto. */
function fra(giorni: number, ora: string, oggi: Date): string {
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + giorni);
  return `${d.getFullYear()}-${due(d.getMonth() + 1)}-${due(d.getDate())}T${ora}`;
}

export function datiDiEsempio(oggi = new Date()): AccountData {
  const riallineamento = levels.items[1].name;
  const libro = library.books[0];
  const audio = resources.items[2];

  return {
    items: [
      {
        id: "es-riallineamento",
        kind: "percorso",
        name: riallineamento,
        line: levels.items[1].claim,
        to: routes.percorsi,
        progress: 35,
        resume: "Modulo 3 · Confini gentili",
        lastOpenedAt: giorniFa(1, oggi),
        cover: {
          type: "image",
          src: "/images/coaching-square.webp",
          alt: "Martina durante una sessione di coaching, in una stanza luminosa",
        },
      },
      {
        id: "es-reset",
        kind: "percorso",
        name: milaReset.title,
        line: "Workbook, audio ed esercizi da fare al tuo ritmo.",
        to: routes.percorsi,
        progress: 100,
        lastOpenedAt: giorniFa(24, oggi),
        cover: {
          type: "image",
          src: "/images/garden-circle.webp",
          alt: "Un giardino di pietra e rose, visto dall'alto",
        },
      },
      {
        id: "es-libro",
        kind: "libro",
        name: libro.title,
        line: libro.description,
        to: routes.libreria,
        cover: { type: "book", topic: libro.topic, tone: libro.tone },
      },
      {
        id: "es-workbook",
        kind: "workbook",
        name: `Workbook di ${milaReset.title}`,
        line: "Pagine da compilare, non da leggere: sono le domande a fare il lavoro.",
        progress: 60,
        resume: "Pagina 14 · Cosa lascio andare",
        lastOpenedAt: giorniFa(6, oggi),
        cover: { type: "book", topic: "Workbook", tone: 3 },
      },
      {
        id: "es-registrazione",
        kind: "registrazione",
        name: "Live di gruppo · Confini gentili",
        line: "La registrazione dell'incontro, da riguardare quando vuoi.",
        cover: {
          type: "image",
          src: "/images/community-circle-crop.webp",
          alt: "Donne sedute in cerchio in un giardino",
        },
      },
      {
        id: "es-bonus",
        kind: "bonus",
        name: audio.title,
        line: audio.description,
        cover: { type: "book", topic: "Audio · 8 minuti", tone: 1 },
      },
    ],

    bookings: [
      {
        id: "es-call-martina",
        who: "Martina Mila Montanelli",
        type: "Sessione individuale",
        title: "La tua sessione con Martina",
        start: fra(3, "18:00", oggi),
        minutes: 45,
        place: "In videocall",
      },
      {
        id: "es-psicologa",
        who: "La psicologa dell'ecosistema",
        type: "Supporto psicologico",
        title: "Sessione con la psicologa",
        start: fra(9, "17:30", oggi),
        minutes: 50,
        place: "In videocall",
      },
    ],

    events: [
      {
        id: "es-live",
        kind: "live",
        title: "Live di gruppo · Confini gentili",
        who: "Con Martina",
        start: fra(5, "19:00", oggi),
        minutes: 60,
        includedIn: riallineamento,
      },
      {
        id: "es-incontro",
        kind: "incontro",
        title: "Incontro con la nutrizionista",
        who: "Con la nutrizionista dell'ecosistema",
        start: fra(12, "18:30", oggi),
        minutes: 60,
        includedIn: riallineamento,
      },
      {
        id: "es-cerchio",
        kind: "community",
        title: "Il cerchio della community",
        start: fra(19, "21:00", oggi),
        minutes: 75,
        includedIn: riallineamento,
      },
      {
        id: "es-workshop",
        kind: "workshop",
        title: "Workshop · Tornare ad abitarsi",
        who: "Con le professioniste del benessere",
        start: fra(26, "18:00", oggi),
        minutes: 90,
        includedIn: riallineamento,
      },
    ],
  };
}
