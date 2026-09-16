import type { Area } from "@/data/content";
import { byId, CATALOG, type Commitment, type Offer } from "./catalog";
import { BUDGET_CUES, NEEDS, READINESS_CUES, type Need, type NeedId, type Readiness } from "./needs";

/**
 * Il motore di Millina.
 *
 * Segue la catena del brief — bisogno → comprensione → suggerimento → prossimo
 * passo — e si regge su tre principi, che sono ciò che separa un'assistente da
 * un banner pubblicitario con la faccia:
 *
 * 1. PROPORZIONE. Non propone mai più impegno di quanto le sia stato detto. A
 *    "sto male" non si risponde "compra il percorso più completo": si risponde
 *    con qualcosa di gratuito. Il tetto lo fissa `capFor`.
 *
 * 2. RETICENZA. Se non ha capito, chiede invece di indovinare. Se ha capito due
 *    cose lontane fra loro con la stessa forza, chiede quale conta di più.
 *    Un'assistente che tira a indovinare fa più danni di una che ammette il
 *    dubbio.
 *
 * 3. UNA COSA SOLA. Un suggerimento principale, non un listino. Le alternative
 *    esistono ma restano sotto, e fra loro c'è sempre qualcosa di gratuito.
 *
 * È deterministico e verificabile: `explain()` restituisce i punteggi, così il
 * comportamento si può testare invece che sperare. Un modello linguistico può
 * innestarsi sopra per la sola forma delle frasi, ma la scelta di cosa proporre
 * deve restare qui, dove il catalogo è vero.
 */

/** Toglie accenti e rumore: "perché" e "perche" devono pesare uguale. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type ScoredNeed = { need: Need; score: number };

export type Reading = {
  needs: ScoredNeed[];
  readiness: Readiness;
  budgetSensitive: boolean;
  /** L'area prevalente, se ce n'è una. */
  area: Area["slug"] | null;
  /** Vero quando non ha capito abbastanza per proporre qualcosa. */
  unclear: boolean;
  /** Vero quando ha capito due cose lontane con la stessa forza. */
  ambiguous: boolean;
};

const norm = (s: string) => normalize(s);

/** Un termine pesa quanto è specifico: "relazione tossica" più di "ansia". */
function termWeight(term: string) {
  // Il minimo e' alto di proposito: "sola" e "ansia" sono parole corte ma
  // inequivocabili, e rispondere "raccontami di piu'" a chi ha scritto "mi
  // sento sola" e' il modo piu' rapido per farla smettere di scrivere.
  return 1.15 + Math.min(term.trim().length / 14, 1.4);
}

export function interpret(input: string): Reading {
  const text = norm(input);
  const words = text.split(" ").filter(Boolean);

  const scored: ScoredNeed[] = [];
  for (const need of NEEDS) {
    let score = 0;
    for (const raw of need.lexicon) {
      const term = norm(raw);
      if (!term) continue;
      if (term.includes(" ")) {
        if (text.includes(term)) score += termWeight(term) * 1.3;
      } else if (words.some((w) => w.startsWith(term))) {
        score += termWeight(term);
      }
    }
    if (score > 0) scored.push({ need, score });
  }
  scored.sort((a, b) => b.score - a.score);

  let readiness: Readiness = "esplora";
  if (READINESS_CUES.accompagnata.some((c) => text.includes(norm(c)))) readiness = "accompagnata";
  else if (READINESS_CUES.pronta.some((c) => text.includes(norm(c)))) readiness = "pronta";

  const budgetSensitive = BUDGET_CUES.some((c) => text.includes(norm(c)));

  // Il bisogno concreto guida; quello meta accompagna e basta.
  const concrete = scored.filter((s) => !s.need.meta);
  const top = concrete[0] ?? scored[0];
  const second = concrete[1];
  const ambiguous =
    Boolean(top && second) &&
    top.need.area !== second.need.area &&
    second.score >= top.score * 0.75;

  // Sotto una certa soglia non ha davvero capito: meglio chiedere.
  const unclear = !top || top.score < 1.4 || words.length < 2;

  // In testa va il bisogno concreto: e' quello di cui Millina parlera'.
  const ordered = top ? [top, ...scored.filter((s) => s !== top)] : scored;

  return {
    needs: ordered.slice(0, 4),
    readiness,
    budgetSensitive,
    area: unclear || ambiguous ? null : top.need.area,
    unclear,
    ambiguous,
  };
}

/** Il tetto di impegno proponibile, dato quanto la persona si è sbilanciata. */
export function capFor(reading: Reading): Commitment {
  if (reading.budgetSensitive) return 0;
  // Un bisogno pratico dichiarato vale come prontezza: chi espone un problema
  // di clienti o di competenze si aspetta una risposta all'altezza, non un
  // libro di consolazione.
  const practical = reading.needs[0]?.need.practical === true;
  switch (reading.readiness) {
    case "accompagnata":
      return 4;
    case "pronta":
      return practical ? 4 : 2;
    default:
      return practical ? 3 : 1;
  }
}

export type Suggestion = { offer: Offer; score: number };

