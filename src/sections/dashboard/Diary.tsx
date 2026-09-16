import { useEffect, useMemo, useState } from "react";
import { Lock, Pencil, Trash2 } from "lucide-react";

/**
 * Punto 25 — il diario.
 *
 * Scrivere, salvare, rileggere le pagine vecchie con la loro data, e
 * modificarle: tutto quello che il brief chiede, funzionante.
 *
 * Le pagine stanno nel `localStorage` del browser perché l'ecosistema non ha
 * ancora un account né un server. È una scelta onesta ma con un limite vero —
 * restano su questo dispositivo, su questo browser, e sparirebbero svuotando i
 * dati del sito — e per questo il limite è scritto in chiaro sotto al diario
 * invece che nascosto. Un diario che si perde senza avvisare è peggio di un
 * diario che non c'è.
 *
 * Quando arriveranno account e database, cambia solo `load` e `save`.
 */

const KEY = "mila.diario.v1";

type Entry = { date: string; question: string; text: string; updatedAt: number };
type Store = Record<string, Entry>;

/** Le domande guidate del brief. Ruotano sul giorno, come la frase. */
const QUESTIONS = [
  "Come ti senti oggi?",
  "Di cosa sei grata?",
  "Qual è stata la difficoltà della giornata?",
  "Che cosa hai capito di te?",
  "Cosa vuoi lasciare andare?",
  "Quale piccolo passo vuoi fare domani?",
];

const isoToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function questionFor(iso: string) {
  const days = Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
  return QUESTIONS[((days % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length];
}

/** Lo storage può mancare o lanciare: finestra privata, dati bloccati, quota piena. */
function load(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function save(store: Store): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

const longDate = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T00:00:00`),
  );

export function Diary() {
  const today = isoToday();
  const [store, setStore] = useState<Store>({});
  const [open, setOpen] = useState<string>(today);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<null | "ok" | "ko">(null);

  // Lo storage si legge dopo il mount: sul server non esiste.
  useEffect(() => {
    const s = load();
    setStore(s);
    setDraft(s[today]?.text ?? "");
  }, [today]);

  const past = useMemo(
    () => Object.values(store).sort((a, b) => b.date.localeCompare(a.date)),
    [store],
  );

  const question = store[open]?.question ?? questionFor(open);

  function write() {
    const text = draft.trim();
    const next: Store = { ...store };
    if (!text) delete next[open];
    else next[open] = { date: open, question, text, updatedAt: Date.now() };
    setStore(next);
    setSaved(save(next) ? "ok" : "ko");
    window.setTimeout(() => setSaved(null), 2600);
  }

  function remove(date: string) {
    const next = { ...store };
    delete next[date];
    setStore(next);
    save(next);
    if (open === date) {
      setOpen(today);
      setDraft(next[today]?.text ?? "");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-ivory p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label">Il diario</p>
        <p className="inline-flex items-center gap-1.5 text-[0.75rem] text-mute-2">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Solo tua
        </p>
      </div>

      <p className="mt-5 text-[0.8rem] capitalize text-mute-2">{longDate(open)}</p>
      <p className="serif-accent mt-2 text-[clamp(1.25rem,2.2vw,1.65rem)] leading-snug text-sage-deep">{question}</p>

      <label htmlFor="diario" className="sr-only">
        {question}
      </label>
      <textarea
        id="diario"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={7}
        placeholder="Scrivi quello che ti viene. Nessuno lo leggerà."
        className="mt-5 w-full resize-y rounded-[1rem] border border-ink/12 bg-ivory-2/40 p-4 text-[0.98rem] leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:text-mute-2 focus:border-sage-deep/50"
      />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button type="button" onClick={write} className="btn btn-primary !px-6 !py-3 !text-[0.9rem]">
          <span>{store[open] ? "Salva le modifiche" : "Salva la pagina"}</span>
        </button>
        {open !== today && (
          <button
            type="button"
            onClick={() => {
              setOpen(today);
              setDraft(store[today]?.text ?? "");
            }}
            className="link-underline text-[0.85rem] font-medium text-mute"
          >
            Torna a oggi
          </button>
        )}
        {saved === "ok" && <span className="text-[0.85rem] text-sage-deep">Salvata.</span>}
        {saved === "ko" && (
          <span className="text-[0.85rem] text-terracotta">
            Non sono riuscita a salvare: il browser sta bloccando i dati del sito.
          </span>
        )}
      </div>

      {past.length > 0 && (
        <div className="mt-10 border-t hairline pt-7">
          <p className="label">Le pagine di prima</p>
          <ul className="mt-4 grid gap-2">
            {past.map((entry) => (
              <li
                key={entry.date}
                className={`flex items-center gap-3 rounded-[0.9rem] border px-4 py-3 transition-colors duration-300 ${
                  entry.date === open ? "border-sage-deep/40 bg-sage-soft" : "border-ink/10 bg-ivory-2/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(entry.date);
                    setDraft(entry.text);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block text-[0.85rem] capitalize text-ink">{longDate(entry.date)}</span>
                  <span className="mt-0.5 block truncate text-[0.82rem] text-mute">{entry.text}</span>
                </button>
                <Pencil className="h-3.5 w-3.5 shrink-0 text-mute-2" strokeWidth={1.75} aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => remove(entry.date)}
                  className="shrink-0 rounded-full p-1.5 text-mute-2 transition-colors duration-300 hover:bg-ink/5 hover:text-terracotta"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only">Elimina la pagina del {longDate(entry.date)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Il limite va detto, non nascosto. */}
      <p className="mt-8 rounded-[0.9rem] border border-gold/45 bg-ivory-2/50 px-4 py-3 text-[0.78rem] leading-snug text-mute">
        Per ora il diario resta salvato <strong className="font-medium text-ink">solo su questo dispositivo</strong>,
        in questo browser: non passa da nessun server e nessuno può leggerlo, ma non lo ritrovi da un altro telefono
        e sparisce se cancelli i dati del sito. Quando ci sarà l'accesso, le pagine ti seguiranno.
      </p>
    </div>
  );
}
