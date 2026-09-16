/**
 * La tassonomia dei bisogni di Millina.
 *
 * Non è inventata: è ricavata dalle 23 frasi di "Forse Mila è per te se…", che
 * sono già l'elenco dei bisogni scritto da Mila con le sue parole. Ogni bisogno
 * porta con sé il lessico con cui una persona lo esprime davvero — compresi i
 * modi storti, le forme colloquiali e le parole che userebbe scrivendo di notte
 * invece che compilando un modulo.
 *
 * `area` collega il bisogno alle tre dimensioni dell'ecosistema, così la
 * raccomandazione resta coerente con la struttura del sito invece di essere una
 * tabella parallela che prima o poi divergerà.
 */

import type { Area } from "@/data/content";

export type NeedId =
  | "distacco"
  | "stabilita"
  | "ordine"
  | "schemi"
  | "scegliersi"
  | "giudizio"
  | "corpo"
  | "energia"
  | "solitudine"
  | "ascolto"
  | "indipendenza"
  | "lavoro"
  | "competenze"
  | "clienti"
  | "direzione";

export type Need = {
  id: NeedId;
  /** Come Millina lo rimanda indietro: è la "comprensione" del brief. */
  echo: string;
  area: Area["slug"];
  /** Termini che segnalano il bisogno. Il confronto è per prefisso, quindi
   *  "autostim" copre autostima, autostimarsi, ecc. */
  lexicon: string[];
  /**
   * Bisogni pratici: dichiararli è già un segnale di prontezza. Chi scrive
   * "non arrivano clienti" sta esponendo un problema con una soluzione
   * attesa; chi scrive "sto male" no. Senza questa distinzione il tetto di
   * impegno tratterebbe una richiesta commerciale come uno sfogo.
   */
  practical?: boolean;
  /**
   * Bisogno "meta": non dice di cosa ha bisogno ma che vuole essere guidata.
   * Non deve competere con un bisogno concreto — chi scrive "voglio
   * l'indipendenza economica ma non so da dove partire" non sta esprimendo
   * due desideri in conflitto, ne sta esprimendo uno e chiedendo aiuto.
   */
  meta?: boolean;
};

