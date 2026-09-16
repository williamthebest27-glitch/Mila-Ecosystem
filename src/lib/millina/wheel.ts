import type { Area } from "@/data/content";
import type { Offer } from "./catalog";
import { capFor, score, type Reading } from "./engine";
import { NEEDS, type NeedId, type Readiness } from "./needs";

/**
 * La Ruota della Vita (punto 23).
 *
 * Le dieci voci sono quelle del brief. Ognuna è agganciata a un bisogno della
 * tassonomia di Millina, così il risultato del quiz entra nello stesso motore
 * che ascolta le parole: non esistono due intelligenze diverse da tenere
 * allineate, ne esiste una sola con due porte d'ingresso.
 */

export type WheelSlice = {
  id: string;
  name: string;
  area: Area["slug"];
  need: NeedId;
};

export const WHEEL: WheelSlice[] = [
  { id: "autostima", name: "Autostima", area: "mindset", need: "giudizio" },
  { id: "relazioni", name: "Relazioni", area: "mindset", need: "distacco" },
  { id: "femminilita", name: "Femminilità", area: "mindset", need: "scegliersi" },
  { id: "mentale", name: "Benessere mentale", area: "mindset", need: "stabilita" },
  { id: "corpo", name: "Corpo", area: "benessere", need: "corpo" },
  { id: "alimentazione", name: "Alimentazione", area: "benessere", need: "corpo" },
  { id: "lavoro", name: "Lavoro", area: "indipendenza", need: "lavoro" },
  { id: "economica", name: "Indipendenza economica", area: "indipendenza", need: "indipendenza" },
  { id: "business", name: "Business", area: "indipendenza", need: "clienti" },
  { id: "crescita", name: "Crescita personale", area: "mindset", need: "schemi" },
];

export type WheelScores = Record<string, number>;

export type WheelResult = {
  /** La voce più bassa: da lì Millina fa partire il consiglio. */
  weakest: WheelSlice;
  /** Le altre voci sotto la media, per dire "non sei sola in questo". */
  alsoLow: WheelSlice[];
  average: number;
  /** L'area dell'ecosistema che risulta più scoperta. */
  area: Area["slug"];
  readiness: Readiness;
  /** Cosa Millina propone, dallo stesso motore delle parole. */
  main: Offer | null;
  alternatives: Offer[];
  reading: Reading;
};

export function analyseWheel(scores: WheelScores): WheelResult | null {
  const filled = WHEEL.filter((s) => typeof scores[s.id] === "number");
  if (filled.length < WHEEL.length) return null;

  const values = filled.map((s) => scores[s.id]);
  const average = values.reduce((a, b) => a + b, 0) / values.length;

  const sorted = [...filled].sort((a, b) => scores[a.id] - scores[b.id]);
  const weakest = sorted[0];
  const alsoLow = sorted.slice(1).filter((s) => scores[s.id] < average && scores[s.id] <= scores[weakest.id] + 1);

  // Quale area dell'ecosistema risulta più scoperta, sommando le sue voci.
  const byArea = new Map<Area["slug"], number[]>();
  for (const s of filled) {
    const list = byArea.get(s.area) ?? [];
    list.push(scores[s.id]);
    byArea.set(s.area, list);
  }
  const area = [...byArea.entries()]
    .map(([slug, v]) => ({ slug, avg: v.reduce((a, b) => a + b, 0) / v.length }))
    .sort((a, b) => a.avg - b.avg)[0].slug;

  // Il tono lo detta il quadro complessivo, non il singolo punteggio: se sta
  // faticando ovunque non è il momento di proporle un impegno grande.
  const gap = average - scores[weakest.id];
  const readiness: Readiness = average < 4 ? "esplora" : gap >= 2.5 ? "pronta" : "esplora";

  const need = NEEDS.find((n) => n.id === weakest.need)!;
  const reading: Reading = {
    needs: [{ need, score: 3 }],
    readiness,
    budgetSensitive: false,
    area,
    unclear: false,
    ambiguous: false,
  };

  const ranked = score(reading);
  return {
    weakest,
    alsoLow,
    average: +average.toFixed(1),
    area,
    readiness,
    main: ranked[0]?.offer ?? null,
    alternatives: ranked.slice(1, 3).map((x) => x.offer),
    reading,
  };
}

/** Il cappello che Millina mette davanti al consiglio, secondo il quadro. */
export function wheelOpening(result: WheelResult): string {
  if (result.average < 4) {
    return "Da quello che hai segnato, stai facendo fatica un po' ovunque. Partiamo piano, da una cosa sola.";
  }
  if (result.average >= 7.5) {
    return "Il quadro è già buono quasi dappertutto. Allora lavoriamo sul punto che ti manca.";
  }
  return "C'è una voce che sta più indietro delle altre. Da lì ti consiglierei di partire.";
}

export { capFor };
