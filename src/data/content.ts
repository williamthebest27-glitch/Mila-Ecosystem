/**
 * All copy on the homepage lives here. Every string was taken from the
 * current Mila Ecosystem homepage; nothing factual was altered.
 */

export const routes = {
  home: "/",
  ecosistema: "/#ecosistema",
  percorsi: "/percorsi",
  call: "/percorsi#call-iniziale",
  community: "/community",
  chiSono: "/chi-sono",
  blog: "/blog",
  risorse: "/risorse",
  dashboard: "/dashboard",
  login: "/login",
  quiz: "/quiz",
  lettera: "/blog/lettera-a-mia-nonna",
  libreria: "/libreria",
  viaggi: "/viaggi",
  business: "/business",
  bacheca: "/bacheca",
  eventi: "/eventi",
  collaborazioni: "/collaborazioni",
  feedback: "/feedback",
} as const;

/**
 * Navigazione del punto 6 del brief. I nomi del menu principale sono quelli
 * richiesti, alla lettera. "Esplora" raccoglie la seconda area; Accedi e la
 * CTA chiudono.
 */
export const nav = {
  primary: [
    { label: "Home", to: routes.home },
    { label: "Ecosistema", to: routes.ecosistema },
    { label: "Percorsi", to: routes.percorsi },
    { label: "Community", to: routes.community },
    { label: "Chi sono", to: routes.chiSono },
  ],
  explore: {
    label: "Esplora",
    items: [
      { label: "Blog", to: routes.blog },
      { label: "Risorse gratuite", to: routes.risorse },
      { label: "Area personale", to: routes.dashboard },
    ],
  },
  login: { label: "Accedi", to: routes.login },
  cta: { label: "Prenota la call", to: routes.call },
};

export const hero = {
  label: "Mila Ecosystem · Empowerment femminile",
  lines: ["Ritrova la tua forza.", "Costruisci la tua indipendenza.", "Torna a scegliere te stessa."],
  lede:
    "Un ecosistema digitale di percorsi, strumenti e community per donne che vogliono vivere con più autenticità, profondità e direzione.",
  ledeSecondary:
    "Uno spazio pensato per accompagnarti passo dopo passo a ritrovare il tuo centro e costruire una vita più vicina a ciò che senti davvero tuo.",
  primary: { label: "Scopri i percorsi", to: routes.percorsi },
  secondary: { label: "Prenota la call iniziale", to: routes.call },
  imageAlt: "Donne e bambine di tutte le età e culture, unite in un cerchio di comunità",
  photoAlt: "Dieci donne e bambine di età, etnie e culture diverse, vicine in un giardino di pietra: si guardano fra loro e ridono insieme",
  script: ["Più consapevoli", "Più libere", "Più noi"],
  video: { label: ["Scopri Mila", "in 1 minuto"], to: "/chi-sono" },
  features: [
    { icon: "users", text: ["Una community", "che ti sostiene"] },
    { icon: "sprout", text: ["Percorsi di crescita", "reali e concreti"] },
    { icon: "sparkles", text: ["Strumenti per la tua", "indipendenza"] },
  ],
  proof: {
    avatars: ["/images/avatar-1.webp", "/images/avatar-2.webp", "/images/avatar-3.webp", "/images/avatar-4.webp"],
    text: "Migliaia di donne stanno già costruendo la loro nuova vita con Mila",
  },
  scroll: ["Scroll", "per scoprire"],
  tagline: ["Un futuro più autentico", "è possibile"],
};

export const manifesto = {
  label: "Cos'è Mila Ecosystem",
  headline: "Un ecosistema per migliorarti a 360°.",
  statement:
    "Mila Ecosystem è uno spazio digitale che cresce nel tempo, costruito attorno alle aree su cui ogni donna dovrebbe poter lavorare: mente, corpo e indipendenza economica.",
  highlights: ["mente", "corpo", "indipendenza", "economica"],
  footnote: "Per ogni area trovi risorse gratuite, percorsi in autonomia e percorsi personalizzati.",
};

export type Figure = {
  name: string;
  role: string;
  points: string[];
};

