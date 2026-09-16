import { CalendarPlus, Video } from "lucide-react";
import { routes } from "@/data/content";
import { useAccount } from "@/lib/account/store";
import type { Booking, CollectiveEvent } from "@/lib/account/types";
import { fine, giornoBreve, meseBreve, ora, quando, scaricaIcs } from "@/lib/account/calendar";
import { Link } from "@/components/Link";
import { Card, Esempio, Vuoto } from "./kit";

/**
 * Punti 28 e 29 — la bacheca: le tue prenotazioni e gli eventi inclusi nel
 * percorso.
 *
 * Due blocchi separati e non una lista sola, perché sono due cose diverse:
 * una call prenotata è un impegno preso con una persona, una live inclusa nel
 * percorso è un invito. Confonderle significa far sembrare facoltativo il
 * primo e obbligatorio il secondo.
 *
 * "Aggiungi al calendario" non è un link: scrive un file .ics vero, che il
 * calendario del telefono apre da solo (`lib/account/calendar.ts`). Funziona
 * adesso, senza account e senza server — perché quello che deve fare, un
 * appuntamento, lo sa già tutto: quando, quanto dura, con chi.
 *
 * Il link della videochiamata compare solo se esiste davvero. Dove non c'è,
 * al suo posto c'è scritto quando arriverà: un pulsante "Entra nella call"
 * che non porta in nessuna call è peggio di nessun pulsante.
 */

function Quando({ start, minutes }: { start: Date; minutes: number }) {
  return (
    <div className="flex shrink-0 select-none flex-col items-center self-start rounded-[0.9rem] border border-sage-deep/20 bg-sage-wash px-3 py-2.5 text-center">
      <span className="num display text-[1.5rem] leading-none">{start.getDate()}</span>
      <span className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-sage-deep">{meseBreve(start)}</span>
      <span className="sr-only">
        {giornoBreve(start)} {ora(start)} – {ora(fine(start, minutes))}
      </span>
    </div>
  );
}

function AlCalendario({
  title,
  start,
  minutes,
  uid,
  description,
  location,
  url,
}: {
  title: string;
  start: Date;
  minutes: number;
  uid: string;
  description: string;
  location?: string;
  url?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => scaricaIcs({ uid, title, start, minutes, description, location, url })}
      className="btn btn-ghost !px-4 !py-2.5 !text-[0.82rem]"
    >
      <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span>Aggiungi al calendario</span>
    </button>
  );
}

function Riga({
  start,
  minutes,
  children,
}: {
  start: Date;
  minutes: number;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 rounded-[1.1rem] border border-ink/10 bg-ivory-2/40 p-4 sm:gap-5 sm:p-5">
      <Quando start={start} minutes={minutes} />
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

function Orario({ start, minutes }: { start: Date; minutes: number }) {
  return (
    <p className="mt-1.5 text-[0.85rem] text-mute">
      <span className="capitalize">{giornoBreve(start)}</span>
      {" · "}
      <span className="num">
        {ora(start)} – {ora(fine(start, minutes))}
      </span>
      {" · "}
      <span className="text-mute-2">{quando(start)}</span>
    </p>
  );
}

function Prenotazione({ b }: { b: Booking }) {
  const start = new Date(b.start);
  return (
    <Riga start={start} minutes={b.minutes}>
      <p className="label !text-[0.6rem]">{b.type}</p>
      <h3 className="display mt-1.5 text-[1.05rem] font-normal leading-tight">{b.title}</h3>
      <Orario start={start} minutes={b.minutes} />
      <p className="mt-1 text-[0.85rem] text-mute">
        {b.who} · {b.place}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {b.link && (
          <Link to={b.link} className="btn btn-primary !px-4 !py-2.5 !text-[0.82rem]">
            <Video className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>Entra nella call</span>
          </Link>
        )}
        <AlCalendario
          uid={b.id}
          title={b.title}
          start={start}
          minutes={b.minutes}
          description={`${b.type} con ${b.who}. ${b.place}.`}
          location={b.place}
          url={b.link}
        />
      </div>

      {!b.link && (
        <p className="mt-3 text-[0.78rem] leading-snug text-mute-2">
          Il link della videochiamata ti arriva prima dell'incontro.
        </p>
      )}
    </Riga>
  );
}

const TIPO: Record<CollectiveEvent["kind"], string> = {
  live: "Live",
  workshop: "Workshop",
  incontro: "Incontro",
  community: "Community",
};

function Evento({ e }: { e: CollectiveEvent }) {
  const start = new Date(e.start);
  return (
    <Riga start={start} minutes={e.minutes}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <p className="label !text-[0.6rem]">{TIPO[e.kind]}</p>
        <span className="rounded-full border border-gold/50 px-2.5 py-0.5 text-[0.68rem] text-gold-deep">
          Incluso in {e.includedIn}
        </span>
      </div>
      <h3 className="display mt-1.5 text-[1.05rem] font-normal leading-tight">{e.title}</h3>
      <Orario start={start} minutes={e.minutes} />
      {e.who && <p className="mt-1 text-[0.85rem] text-mute">{e.who}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {e.link && (
          <Link to={e.link} className="btn btn-primary !px-4 !py-2.5 !text-[0.82rem]">
            <Video className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>Partecipa</span>
          </Link>
        )}
        <AlCalendario
          uid={e.id}
          title={e.title}
          start={start}
          minutes={e.minutes}
          description={`${TIPO[e.kind]} inclusa in ${e.includedIn}${e.who ? `. ${e.who}` : ""}.`}
          url={e.link}
        />
      </div>

      {!e.link && (
        <p className="mt-3 text-[0.78rem] leading-snug text-mute-2">
          Il link per partecipare compare qui il giorno dell'incontro.
        </p>
      )}
    </Riga>
  );
}

export function Board() {
  const { bookings, events, demo } = useAccount();

  return (
    <div className="grid gap-5">
      <Card
        id="bacheca"
        title="Le tue prenotazioni"
        note="Le call e le sessioni che hai fissato, con giorno, orario e con chi."
        right={<Esempio on={demo} />}
      >
        {bookings.length === 0 ? (
          <Vuoto
            title="Non hai appuntamenti in programma."
            text="La call iniziale con Martina dura quarantacinque minuti, si fa in videochiamata ed è gratuita: serve a capire insieme da dove conviene partire."
          >
            <Link to={routes.call} className="btn btn-primary !px-5 !py-3 !text-[0.85rem]">
              <span>Prenota la call iniziale</span>
            </Link>
          </Vuoto>
        ) : (
          <ul className="mt-7 grid gap-4">
            {bookings
              .slice()
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((b) => (
                <Prenotazione key={b.id} b={b} />
              ))}
          </ul>
        )}
      </Card>

      <Card
        title="Prossimi eventi"
        note="Live, workshop e incontri con le professioniste: compaiono qui quando il tuo percorso li comprende."
        right={<Esempio on={demo} />}
      >
        {events.length === 0 ? (
          <Vuoto
            title="Nessun evento in programma."
            text="Ogni percorso porta con sé i suoi incontri: le live periodiche, i workshop, i cerchi della community. Quando ne scegli uno, gli appuntamenti inclusi arrivano qui da soli."
          >
            <Link to={routes.percorsi} className="link-underline text-[0.9rem] font-medium text-mute">
              Guarda cosa comprende ogni percorso
            </Link>
          </Vuoto>
        ) : (
          <ul className="mt-7 grid gap-4">
            {events
              .slice()
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((e) => (
                <Evento key={e.id} e={e} />
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