export const NEEDS: Need[] = [
  {
    id: "distacco",
    echo: "staccarti da una persona che occupa ancora troppo spazio",
    area: "mindset",
    lexicon: [
      "ex ", "il mio ex", "lasciata", "lasciato", "relazione tossica", "tossic", "dipendenza affettiva",
      "non riesco a dimenticar", "penso sempre a lui", "penso ancora a", "staccarmi", "distaccarmi",
      "lutto", "separazione", "separata", "divorzi", "tradimento", "tradita", "rincorrere",
      "mi ha lasciat", "manipolat", "narcisist",
    ],
  },
  {
    id: "stabilita",
    echo: "ritrovare un po' di stabilità dopo un periodo difficile",
    area: "mindset",
    lexicon: [
      "ansia", "ansios", "attacchi di panico", "panico", "depress", "sto male", "sto malissimo",
      "persa", "smarrit", "confus", "svuotat", "vuoto", "non sto bene", "periodo difficile",
      "momento difficile", "crisi", "fragil", "piango", "non dormo", "stress",
    ],
  },
  {
    id: "ordine",
    echo: "rimettere ordine nei pensieri, nelle abitudini e nelle priorità",
    area: "mindset",
    lexicon: [
      "ordine", "caos", "casino", "disordin", "organizzar", "priorit", "abitudin", "routine",
      "procrastin", "incasinat", "troppe cose", "non ho tempo", "disciplina", "costanza",
    ],
  },
  {
    id: "schemi",
    echo: "riconoscere gli schemi che si ripetono e ti bloccano",
    area: "mindset",
    lexicon: [
      "autosabot", "sabot", "sempre gli stessi errori", "schemi", "meccanism", "blocc", "mi blocco",
      "ricado", "sempre la stessa", "loop", "circolo vizioso", "paura di fallire", "sindrome dell",
    ],
  },
  {
    id: "scegliersi",
    echo: "imparare a scegliere te stessa senza sentirti in colpa",
    area: "mindset",
    lexicon: [
      "senso di colpa", "in colpa", "penso sempre agli altri", "metto sempre", "dire di no",
      "confini", "limiti", "accontentare", "gente pleaser", "people pleaser", "scegliere me",
      "priorità a me", "egoista",
    ],
  },
  {
    id: "giudizio",
    echo: "liberarti dal peso del giudizio degli altri",
    area: "mindset",
    lexicon: [
      "giudizio", "giudicat", "cosa pensano", "vergogn", "imbarazz", "paura di essere giudic",
      "autostima", "autostim", "insicur", "non mi sento all'altezza", "non valgo", "sicurezza in me",
    ],
  },
  {
    id: "corpo",
    echo: "un rapporto più sereno con il tuo corpo",
    area: "benessere",
    lexicon: [
      "corpo", "peso", "dimagr", "ingrass", "specchio", "mi vedo", "odio il mio", "alimentazion",
      "cibo", "mangi", "dieta", "abbuffat", "disturbi alimentari", "pancia", "fisico",
      "accettarmi", "brutta",
    ],
  },
  {
    id: "energia",
    echo: "tornare ad avere energia e muoverti con piacere",
    area: "benessere",
    lexicon: [
      "stanc", "spossat", "esaurit", "burnout", "non ho energie", "spenta", "dormire",
      "allenam", "palestra", "movimento", "sport", "sedentari", "mal di schiena", "postura",
      "ciclo", "menopaus", "ormon",
    ],
  },
  {
    id: "solitudine",
    echo: "non sentirti sola mentre stai cambiando",
    area: "mindset",
    lexicon: [
      "sola", "solitudin", "nessuno mi capisce", "non ho nessuno", "isolat", "amiche",
      "conoscere altre donne", "community", "gruppo", "confront", "condivider",
    ],
  },
  {
    id: "ascolto",
    echo: "parlare con qualcuno che ti ascolti davvero",
    area: "mindset",
    lexicon: [
      "parlare con qualcun", "sfogar", "ascolt", "psicolog", "terapi", "aiuto", "supporto",
      "non so a chi", "consiglio", "qualcuno che mi capisca",
    ],
  },
  {
    id: "indipendenza",
    echo: "costruire la tua indipendenza economica",
    area: "indipendenza",
    practical: true,
    lexicon: [
      "indipendenza economica", "indipendent", "soldi", "denaro", "economicamente", "mantener",
      "dipendo da", "stipendio", "non ho un reddito", "casalinga", "libertà economica", "finanz",
    ],
  },
  {
    id: "lavoro",
    echo: "capire che direzione dare al tuo lavoro",
    area: "indipendenza",
    practical: true,
    lexicon: [
      "lavoro", "licenziat", "disoccupat", "cambiare lavoro", "odio il mio lavoro", "carriera",
      "capo", "ufficio", "mi annoio", "non mi realizzo", "vocazione", "cosa voglio fare",
    ],
  },
  {
    id: "competenze",
    echo: "imparare competenze nuove da usare per te",
    area: "indipendenza",
    practical: true,
    lexicon: [
      "imparare", "studiar", "corso", "corsi", "formazion", "competenz", "marketing",
      "intelligenza artificiale", " ai ", "social", "instagram", "contenut", "funnel",
      "automazion", "digitale", "skill",
    ],
  },
  {
    id: "clienti",
    echo: "portare più clienti a quello che hai già costruito",
    area: "indipendenza",
    practical: true,
    lexicon: [
      "clienti", "vendere", "vendit", "fatturat", "partita iva", "la mia attivit",
      "il mio business", "il mio brand", "personal brand", "negozio", "studio", "agenzia",
      "advertising", "pubblicit", "non arrivano", "acquisizione",
    ],
  },
  {
    id: "direzione",
    echo: "capire da dove cominciare",
    area: "mindset",
    meta: true,
    lexicon: [
      "non so da dove", "da dove comincio", "da dove inizio", "non so cosa", "che percorso",
      "quale percorso", "consigli", "mi aiuti a capire", "sono nuova", "primo passo", "aiutami a scegliere",
    ],
  },
];

/**
 * Quanto la persona è pronta a impegnarsi. Non si deduce dal bisogno ma dal
 * modo in cui lo racconta, ed è ciò che impedisce a Millina di rispondere
 * "compra il percorso più completo" a chi ha solo detto che sta male.
 */
export type Readiness = "esplora" | "pronta" | "accompagnata";

export const READINESS_CUES: Record<Exclude<Readiness, "esplora">, string[]> = {
  pronta: [
    "voglio iniziare", "voglio cominciare", "sono pronta", "vorrei iniziare", "mi voglio iscrivere",
    "come faccio a iniziare", "voglio cambiare", "decisa", "basta così", "quest'anno",
  ],
  accompagnata: [
    "ho già provato", "ho provato di tutto", "da anni", "da sempre", "non ce la faccio più",
    "non so più", "ho bisogno di aiuto", "ho bisogno di qualcuno", "seguita", "affiancata",
    "una persona che mi segua", "da sola non ci riesco",
  ],
};

/**
 * Segnali di prudenza economica: spostano la proposta verso ciò che è gratuito.
 *
 * Volutamente stretti. "economic" era qui e faceva scattare il freno su
 * "indipendenza economica", cioè sull'esatto contrario: una donna che dichiara
 * di voler costruire la propria indipendenza economica non sta chiedendo
 * quanto costa.
 */
export const BUDGET_CUES = [
  "non posso permetter", "non me lo posso permettere", "non ho soldi", "quanto costa",
  "quanto viene", "che prezzo", "prezzi", "troppo caro", "costoso", "gratis", "gratuit",
  "budget", "quanto si spende",
];