export type Area = {
  index: string;
  slug: string;
  title: string;
  /** Etichetta breve, per i contesti stretti (schede dei livelli). */
  short: string;
  tagline: string;
  /** Le dimensioni su cui l'area lavora, dal punto 9 del brief. */
  themes: string[];
  description: string;
  image: string;
  imageAlt: string;
  figures: Figure[];
};

export const areas: Area[] = [
  {
    index: "01",
    slug: "mindset",
    title: "Mindset e crescita personale",
    short: "Mindset",
    tagline: "La base di tutto.",
    themes: ["Autostima", "Consapevolezza", "Relazioni", "Femminilità", "Evoluzione personale"],
    description: "Il punto da cui parte ogni cambiamento. Qui ti accompagno io, Mila, come mentore e coach.",
    image: "/images/coaching.webp",
    imageAlt: "Una giovane donna dai capelli afro e una donna dai capelli grigi, sedute una di fronte all'altra in conversazione, in una stanza luminosa con piante e una candela accesa",
    figures: [
      {
        name: "Percorso con Mila",
        role: "Mentore & coach di crescita personale",
        points: [
          "Sessioni 1:1 di coaching personalizzato",
          "Percorsi di gruppo a tema (fiducia, confini, direzione)",
          "Diario guidato, meditazioni e pratiche quotidiane",
          "Strumenti per gestire ansia, autosabotaggio, scelte difficili",
        ],
      },
    ],
  },
  {
    index: "02",
    slug: "benessere",
    title: "Benessere e salute",
    short: "Benessere",
    tagline: "Tornare ad abitarsi.",
    themes: ["Benessere mentale e fisico", "Nutrizione", "Forma fisica", "Equilibrio", "Energia"],
    description:
      "Riconnetterti al tuo corpo con specialiste selezionate. Niente performance, niente forzature: figure dedicate che lavorano in sinergia.",
    image: "/images/garden-circle.webp",
    imageAlt: "Cerchio di donne e bambine di culture diverse in un giardino fiorito",
    figures: [
      {
        name: "Fitness coach & Personal trainer",
        role: "Specialista del movimento al femminile",
        points: [
          "Allenamento personalizzato per livello e obiettivi",
          "Programmi calibrati sulle fasi del ciclo",
          "Mobilità, postura e ritorno al movimento dopo pause lunghe",
          "Allenamenti in autonomia o seguita 1:1",
        ],
      },
      {
        name: "Nutrizionista",
        role: "Esperta di alimentazione femminile",
        points: [
          "Piani alimentari su misura, senza diete punitive",
          "Rapporto sereno con il cibo e con il corpo",
          "Nutrizione per ciclo, gravidanza e menopausa",
          "Educazione alimentare e abitudini sostenibili",
        ],
      },
      {
        name: "Psicologa",
        role: "Sostegno emotivo e mentale",
        points: [
          "Spazio sicuro per ascoltarti davvero",
          "Lavoro su ansia, autostima e relazioni",
          "Percorsi brevi mirati o supporto continuativo",
          "Sguardo clinico, mai giudicante",
        ],
      },
    ],
  },
  {
    index: "03",
    slug: "indipendenza",
    title: "Business e indipendenza economica",
    short: "Business",
    tagline: "La tua libertà concreta.",
    themes: ["Marketing", "AI", "Competenze digitali", "Lavoro", "Business", "Autonomia economica"],
    description:
      "Tre strade distinte, in base al punto in cui ti trovi: prima capire dove vai, poi imparare a fare da te o farti affiancare dal mio team.",
    image: "/images/community-circle-crop.webp",
    imageAlt: "Donne di età diverse che si sorridono in un giardino di pietra e rose",
    figures: [
      {
        name: "Coaching business con Mila",
        role: "Per capire come muoverti",
        points: [
          "Trovare la tua direzione professionale",
          "Validare un'idea o riposizionarti",
          "Mindset imprenditoriale e gestione delle paure",
          "Strategia personalizzata sul tuo punto di partenza",
        ],
      },
      {
        name: "Triskell Academy",
        role: "Impari a fare da te",
        points: [
          "Corsi di marketing digitale step-by-step",
          "Intelligenza artificiale applicata al business",
          "Personal branding e contenuti che convertono",
          "Community di studentesse e supporto continuo",
        ],
      },
      {
        name: "Triskell Agency",
        role: "Lo facciamo noi per te",
        points: [
          "Strategia marketing & gestione contenuti",
          "Lancio prodotti, funnel e advertising",
          "Identità di marca e siti web",
          "Deleghi e ti concentri sulla tua zona di genio",
        ],
      },
    ],
  },
];

