import { custom, levels, library, milaReset, roads, routes, salotto } from "@/data/content";
import type { Area } from "@/data/content";
import type { NeedId } from "./needs";

/**
 * Tutto quello che Millina può proporre.
 *
 * I nomi e gli indirizzi arrivano da `content.ts` invece di essere riscritti:
 * se un percorso cambia nome, Millina lo chiama già nel modo giusto. Un
 * catalogo copiato a mano diverge dal sito nel giro di poche settimane, e
 * un'assistente che consiglia un corso col nome sbagliato è peggio di nessuna
 * assistente.
 */

/**
 * Quanto chiede, non quanto costa: è la scala su cui Millina misura se una
 * proposta è proporzionata a quello che le è stato detto.
 *
 * 0 — gratuito e senza impegno
 * 1 — piccolo passo, si fa da sole
 * 2 — un percorso vero, prevalentemente autonomo
 * 3 — percorso seguito, con le professioniste
 * 4 — il massimo impegno, o su misura
 */
export type Commitment = 0 | 1 | 2 | 3 | 4;

export type Offer = {
  id: string;
  kind: "risorsa" | "quiz" | "libro" | "community" | "percorso" | "call" | "business";
  name: string;
  /** Una riga sola: è quella che Millina pronuncia. */
  line: string;
  to: string;
  commitment: Commitment;
  areas: Area["slug"][];
  /** I bisogni che serve bene. Il motore pesa questa corrispondenza. */
  serves: NeedId[];
};

export const CATALOG: Offer[] = [
  {
    id: "call",
    kind: "call",
    name: "La call iniziale",
    line: "Quarantacinque minuti in videochiamata, gratuiti, per capire insieme dove sei.",
    to: routes.call,
    commitment: 0,
    areas: ["mindset", "benessere", "indipendenza"],
    serves: ["direzione", "ascolto", "stabilita", "distacco"],
  },
  {
    id: "risorse",
    kind: "risorsa",
    name: "Le risorse gratuite",
    line: "Mini guide, audio e meditazioni: si scaricano e basta, nessun impegno.",
    to: routes.risorse,
    commitment: 0,
    areas: ["mindset", "benessere", "indipendenza"],
    serves: ["direzione", "ordine", "stabilita", "energia"],
  },
  {
    id: "quiz",
    kind: "quiz",
    name: "La Ruota della Vita",
    line: "Dieci aree da valutare da 1 a 10: in cinque minuti si vede da dove conviene partire.",
    to: routes.dashboard,
    commitment: 0,
    areas: ["mindset", "benessere", "indipendenza"],
    serves: ["direzione", "ordine"],
  },
  {
    id: "salotto",
    kind: "community",
    name: salotto.title.join(" ").replace(".", ""),
    line: "Una stanza sola, dove non devi fingere di stare bene. Dai 17 ai 62 anni.",
    to: routes.community,
    commitment: 1,
    areas: ["mindset"],
    serves: ["solitudine", "ascolto", "giudizio", "stabilita"],
  },
  {
    id: "mila-reset",
    kind: "percorso",
    name: milaReset.title,
    line: "Workbook, audio ed esercizi da fare al tuo ritmo, senza call.",
    to: routes.percorsi,
    commitment: 1,
    areas: ["mindset", "benessere", "indipendenza"],
    serves: ["direzione", "ordine", "schemi", "scegliersi"],
  },
  {
    id: "risveglio",
    kind: "percorso",
    name: levels.items[0].name,
    line: levels.items[0].claim,
    to: routes.percorsi,
    commitment: 2,
    areas: ["mindset"],
    serves: ["schemi", "scegliersi", "giudizio", "ordine", "distacco"],
  },
  {
    id: "riallineamento",
    kind: "percorso",
    name: levels.items[1].name,
    line: levels.items[1].claim,
    to: routes.percorsi,
    commitment: 3,
    areas: ["mindset", "benessere"],
    serves: ["corpo", "energia", "stabilita", "ascolto"],
  },
  {
    id: "ascesa",
    kind: "percorso",
    name: levels.items[2].name,
    line: levels.items[2].claim,
    to: routes.percorsi,
    commitment: 4,
    areas: ["mindset", "benessere", "indipendenza"],
    serves: ["indipendenza", "lavoro", "competenze"],
  },
  {
    id: "custom",
    kind: "percorso",
    name: custom.title.join(" ").replace(".", ""),
    line: "Prezzo, incontri e struttura decisi caso per caso, sulle tue esigenze.",
    to: routes.percorsi,
    commitment: 4,
    areas: ["mindset", "benessere", "indipendenza"],
    serves: ["ascolto", "direzione"],
  },
  {
    id: "academy",
    kind: "business",
    name: "Triskell Academy",
    line: "Marketing, AI e strumenti digitali: impari a costruirtelo da sola.",
    to: routes.business,
    commitment: 2,
    areas: ["indipendenza"],
    serves: ["competenze", "lavoro", "indipendenza"],
  },
  {
    id: "agency",
    kind: "business",
    name: "Triskell Agency",
    line: "Se un'attività ce l'hai già, il sistema per portarle clienti lo costruiamo noi.",
    to: routes.business,
    commitment: 3,
    areas: ["indipendenza"],
    serves: ["clienti"],
  },
  ...library.books.map<Offer>((book, i) => ({
    id: `libro-${i}`,
    kind: "libro",
    name: book.title,
    line: book.description,
    to: routes.libreria,
    commitment: 1,
    areas:
      book.topic === "Corpo e benessere"
        ? ["benessere"]
        : book.topic === "Indipendenza economica"
          ? ["indipendenza"]
          : ["mindset"],
    serves:
      book.topic === "Corpo e benessere"
        ? ["corpo", "energia"]
        : book.topic === "Indipendenza economica"
          ? ["indipendenza", "lavoro"]
          : book.topic === "Memoir"
            ? ["solitudine", "stabilita"]
            : ["scegliersi", "schemi", "giudizio"],
  })),
];

export const byId = (id: string) => CATALOG.find((o) => o.id === id);

/** Le due strade dei Percorsi, per quando Millina deve spiegare la struttura. */
export const ROADS = roads.items.map((r) => ({ kicker: r.kicker, title: r.title }));
