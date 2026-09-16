/**
 * La forma dei dati dell'area personale (punti 26-31 del brief).
 *
 * Questo file è il contratto fra l'interfaccia e i dati: le sezioni della
 * dashboard non sanno da dove arrivino: oggi da `store.ts` (vuoto, oppure i
 * dati di esempio); domani da un account vero. Finché queste forme restano
 * queste, il giorno in cui arriva il server cambia un file solo.
 */

/** Le categorie che il punto 27 elenca, nell'ordine in cui le elenca. */
export type OwnedKind =
  | "corso"
  | "percorso"
  | "libro"
  | "ebook"
  | "workbook"
  | "registrazione"
  | "materiale"
  | "bonus";

/**
 * La copertina di un elemento acquistato.
 *
 * Due sole varianti: una foto vera, oppure la copertina tipografica della
 * libreria (punto 18), che si disegna con i font del progetto e non ha bisogno
 * di artwork. Nessuna terza via con immagini generiche di repertorio: meglio
 * una copertina composta che una foto che non c'entra niente.
 */
export type Cover =
  | { type: "image"; src: string; alt: string }
  | { type: "book"; topic: string; tone: 0 | 1 | 2 | 3 };

export type OwnedItem = {
  id: string;
  kind: OwnedKind;
  name: string;
  /** Una riga: è la "breve descrizione" del punto 27. */
  line: string;
  /** Dove si apre. Assente = il contenuto esiste ma la sua pagina non ancora. */
  to?: string;
  /** 0-100. Assente quando l'avanzamento non ha senso (un ebook non ha una percentuale). */
  progress?: number;
  /** Il punto esatto in cui si riprende, accanto a "Continua". */
  resume?: string;
  /**
   * Quando è stato aperto l'ultima volta (ms dall'epoca).
   *
   * È questo, e non la percentuale più alta, a decidere cosa finisce in
   * "Riprendi da qui": chi torna vuole ritrovare l'ultima cosa che stava
   * facendo, non quella più vicina alla fine.
   */
  lastOpenedAt?: number;
  cover: Cover;
};

/** Un appuntamento prenotato: la prima metà della bacheca (punto 28). */
export type Booking = {
  id: string;
  /** Con chi: "Martina Mila Montanelli", "Chiara, nutrizionista"… */
  who: string;
  /** Che tipo di appuntamento è: "Call iniziale", "Sessione 1:1"… */
  type: string;
  title: string;
  /** Data e ora locali, formato "2026-09-22T18:00". Mai UTC: l'ora è quella di chi legge. */
  start: string;
  minutes: number;
  /** Il link della call. Assente = non è ancora stato mandato. */
  link?: string;
  place: string;
};

/** Un evento collettivo incluso nel percorso (punto 29). */
export type CollectiveEvent = {
  id: string;
  kind: "live" | "workshop" | "incontro" | "community";
  title: string;
  /** Chi la conduce. */
  who?: string;
  start: string;
  minutes: number;
  link?: string;
  /** Il percorso che lo comprende: è il motivo per cui compare qui. */
  includedIn: string;
};

/** Quello che l'area personale sa di chi la sta guardando. */
export type Account = {
  /** Il nome per il saluto. Vuoto finché non lo si scrive. */
  name: string;
  /** Il codice referral del punto 26. */
  referral: string;
  /** Il codice con cui è entrata, se è arrivata da un invito. */
  invitedBy: string | null;
  /** Dati di esempio accesi: l'area mostra com'è da piena invece che da vuota. */
  demo: boolean;
};

/** Il contenuto dell'area: vuoto per davvero, o l'esempio dichiarato. */
export type AccountData = {
  items: OwnedItem[];
  bookings: Booking[];
  events: CollectiveEvent[];
};