export const ecosystem = {
  label: "L'ecosistema",
  word: "Ecosistema",
  intro: "Tre aree. Sette figure. Un unico spazio che cresce con te.",
  levels: ["Risorse gratuite", "Percorsi in autonomia", "Percorsi personalizzati"],
  expansion:
    "È un ecosistema che si espanderà nel tempo: nuove aree, strumenti e persone si aggiungeranno per accompagnarti in qualunque fase.",
  primary: { label: "Esplora i percorsi", to: routes.percorsi },
  secondary: { label: "Risorse gratuite", to: routes.risorse },
  /** La scena del punto 10: la figura al centro, avvolta dalla luce. */
  stage: {
    imageAlt:
      "Una giovane donna in tunica di lino verde salvia monospalla, in piedi al centro dell'ecosistema",
    hint: "Scorri: la luce la avvolge e l'ecosistema si apre",
  },
};

export type FutureArea = {
  title: string;
  description: string;
  /** Assente = area non ancora aperta: si intravede ma non si clicca. */
  to?: string;
};

/**
 * Punto 8 del brief: far percepire subito che l'ecosistema è più ampio di
 * ciò che è già operativo. Le aree con `to` sono aperte; quelle senza
 * appaiono sfocate, semitrasparenti e non cliccabili, con la dicitura
 * COMING SOON.
 *
 * Per aprire un'area basta aggiungerle un `to`; per richiuderla, toglierlo.
 */
export const future = {
  label: "Quello che stiamo costruendo",
  title: ["Mila Ecosystem", "non finisce qui."],
  lede:
    "Alcune aree sono già aperte, altre stanno nascendo. Le lascio intravedere perché tu sappia dove stiamo andando.",
  soonLabel: "Coming soon",
  areas: [
    { title: "Percorsi", description: "Due strade, una direzione: in autonomia oppure accompagnata da me.", to: routes.percorsi },
    { title: "Il salotto di Mila", description: "La community: un posto caldo dove non devi fingere di stare sempre bene.", to: routes.community },
    { title: "Risorse gratuite", description: "Mini guide, audio, meditazioni e quiz per cominciare senza impegno.", to: routes.risorse },
    { title: "Blog", description: "Pensieri lunghi, lettere e storie che non stanno in un post.", to: routes.blog },
    { title: "Libreria", description: "I miei libri, uno dopo l'altro: da leggere, scaricare, tenere.", to: routes.libreria },
    { title: "Area personale", description: "Il tuo spazio: percorsi acquistati, diario, prenotazioni, bacheca.", to: routes.dashboard },
    { title: "Millina", description: "La mia piccola assistente digitale: ti orienta, ti suggerisce il passo dopo." },
    { title: "Business", description: "Triskell Academy e Agency: imparare le competenze o delegare a noi." },
    { title: "Viaggi", description: "L'ecosistema che esce dallo schermo e diventa un posto dove ritrovarsi." },
    { title: "Eventi", description: "Live, workshop e incontri con le professioniste dell'ecosistema." },
  ] satisfies FutureArea[],
};

export type Road = {
  kicker: string;
  title: string;
  description: string;
  points: string[];
  note: string;
};

/**
 * Punto 11 del brief: la biforcazione dei percorsi. Due strade che partono da
 * punti diversi e portano allo stesso posto — in autonomia oppure accompagnata.
 *
 * Qui si nominano soltanto: il dettaglio di Mila Reset e dei tre livelli
 * appartiene ai punti 12 e 13, e alla pagina Percorsi.
 */
