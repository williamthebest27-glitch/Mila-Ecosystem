import { ArrowUpRight, Check } from "lucide-react";
import { routes } from "@/data/content";
import { useAccount } from "@/lib/account/store";
import type { OwnedItem } from "@/lib/account/types";
import { Link } from "@/components/Link";
import { Cover } from "@/sections/Library";
import { Card, Esempio, Vuoto } from "./kit";

/**
 * Punto 27 — "I miei percorsi", tutto quello che è stato acquistato.
 *
 * L'istruzione è una sola e vale più di ogni altra cosa: "la persona deve
 * trovare immediatamente quello che ha comprato". Da qui due decisioni.
 *
 * La prima: quello che è rimasto a metà viene prima. L'ordine non è per data
 * né per tipo, è per quanto è vicino a essere ripreso — in corso, poi finito,
 * poi quello che non ha un avanzamento. La seconda: sopra la griglia c'è una
 * riga sola, "Riprendi da qui", con il punto esatto in cui il percorso si è
 * fermato. Chi entra per cinque minuti non deve cercare niente.
 *
 * L'avanzamento è quello vero o non c'è: nessuna percentuale di riempimento.
 */

const NOMI: Record<OwnedItem["kind"], string> = {
  corso: "Corso",
  percorso: "Percorso",
  libro: "Libro",
  ebook: "Ebook",
  workbook: "Workbook",
  registrazione: "Registrazione",
  materiale: "Materiale",
  bonus: "Bonus",
};

/**
 * In corso, poi completati, poi quello che un avanzamento non ce l'ha. A
 * parità, prima quello aperto più di recente: è l'ordine in cui le cose
 * stanno in testa a chi rientra.
 */
function ordina(items: OwnedItem[]): OwnedItem[] {
  const peso = (i: OwnedItem) => (i.progress === undefined ? 2 : i.progress >= 100 ? 1 : 0);
  return [...items].sort(
    (a, b) =>
      peso(a) - peso(b) || (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0) || (b.progress ?? 0) - (a.progress ?? 0),
  );
}

function Barra({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full rounded-full bg-sage-cta" style={{ width: `${value}%` }} />
    </div>
  );
}

function Copertina({ item, className = "" }: { item: OwnedItem; className?: string }) {
  if (item.cover.type === "book") {
    return (
      <div className={className}>
        <Cover title={item.name} topic={item.cover.topic} tone={item.cover.tone} />
      </div>
    );
  }
  return (
    <img
      src={item.cover.src}
      alt={item.cover.alt}
      loading="lazy"
      className={`card-img aspect-[2/3] rounded-[0.7rem] object-cover ${className}`}
    />
  );
}

/** "Continua" se è a metà, "Riapri" se è finito, "Apri" se non ha avanzamento. */
const azione = (item: OwnedItem) =>
  item.progress === undefined ? "Apri" : item.progress >= 100 ? "Riapri" : "Continua";

function Azione({ item, primaria = false }: { item: OwnedItem; primaria?: boolean }) {
  const label = azione(item);
  if (!item.to) {
    return (
      <span className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.16em] text-gold-deep">
        Presto disponibile
      </span>
    );
  }
  return (
    <Link
      to={item.to}
      className={`btn ${primaria ? "btn-primary" : "btn-ghost"} !px-5 !py-2.5 !text-[0.85rem]`}
      aria-label={`${label}: ${item.name}`}
    >
      <span>{label}</span>
      <ArrowUpRight className="btn-arrow h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
    </Link>
  );
}

export function MyPaths() {
  const { items, demo } = useAccount();
  const ordinati = ordina(items);
  const riprendi = ordinati.find((i) => i.progress !== undefined && i.progress < 100);
  const mancaLaPagina = items.some((i) => !i.to);

  return (
    <Card
      id="percorsi"
      title="I tuoi percorsi"
      note="Corsi, percorsi, libri, workbook, registrazioni e bonus: quello che è tuo sta qui, e si riapre dal punto in cui l'hai lasciato."
      right={<Esempio on={demo} />}
    >
      {items.length === 0 ? (
        <Vuoto
          title="Qui dentro non c'è ancora niente."
          text="Appena entri in un percorso, scarichi un libro o ricevi un bonus, lo ritrovi qui — con il punto esatto in cui sei rimasta, senza doverlo cercare."
        >
          <Link to={routes.percorsi} className="btn btn-primary !px-5 !py-3 !text-[0.85rem]">
            <span>Esplora i percorsi</span>
          </Link>
          <Link to={routes.risorse} className="link-underline text-[0.9rem] font-medium text-mute">
            Oppure parti dalle risorse gratuite
          </Link>
        </Vuoto>
      ) : (
        <>
          {/* La riga che serve a chi ha due minuti: dove eri rimasta. */}
          {riprendi && (
            <div className="mt-7 flex flex-col gap-5 rounded-[1.1rem] border border-sage-deep/25 bg-sage-wash p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <Copertina item={riprendi} className="w-16 shrink-0 sm:w-20" />
              <div className="min-w-0 flex-1">
                <p className="label !text-[0.6rem]">Riprendi da qui</p>
                <p className="display display-sm mt-2 font-normal">{riprendi.name}</p>
                {riprendi.resume && <p className="mt-1.5 text-[0.9rem] text-mute">{riprendi.resume}</p>}
                <div className="mt-3 flex items-center gap-3">
                  <Barra value={riprendi.progress!} label={`Avanzamento di ${riprendi.name}`} />
                  <span className="num shrink-0 text-[0.78rem] text-sage-deep">{riprendi.progress}%</span>
                </div>
              </div>
              <div className="shrink-0">
                <Azione item={riprendi} primaria />
              </div>
            </div>
          )}

          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {ordinati.map((item) => (
              <li
                key={item.id}
                className="card-hover group flex gap-5 rounded-[1.1rem] border border-ink/10 bg-ivory-2/40 p-4 hover:border-sage-deep/35 sm:p-5"
              >
                <Copertina item={item} className="w-16 shrink-0 sm:w-[4.5rem]" />

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="label !text-[0.6rem]">{NOMI[item.kind]}</p>
                  <h3 className="display mt-1.5 text-[1.05rem] font-normal leading-tight">{item.name}</h3>
                  <p className="mt-2 text-[0.85rem] leading-snug text-mute">{item.line}</p>

                  {item.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[0.78rem] text-mute-2">
                          {item.progress >= 100 ? (
                            <span className="inline-flex items-center gap-1.5 text-sage-deep">
                              <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                              Completato
                            </span>
                          ) : (
                            (item.resume ?? "Avanzamento")
                          )}
                        </span>
                        <span className="num text-[0.78rem] text-sage-deep">{item.progress}%</span>
                      </div>
                      <Barra value={item.progress} label={`Avanzamento di ${item.name}`} />
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <Azione item={item} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {mancaLaPagina && (
            <p className="mt-6 text-[0.78rem] leading-snug text-mute-2">
              Alcuni contenuti non hanno ancora una pagina dove aprirsi: l'area personale sa già cosa è tuo, il
              lettore interno arriva dopo.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
