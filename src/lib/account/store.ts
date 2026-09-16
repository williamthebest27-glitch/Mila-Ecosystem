import { useMemo, useSyncExternalStore } from "react";
import { datiDiEsempio, VUOTO } from "@/data/esempio";
import type { Account, AccountData } from "./types";

/**
 * Lo strato account dell'area personale — il punto 34 del brief, quello che
 * chiede una struttura "abbastanza modulare da consentire di aggiungere queste
 * cose successivamente".
 *
 * Qui dentro c'è una cosa sola: da dove arrivano i dati dell'area personale.
 * Oggi arrivano da questo file — il nome e il codice invito stanno nel
 * `localStorage` di chi guarda, percorsi, prenotazioni ed eventi sono vuoti
 * perché senza account non esiste niente di vero da mostrare. Domani
 * arriveranno da un server: cambiano `leggi`, `salva` e `dati`, e nessuna
 * sezione della dashboard se ne accorge.
 *
 * La scelta di non inventare dati è deliberata e vale per tutto il progetto:
 * mostrare un 62% di avanzamento finto chiede a chi guarda di fingere che sia
 * vero, e rende impossibile distinguere ciò che funziona da ciò che è
 * scenografia. Per vedere l'area da piena c'è l'interruttore dei dati di
 * esempio, che si dichiara in chiaro mentre è acceso.
 *
 * Nessun sistema a punti: il brief lo esclude due volte (punti 20 e 34), e
 * infatti in questo file non c'è nessun campo che assomigli a un punteggio.
 */

const KEY = "mila.account.v1";

/** Niente 0/O/1/I/L: un codice si detta a voce e si scrive a mano. */
const ALFABETO = "ACDEFGHJKMNPQRTUVWXY2345679";

function nuovoCodice(): string {
  let out = "";
  const n = new Uint32Array(5);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(n);
  else for (let i = 0; i < n.length; i++) n[i] = Math.floor(Math.random() * 0xffffffff);
  for (let i = 0; i < n.length; i++) out += ALFABETO[n[i] % ALFABETO.length];
  return `MILA-${out}`;
}

const VUOTA: Account = { name: "", referral: "", invitedBy: null, demo: false };

function leggi(): Account {
  if (typeof window === "undefined") return VUOTA;
  let saved: Partial<Account> = {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) saved = JSON.parse(raw) as Partial<Account>;
  } catch {
    // Finestra privata, dati del sito bloccati, JSON rovinato: si riparte da zero.
  }
  return {
    name: typeof saved.name === "string" ? saved.name : "",
    // Il codice si genera una volta sola e poi resta: un codice invito che
    // cambia a ogni visita non è un codice, è un numero a caso.
    referral: typeof saved.referral === "string" && saved.referral ? saved.referral : nuovoCodice(),
    invitedBy: typeof saved.invitedBy === "string" ? saved.invitedBy : null,
    demo: saved.demo === true,
  };
}

let stato: Account = leggi();
const ascoltatori = new Set<() => void>();

function salva(next: Account) {
  stato = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Non poter salvare non deve impedire di usare la pagina: lo stato resta
    // in memoria per questa sessione.
  }
  ascoltatori.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  ascoltatori.add(fn);
  return () => ascoltatori.delete(fn);
}

const getSnapshot = () => stato;
const getServerSnapshot = () => VUOTA;

export const setName = (name: string) => salva({ ...stato, name: name.trim().slice(0, 40) });
export const setDemo = (demo: boolean) => salva({ ...stato, demo });

/**
 * Chi arriva da un link di invito (`?invito=MILA-XXXXX`) viene registrata una
 * volta sola, e il codice resta. È la metà mancante del punto 26: un referral
 * in cui il link non viene raccolto da nessuna parte è solo un pulsante copia.
 *
 * Va chiamata una volta all'avvio dell'app, non dalla dashboard: l'invito
 * atterra sulla homepage, non nell'area personale.
 */
export function captureInvite() {
  if (typeof window === "undefined" || stato.invitedBy) return;
  const code = new URLSearchParams(window.location.search).get("invito");
  if (!code) return;
  const pulito = code.trim().toUpperCase().slice(0, 20);
  if (/^MILA-[A-Z0-9]{3,12}$/.test(pulito) && pulito !== stato.referral) salva({ ...stato, invitedBy: pulito });
}

/** Il link personale da condividere. Si costruisce sull'origine vera, non su un dominio scritto a mano. */
export function inviteLink(code: string): string {
  const base = typeof window === "undefined" ? "" : window.location.origin;
  return `${base}/?invito=${code}`;
}

/**
 * Lo stato dell'area personale, con i suoi dati.
 *
 * `items`, `bookings` ed `events` sono vuoti finché non si accendono i dati di
 * esempio: è qui che un giorno si innesta la chiamata al server.
 */
export function useAccount(): Account & AccountData {
  const account = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dati = useMemo(() => (account.demo ? datiDiEsempio() : VUOTO), [account.demo]);
  return { ...account, ...dati };
}