export const roads = {
  label: "Percorsi",
  title: ["Due strade,", "una direzione."],
  lede: "Scegli da dove partire: in autonomia oppure accompagnata da me.",
  items: [
    {
      kicker: "Da sola, al tuo ritmo",
      title: "Mila Reset",
      description:
        "Il punto d'ingresso più semplice: cominci a lavorare su di te in autonomia, senza call.",
      points: ["Workbook ed esercizi", "Audio e mini guide", "La Ruota della Vita", "Mini corsi ed ebook"],
      note: "Non sai ancora quale percorso faccia per te? Parti da qui.",
    },
    {
      kicker: "Accompagnata da me",
      title: "Percorsi strutturati",
      description:
        "Tre livelli di profondità, dal primo risveglio alla trasformazione più completa.",
      points: ["Risveglio", "Riallineamento", "Ascesa"],
      note: "Con me e con le professioniste dell'ecosistema al tuo fianco.",
    },
  ] satisfies Road[],
  meeting: "Qualunque strada scegli, la direzione è la stessa: tornare a scegliere te stessa.",
  cta: { label: "Esplora i percorsi", to: routes.percorsi },
  secondary: { label: "Non sai da dove partire? Prenota la call", to: routes.call },
};

/**
 * Punto 12 del brief: Mila Reset, la porta d'ingresso in autonomia.
 * I testi delle singole voci sono scritti a partire dall'elenco del brief e
 * vanno riletti da Mila: descrivono cosa sarà dentro, non cosa c'è oggi.
 */
export const milaReset = {
  kicker: "Da sola, al tuo ritmo",
  title: "Mila Reset",
  lede:
    "Il punto d'ingresso più semplice dell'ecosistema: pensato per chi vuole cominciare a lavorare su di sé in autonomia, senza call e senza impegni fissi.",
  pitch: "Non sai ancora quale percorso faccia per te? Parti da qui.",
  itemsLabel: "Cosa trovi dentro",
  items: [
    { title: "Workbook", text: "Pagine da compilare, non da leggere: sono le domande a fare il lavoro." },
    { title: "Audio", text: "Da ascoltare camminando, in cucina, prima di dormire." },
    { title: "La Ruota della Vita", text: "L'esercizio che mette a fuoco da quale area conviene partire." },
    { title: "Esercizi", text: "Pratiche brevi, da fare quando serve a te e non quando è previsto." },
    { title: "Mini guide", text: "Un tema alla volta, chiuso in poche pagine." },
    { title: "Mini corsi", text: "Lezioni corte, con un ordine e un punto d'arrivo." },
    { title: "Ebook", text: "Da leggere con calma, sul divano o in viaggio." },
    { title: "Attività autonome", text: "Tutto si fa quando vuoi tu, al ritmo che hai davvero." },
  ],
  access: {
    label: "La parte più accessibile",
    text:
      "Mila Reset è pensato per essere leggero: nell'impegno che chiede e nel prezzo. È il modo meno costoso di capire se l'ecosistema fa per te.",
  },
  cta: { label: "Scarica ora", to: routes.risorse },
  secondary: { label: "Non sai da dove partire? Prenota la call", to: routes.call },
};

export type Level = {
  index: string;
  name: string;
  claim: string;
  description: string;
  /** Slug delle aree coperte: è la progressione del punto 13 resa verificabile. */
  areas: Area["slug"][];
  includes: string[];
  company: string;
};

/**
 * Punto 13 del brief: i tre percorsi strutturati.
 *
 * Non sono tre opzioni parallele ma una salita, e il brief lo dice per Ascesa:
 * "persona + benessere + indipendenza professionale". I tre livelli mappano
 * quindi sulle tre aree del punto 9 — uno, due, tutte e tre — ed è questo che
 * rende leggibile a colpo d'occhio cosa cambia salendo.
 *
 * Nota sul tono: il brief dice che nel Riallineamento "la mia presenza diretta
 * deve essere relativamente limitata". È un'indicazione di business, non copy
 * da vendita: dire a chi compra quanto poco ci sarà Mila sarebbe autolesivo.
 * Qui è girata in positivo — si dice chi ti accompagna, non chi manca.
 */
