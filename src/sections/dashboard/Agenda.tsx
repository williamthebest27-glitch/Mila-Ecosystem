import { useAccount } from "@/lib/account/store";
import { agenda, giornoBreve, giorniDa, ora, perMese } from "@/lib/account/calendar";
import { Card, Esempio, Vuoto } from "./kit";

/**
 * Punto 30 — il calendario personale.
 *
 * Il brief è esplicito: "non serve necessariamente qualcosa di complesso,
 * anche una vista cronologica molto pulita può andare bene". Quindi niente
 * griglia mensile con le caselle vuote — in un'agenda con quattro impegni al
 * mese, ventisei caselle su trenta sarebbero vuote e la vista racconterebbe
 * soprattutto quello che non c'è.
 *
 * Qui c'è una linea del tempo: i mesi in ordine, dentro ogni mese i giorni, e
 * una riga per impegno. Prenotazioni ed eventi sono la stessa lista — perché
 * il tempo è uno solo — ma si distinguono a colpo d'occhio dal colore del
 * puntino, e le azioni restano nella bacheca, dove ci sono lo spazio e il
 * contesto per farle.
 */
export function Agenda() {
  const { bookings, events, demo } = useAccount();
  const voci = agenda(bookings, events);
  const gruppi = perMese(voci);

  return (
    <Card
      id="agenda"
      title="La tua agenda"
      note="Prenotazioni ed eventi in ordine di data, mese per mese."
      right={<Esempio on={demo} />}
      className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]"
    >
      {voci.length === 0 ? (
        <Vuoto
          title="L'agenda è ancora vuota."
          text="Appena prenoti una call o entri in un percorso che comprende degli incontri, qui compare la lista in ordine di data — con quanto manca."
        />
      ) : (
        <>
          <div className="mt-7 grid gap-8">
            {gruppi.map((gruppo) => (
              <div key={gruppo.mese}>
                <p className="text-[0.78rem] uppercase tracking-[0.16em] text-mute-2">{gruppo.mese}</p>

                <ul className="mt-4 border-l hairline pl-5">
                  {gruppo.voci.map((voce) => {
                    const oggi = giorniDa(voce.start) === 0;
                    const prenotazione = voce.kind === "prenotazione";
                    return (
                      <li key={voce.id} className="relative py-3 last:pb-0">
                        {/* Il puntino sulla linea del tempo */}
                        <span
                          aria-hidden="true"
                          className={`absolute -left-[1.4rem] top-[1.05rem] h-2 w-2 rounded-full ${
                            prenotazione ? "bg-sage-cta" : "border border-gold-deep/70 bg-ivory"
                          }`}
                        />
                        <p className="flex flex-wrap items-baseline gap-x-2 text-[0.82rem] text-mute">
                          <span className="num text-ink">{voce.start.getDate()}</span>
                          <span className="capitalize">{giornoBreve(voce.start)}</span>
                          <span className="num">{ora(voce.start)}</span>
                          {oggi && (
                            <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[0.68rem] font-medium text-sage-deep">
                              oggi
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-[0.95rem] leading-snug text-ink">{voce.title}</p>
                        <p className="mt-0.5 text-[0.82rem] leading-snug text-mute-2">{voce.detail}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t hairline pt-5 text-[0.78rem] text-mute-2">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sage-cta" aria-hidden="true" />
              le tue prenotazioni
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-gold-deep/70 bg-ivory" aria-hidden="true" />
              gli eventi del percorso
            </span>
          </p>
        </>
      )}
    </Card>
  );
}