export type Answer =
  | { kind: "question"; text: string; options?: string[] }
  | {
      kind: "suggestion";
      /** La comprensione: quello che Millina ha capito, restituito a parole sue. */
      echo: string;
      main: Offer;
      alternatives: Offer[];
      /** Il prossimo passo: una cosa sola, concreta. */
      nextStep: Offer;
      note?: string;
    };

export function score(reading: Reading): Suggestion[] {
  const cap = capFor(reading);
  const needIds = new Set<NeedId>(reading.needs.map((n) => n.need.id));
  const weight = new Map<NeedId, number>(reading.needs.map((n) => [n.need.id, n.score]));

  return CATALOG.map((offer) => {
    let s = 0;
    for (const id of offer.serves) if (needIds.has(id)) s += weight.get(id) ?? 0;
    if (reading.area && offer.areas.includes(reading.area)) s += 1.2;
    // A parità di utilità vince la proposta più leggera: è il principio di
    // proporzione tradotto in punteggio, non solo in filtro.
    s -= offer.commitment * 0.45;
    if (reading.budgetSensitive && offer.commitment === 0) s += 1.5;
    if (reading.readiness === "accompagnata" && offer.kind === "call") s += 2;
    return { offer, score: s };
  })
    .filter((x) => x.offer.commitment <= cap && x.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function respond(input: string): Answer {
  const reading = interpret(input);

  if (reading.unclear) {
    // Puo' non aver capito l'argomento e aver capito benissimo il tono. Chi
    // scrive "ho gia' provato di tutto, ho bisogno di qualcuno che mi segua"
    // ha detto la cosa piu' importante di tutte: rispondere "raccontami di
    // piu'" sarebbe non aver ascoltato.
    if (reading.readiness === "accompagnata") {
      const call = byId("call");
      if (call) {
        return {
          kind: "suggestion",
          echo: "Quello che ho capito è che non vuoi farlo da sola. Su questo posso essere precisa.",
          main: call,
          alternatives: [byId("custom"), byId("salotto")].filter(Boolean) as Offer[],
          nextStep: call,
          note: "La call è gratuita e non impegna a niente: serve a capire insieme cosa ha senso per te.",
        };
      }
    }
    // Idem per chi sta chiedendo quanto costa: la risposta utile e' cosa non
    // costa nulla, non una controdomanda.
    if (reading.budgetSensitive) {
      const risorse = byId("risorse");
      if (risorse) {
        return {
          kind: "suggestion",
          echo: "Mi stai chiedendo quanto pesa, prima ancora di cosa c'è dentro. È una domanda giusta.",
          main: risorse,
          alternatives: [byId("call"), byId("quiz")].filter(Boolean) as Offer[],
          nextStep: risorse,
          note: "Queste tre cose non costano nulla. Del resto parliamo solo se e quando ti va.",
        };
      }
    }
    return {
      kind: "question",
      text: "Raccontami un po' di più: cosa ti pesa in questo momento, o cosa vorresti cambiare?",
      options: ["Non so da dove partire", "Sto attraversando un periodo difficile", "Vorrei lavorare su di me"],
    };
  }

  if (reading.ambiguous) {
    const [a, b] = reading.needs;
    return {
      kind: "question",
      text: "Ho colto due cose insieme. Su quale ti va di partire?",
      options: [capitalise(a.need.echo), capitalise(b.need.echo)],
    };
  }

  const ranked = score(reading);
  if (!ranked.length) {
    return {
      kind: "question",
      text: "Ho capito il punto, ma preferisco non tirare a indovinare. Vuoi che ne parliamo in call, senza impegno?",
      options: ["Sì, prenoto la call", "Preferisco guardare da sola"],
    };
  }

  const main = ranked[0].offer;

  // Fra le alternative ci dev'essere sempre qualcosa che non costa nulla: è il
  // freno che impedisce alla conversazione di diventare una vendita.
  const others = ranked.slice(1).filter((x) => x.offer.id !== main.id);
  const free = others.find((x) => x.offer.commitment === 0)?.offer;
  const alternatives = [...others.slice(0, 2).map((x) => x.offer)];
  if (free && !alternatives.includes(free)) alternatives.splice(1, 1, free);

  // Il prossimo passo è sempre il gesto più piccolo possibile.
  const nextStep =
    main.commitment === 0
      ? main
      : ([...ranked].sort((a, b) => a.offer.commitment - b.offer.commitment)[0]?.offer ?? main);

  const echo = `Se ho capito bene, quello che cerchi è ${reading.needs[0].need.echo}.`;
  const note =
    reading.budgetSensitive
      ? "Parto da quello che non costa nulla: il resto puoi vederlo quando e se ti va."
      : reading.readiness === "esplora"
        ? "Niente fretta: questo è solo un primo passo, non una decisione."
        : undefined;

  return { kind: "suggestion", echo, main, alternatives: alternatives.slice(0, 2), nextStep, note };
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Per i test e per capire perché ha risposto così. */
export function explain(input: string) {
  const reading = interpret(input);
  return {
    reading,
    cap: capFor(reading),
    ranked: score(reading).slice(0, 5).map((x) => ({ id: x.offer.id, score: +x.score.toFixed(2), commitment: x.offer.commitment })),
  };
}