export const levels = {
  label: "Accompagnata da me",
  title: ["Percorsi", "strutturati."],
  lede:
    "Tre livelli, in ordine di profondità. A ogni gradino si aggiunge un pezzo di vita su cui lavorare.",
  coverageLabel: "Su cosa si lavora",
  includesLabel: "Cosa comprende",
  items: [
    {
      index: "01",
      name: "Risveglio",
      claim: "Il momento in cui cominci a vederti meglio.",
      description:
        "Il primo livello: quello in cui capisci cosa vuoi cambiare. Si cammina soprattutto da sole, con i materiali a fare da guida.",
      areas: ["mindset"],
      includes: ["Un corso preregistrato", "Materiali e workbook", "Esercizi guidati", "Accesso alla community"],
      company: "In autonomia, con i materiali a farti da guida.",
    },
    {
      index: "02",
      name: "Riallineamento",
      claim: "Quando il lavoro si allarga al corpo.",
      description:
        "Il secondo livello diventa multidisciplinare: entrano le professioniste dell'ecosistema, ciascuna sul suo terreno.",
      areas: ["mindset", "benessere"],
      includes: ["Supporto delle esperte", "Un corso incluso", "Materiali e community", "Live periodiche"],
      company: "Con psicologa, nutrizionista e fitness coach al tuo fianco.",
    },
    {
      index: "03",
      name: "Ascesa",
      claim: "Persona, benessere e indipendenza, insieme.",
      description:
        "Il percorso più completo: alla crescita personale e al benessere si aggiunge l'area professionale ed economica, dove entra in gioco Triskell Ecosystem.",
      areas: ["mindset", "benessere", "indipendenza"],
      includes: ["Tutto il lavoro sulla persona", "Il percorso di benessere", "Triskell Academy e Agency", "L'ecosistema al completo"],
      company: "Con l'ecosistema al completo, Triskell compreso.",
    },
  ] satisfies Level[],
  triskell: { label: "Scopri Triskell Ecosystem", to: routes.business },
  note:
    "Nessun livello è un gradino obbligato: si entra da dove ha senso per te. Se non sai da dove, ne parliamo in call.",
  cta: { label: "Prenota la call", to: routes.call },
};

export const story = {
  label: "La storia che ci muove",
  title: ["La storia di mia nonna,", "a cui dedico tutto questo."],
  paragraphs: [
    "Mi chiamo Martina Mila Montanelli e Mila era il nome di mia nonna. In realtà si chiamava Mariangela: ma all'epoca, in chiesa, non poterono battezzarla con quel nome. Così la chiamarono Mila — e per tutta la vita si è girata solo sentendo questo nome, che sentiva più suo.",
    "Ha passato l'infanzia a prendersi cura di sua sorella più piccola, in una famiglia dignitosa ma severa. Ha studiato sempre, perché lo studio era la sua libertà — è da lei che ho ereditato questa passione.",
    "Negli anni '60, in un paesino di montagna, ha lasciato un primo matrimonio rovinoso e si è cresciuta una figlia da sola. Senza patente, senza rete, facendo la maestra. La ricordano ancora con tanto amore.",
    "Ha dedicato la vita agli altri. E nonostante tutto, è morta triste — di una depressione silenziosa che nessuno è riuscito davvero a tenere.",
  ],
  closing: "Mila Ecosystem nasce per onorarla. E per dire a ogni donna:",
  pull: "non combattere da sola guerre che non sono tue. Cura te stessa adesso, non aspettare che sia troppo tardi.",
  cta: { label: "Leggi la lettera completa", to: routes.lettera },
  image: "/images/founder-story.webp",
  imageAlt: "Le mani di una nonna che tiene la mano di una bambina, in toni verdi",
};

export const forYou = {
  label: "Per chi è Mila",
  title: "Forse Mila è per te se…",
  lede: "Ti riconosci anche solo in una di queste frasi? Allora siamo nel posto giusto.",
  primary: { label: "Scopri se fa per te", to: routes.quiz },
  secondary: { label: "Prenota una call", to: routes.call },
  phrases: [
    "Vuoi staccarti emotivamente da una persona che continua a occupare troppo spazio dentro di te.",
    "Vuoi ritrovare stabilità emotiva dopo un periodo in cui ti sei sentita persa, confusa o svuotata.",
    "Vuoi costruire la tua indipendenza economica e sentirti finalmente più libera nelle tue scelte.",
    "Vuoi rimettere ordine nella tua vita, nei tuoi pensieri, nelle tue abitudini e nelle tue priorità.",
    "Vuoi semplicemente parlare con qualcuno che ti ascolti davvero, senza giudicarti.",
    "Vuoi confrontarti con altre donne che stanno vivendo un percorso simile al tuo.",
    "Vuoi sentirti parte di una community in cui non devi fingere di stare sempre bene.",
    "Vuoi iniziare un percorso personalizzato che tenga conto di chi sei, non solo di ciò che vuoi ottenere.",
    "Vuoi migliorare il rapporto con il tuo corpo e smettere di guardarti sempre con occhi critici.",
    "Vuoi sentirti più sicura, più centrata e più in contatto con la tua energia femminile.",
    "Vuoi riconoscere quei meccanismi mentali che ti bloccano, ti autosabotano o ti fanno ripetere sempre gli stessi schemi.",
    "Vuoi imparare a scegliere te stessa senza sentirti in colpa.",
    "Vuoi smettere di rincorrere persone, conferme o situazioni che non ti nutrono più.",
    "Vuoi tornare a fidarti della tua intuizione e della tua voce interiore.",
    "Vuoi creare una vita più allineata ai tuoi desideri, ai tuoi valori e al tuo modo di essere.",
    "Vuoi lasciar andare il bisogno di controllare tutto e imparare a sentirti più stabile dentro.",
    "Vuoi liberarti dal peso del giudizio degli altri e iniziare a vivere con più autenticità.",
    "Vuoi trasformare un momento difficile in un'occasione per conoscerti meglio.",
    "Vuoi sentirti accompagnata in un percorso di crescita personale, emotiva e femminile.",
    "Vuoi smettere di sentirti sola mentre provi a cambiare la tua vita.",
    "Vuoi ritrovare la tua forza, ma senza indurirti.",
    "Vuoi imparare ad amarti senza dover diventare qualcun'altra.",
    "Vuoi tornare a sentirti donna, libera, presente e padrona della tua vita.",
  ],
};

export const community = {
  label: "Community",
  title: "Tu non sei sola.",
  lede:
    "Donne di ogni età e provenienza che si parlano, si ascoltano e si scelgono. Senza vetrine, senza giudizio: solo presenza, ascolto e parole vere — per camminare accanto, una accanto all'altra.",
  footnote: "Donne dai 17 ai 62 anni. Storie diverse: relazioni, maternità, business, rinascite. Ognuna con la sua voce.",
  cta: { label: "Entra nella community", to: routes.community },
  images: [
    { src: "/images/hero-circle.webp", alt: "Donne e bambine di tutte le età e culture, unite in un cerchio di comunità" },
    { src: "/images/community-circle.webp", alt: "Donne di generazioni diverse in un giardino di pietra e rose al tramonto" },
    { src: "/images/garden-circle.webp", alt: "Cerchio di donne e bambine di culture diverse in un giardino fiorito" },
    { src: "/images/coaching-square.webp", alt: "Due donne che parlano sedute su un divano, in uno spazio caldo e luminoso" },
    { src: "/images/hero-circle-portrait.webp", alt: "Ritratto di donne e bambine di età e culture diverse" },
  ],
};

export type Testimonial = {
  name: string;
  age: number;
  quote: string;
  note: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Aurora",
    age: 17,
    quote:
      "Avevo paura di tutto. Della scuola, di mia mamma, di me. Ho iniziato a scrivere il diario qui dentro e a parlare con le altre ragazze… e oggi non mi vergogno più di prendere spazio. Sembra poco. Per me è tutto.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Sofia",
    age: 23,
    quote:
      "Sono uscita da una relazione tossica durata quattro anni. Non ce l'avrei mai fatta da sola — la community e i percorsi di Martina mi hanno tenuta in piedi quando le mie gambe non bastavano. Adesso vivo da sola e respiro.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Giorgia",
    age: 29,
    quote:
      "Ho studiato nell'academy di marketing e in sei mesi ho lanciato il mio piccolo brand. Non è un'azienda da copertina: è la mia, e mi paga l'affitto. Per la prima volta nella vita.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Valentina",
    age: 34,
    quote:
      "Diventare mamma mi ha disintegrata e ricomposta. Quando ho capito che non mi riconoscevo più, ho scelto di fare il percorso 1:1. Oggi sono ancora mamma, ma sono tornata anche donna.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Camilla",
    age: 38,
    quote:
      "Avevo già una mia attività, ma stagnante. Ho delegato la parte marketing all'agenzia di Martina e in cinque mesi ho triplicato i clienti. Finalmente lavoro nella mia azienda, non per la mia azienda.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Anna",
    age: 47,
    quote:
      "Dopo vent'anni di matrimonio mi sono separata. A 47 anni. Senza partita IVA, senza un'idea, senza coraggio. Mila mi ha presa per mano. Ho aperto la mia attività un anno dopo. Sono viva.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Federica",
    age: 54,
    quote:
      "Pensavo che la spiritualità fosse roba da guru. Qui ho trovato qualcosa di laico, gentile, vero. Medito ogni mattina da otto mesi e mio marito dice che sembro un'altra persona. Lo confermo.",
    note: "Storia vera, raccontata con le sue parole",
  },
  {
    name: "Marisa",
    age: 62,
    quote:
      "Ho conosciuto Mila Ecosystem da mia figlia. Pensavo non fosse per me, alla mia età. Mi sbagliavo. Ho ricominciato a camminare, a leggere, a chiedermi cosa voglio davvero. Non è mai troppo tardi.",
    note: "Storia vera, raccontata con le sue parole",
  },
];

/** Facts already present on the homepage, expressed as numbers. */
export const impact = {
  label: "L'ecosistema in numeri",
  items: [
    { value: 3, suffix: "", caption: "aree di lavoro: mente, corpo e indipendenza economica" },
    { value: 7, suffix: "", caption: "figure specialiste al tuo fianco, in sinergia" },
    { value: 6, suffix: "", caption: "risorse gratuite per iniziare subito" },
    { value: 45, suffix: "min", caption: "di call iniziale gratuita, in videocall" },
    { value: 62, prefix: "17–", suffix: "", caption: "anni: l'età delle donne della community" },
  ],
};

export type Resource = {
  kind: string;
  meta: string;
  title: string;
  description: string;
};

export const resources = {
  label: "Risorse gratuite",
  title: "Inizia subito, gratis.",
  lede: "Mini guide, audio, meditazioni e quiz per assaggiare l'approccio di Mila prima di intraprendere un percorso.",
  cta: { label: "Scarica gratis", to: routes.risorse },
  all: { label: "Tutte le risorse", to: routes.risorse },
  items: [
    { kind: "E-book", meta: "12 pagine", title: "5 passi per l'empowerment quotidiano", description: "Una mini guida pratica per mettere te al centro della giornata." },
    { kind: "Checklist", meta: "1 pagina", title: "Checklist per ritrovare direzione", description: "Le 10 domande che ogni donna dovrebbe farsi due volte all'anno." },
    { kind: "Audio", meta: "8 minuti", title: "Audio motivazionale del mattino", description: "Una voce calma per iniziare con intenzione." },
    { kind: "Audio", meta: "12 minuti", title: "Meditazione guidata: tornare al corpo", description: "Un rientro dolce, senza forzature." },
    { kind: "Quiz", meta: "5 minuti", title: "Scopri la tua area di crescita prioritaria", description: "Il quiz di autovalutazione di Mila." },
    { kind: "Video", meta: "5 minuti", title: "Come iniziare il tuo percorso di indipendenza", description: "Una lezione introduttiva gratuita." },
  ] satisfies Resource[],
};

export const call = {
  label: "Il primo passo",
  title: ["Prenota la tua", "call iniziale con me."],
  lede:
    "Una conversazione vera, dove ti ascolto. Da lì capiamo insieme dove sei e che tipo di percorso costruire — anche personalizzato — per te.",
  facts: ["45 minuti", "In videocall", "Gratuita"],
  agendaTitle: "Cosa vediamo insieme",
  agenda: [
    { title: "Dove sei adesso", text: "Mi racconti il momento che stai vivendo, senza filtri." },
    { title: "Cosa vorresti cambiare", text: "Mettiamo a fuoco insieme il vero punto di partenza." },
    { title: "Quale strada è la tua", text: "Capiamo quali aree dell'ecosistema sono più utili per te ora." },
    { title: "Il prossimo passo", text: "Decidiamo insieme se e come continuare. Senza obblighi." },
  ],
  cta: { label: "Prenota ora la tua call", to: routes.call },
  image: "/images/martina-call.webp",
  imageAlt: "Martina seduta accanto a una finestra, il telefono all'orecchio, in ascolto durante una call iniziale",
};

export const together = {
  label: "Costruiamo insieme",
  title: ["Questo non è un progetto", "che costruisco da sola."],
  text:
    "Mila Ecosystem è un mondo che voglio costruire insieme a voi: un mondo digitale, che presto si traslerà anche nel fisico, ma che è un posto che dobbiamo costruire assieme.",
  pull: "Non sono io la leader: voi pensate, io costruisco.",
  feedback: {
    title: "Il tuo parere conta davvero",
    text: "Un breve modulo anonimo per aiutarmi a costruire le prossime sezioni dell'ecosistema insieme a te.",
    cta: { label: "Apri il modulo", to: routes.feedback },
  },
};

export const thoughts = {
  label: "Pensieri da portare con te",
  quotes: [
    "Non chiedere il permesso di esistere a chi non ha mai imparato a guardarti davvero.",
    "La libertà non è un colpo di scena. È una serie di piccoli sì che dici a te stessa.",
    "Sei nata per essere un'origine, non un'eco.",
    "Quando smetti di tradurti per gli altri, finalmente ti capisci.",
    "La forza di una donna non è non cadere mai. È rialzarsi senza scusarsi.",
    "Non sei in ritardo sulla tua vita. Sei l'unica orologiaia di te stessa.",
    "Ogni confine che metti è una carezza che fai a chi sarai domani.",
    "Le radici delle donne che ti hanno preceduto sono ora le tue ali.",
  ],
};

export const finalCta = {
  lines: ["Torna a", "scegliere", "te stessa."],
  lede: "Il primo passo è una conversazione. Gratuita, senza obblighi.",
  primary: { label: "Prenota la call iniziale", to: routes.call },
  secondary: { label: "Scopri i percorsi", to: routes.percorsi },
};

export const footer = {
  tagline:
    "Un ecosistema digitale per donne che vogliono ritrovare forza, indipendenza e autenticità. Percorsi, community, corsi, viaggi e una guida concreta al tuo fianco.",
  explore: [
    { label: "Home", to: routes.home },
    { label: "Ecosistema", to: routes.ecosistema },
    { label: "Percorsi", to: routes.percorsi },
    { label: "Community", to: routes.community },
    { label: "Chi sono", to: routes.chiSono },
    { label: "Blog", to: routes.blog },
    { label: "Risorse gratuite", to: routes.risorse },
  ],
  ecosystem: [
    { label: "Libreria", to: routes.libreria },
    { label: "Viaggi", to: routes.viaggi },
    { label: "Business", to: routes.business },
    { label: "Bacheca", to: routes.bacheca },
    { label: "Eventi", to: routes.eventi },
    { label: "Collaborazioni", to: routes.collaborazioni },
    { label: "Feedback", to: routes.feedback },
  ],
  account: [
    { label: "Area personale", to: routes.dashboard },
    { label: "Accedi", to: routes.login },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "Email", href: "#" },
  ],
  copyright: "© 2026 Mila Ecosystem · Tutti i diritti riservati",
  disclaimer: "Questo spazio non sostituisce percorsi medici, terapeutici o specialistici.",
};
