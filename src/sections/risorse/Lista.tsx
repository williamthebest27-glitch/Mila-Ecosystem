import { useState } from "react";
import { ArrowUpRight, Check, Download } from "lucide-react";
import { resources, resourcesPage } from "@/data/content";
import type { Resource } from "@/data/content";
import { useReveal } from "@/hooks/useGsap";
import { Link } from "@/components/Link";

/**
 * Le sei risorse gratuite, con il loro modulo (punto 32).
 *
 * Nell'app originale ogni risorsa ha il suo modulo di richiesta sempre aperto:
 * sei moduli identici uno sotto l'altro, che allungano la pagina e la fanno
 * sembrare un ufficio. Qui l'elenco resta un indice editoriale — una riga per
 * risorsa — e il modulo si apre solo su quella che hai scelto.
 *
 * Il modulo funziona: valida i campi, si compila, ricorda quello che hai
 * scritto. Ma non spedisce, perché non c'è ancora un servizio a cui
 * consegnare la richiesta — e allora lo dice, invece di rispondere "grazie!"
 * a un invio che non è avvenuto. Un modulo che finge di aver spedito una cosa
 * che non arriverà mai è il modo più veloce di perdere la fiducia di chi ha
 * appena lasciato il proprio indirizzo.
 *
 * Il punto di innesto è `invia`: una fetch verso il servizio email, e il resto
 * di questo file resta identico.
 */

type Dati = { nome: string; cognome: string; email: string; telefono: string };

const VUOTI: Dati = { nome: "", cognome: "", email: "", telefono: "" };

const emailValida = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function Campo({
  id,
  label,
  value,
  onChange,
  errore,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  errore?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label !text-[0.6rem]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(errore)}
        aria-describedby={errore ? `${id}-errore` : undefined}
        className={`mt-2.5 w-full rounded-[0.9rem] border bg-ivory px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors duration-300 placeholder:text-mute-2 focus:border-sage-deep/50 ${
          errore ? "border-terracotta" : "border-ink/12"
        }`}
      />
      {errore && (
        <p id={`${id}-errore`} className="mt-2 text-[0.8rem] text-terracotta">
          {errore}
        </p>
      )}
    </div>
  );
}

function Modulo({ risorsa }: { risorsa: Resource }) {
  const [dati, setDati] = useState<Dati>(VUOTI);
  const [errori, setErrori] = useState<Partial<Record<keyof Dati, string>>>({});
  const [pronta, setPronta] = useState(false);

  const set = (k: keyof Dati) => (v: string) => {
    setDati((d) => ({ ...d, [k]: v }));
    if (errori[k]) setErrori((e) => ({ ...e, [k]: undefined }));
  };

  function invia(e: React.FormEvent) {
    e.preventDefault();
    const nuovi: Partial<Record<keyof Dati, string>> = {};
    if (!dati.nome.trim()) nuovi.nome = resourcesPage.form.manca;
    if (!dati.cognome.trim()) nuovi.cognome = resourcesPage.form.manca;
    if (!dati.email.trim()) nuovi.email = resourcesPage.form.manca;
    else if (!emailValida(dati.email)) nuovi.email = resourcesPage.form.emailStorta;
    setErrori(nuovi);
    if (Object.keys(nuovi).length > 0) return;
    setPronta(true);
  }

  if (pronta) {
    return (
      <div className="rounded-[1.1rem] border border-gold/50 bg-ivory p-6 sm:p-7">
        <p className="serif-accent text-[1.15rem] leading-snug text-sage-deep">{resourcesPage.sent.title}</p>
        <p className="mt-3 max-w-xl text-[0.92rem] leading-snug text-mute">{resourcesPage.sent.text}</p>

        <dl className="mt-6 grid gap-x-8 gap-y-3 border-t hairline pt-5 text-[0.9rem] sm:grid-cols-2">
          <div className="grid gap-1 sm:col-span-2">
            <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-mute-2">{resourcesPage.sent.recap}</dt>
            <dd className="text-ink">{risorsa.title}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-mute-2">Nome</dt>
            <dd className="text-ink">
              {dati.nome} {dati.cognome}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-mute-2">Email</dt>
            <dd className="break-words text-ink">{dati.email}</dd>
          </div>
          {dati.telefono.trim() && (
            <div className="grid gap-1">
              <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-mute-2">Telefono</dt>
              <dd className="text-ink">{dati.telefono}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={() => {
            setPronta(false);
            setDati(VUOTI);
          }}
          className="link-underline mt-6 text-[0.85rem] font-medium text-mute"
        >
          {resourcesPage.sent.again}
        </button>
      </div>
    );
  }

  return (
    // `noValidate`: la validazione è quella qui sotto, in italiano e nello
    // stile della pagina. Quella nativa del browser scriverebbe i suoi
    // messaggi nella lingua del sistema operativo e impedirebbe a questa di
    // arrivare in fondo.
    <form noValidate onSubmit={invia} className="rounded-[1.1rem] border border-ink/12 bg-ivory p-6 sm:p-7">
      <p className="serif-accent text-[1.1rem] text-sage-deep">{resourcesPage.form.title}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Campo id={`nome-${risorsa.title}`} label={resourcesPage.form.nome} value={dati.nome} onChange={set("nome")} errore={errori.nome} autoComplete="given-name" />
        <Campo id={`cognome-${risorsa.title}`} label={resourcesPage.form.cognome} value={dati.cognome} onChange={set("cognome")} errore={errori.cognome} autoComplete="family-name" />
        <Campo id={`email-${risorsa.title}`} label={resourcesPage.form.email} value={dati.email} onChange={set("email")} errore={errori.email} type="email" autoComplete="email" />
        <Campo id={`tel-${risorsa.title}`} label={resourcesPage.form.telefono} value={dati.telefono} onChange={set("telefono")} type="tel" autoComplete="tel" />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" className="btn btn-primary !px-6 !py-3 !text-[0.9rem]">
          <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span>{resourcesPage.form.cta}</span>
        </button>
        <p className="text-[0.8rem] text-mute-2">{resourcesPage.form.safe}</p>
      </div>
    </form>
  );
}

export function Lista() {
  const revealRef = useReveal<HTMLDivElement>();
  const [aperta, setAperta] = useState<string | null>(null);

  return (
    <section className="bg-ivory section-pad" aria-labelledby="scegli-title">
      <div ref={revealRef} className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" data-reveal>
            <h2 id="scegli-title" className="display display-lg">
              {resourcesPage.chooseTitle}
            </h2>
          </div>
          <p className="body-copy lg:col-span-5 lg:max-w-sm lg:justify-self-end" data-reveal data-reveal-delay="0.08">
            {resourcesPage.chooseText}
          </p>
        </div>

        <ol className="mt-14 border-t hairline lg:mt-20">
          {resources.items.map((r, i) => {
            const open = aperta === r.title;
            return (
              <li key={r.title} data-reveal data-reveal-delay={String(i * 0.04)} className="border-b hairline">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`modulo-${i}`}
                  onClick={() => setAperta(open ? null : r.title)}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-5 py-6 text-left transition-colors duration-500 hover:bg-ivory-2/40 md:grid-cols-[4rem_10rem_1fr_auto] md:gap-x-8 md:py-7 lg:-mx-4 lg:px-4"
                >
                  <span className="num text-[0.7rem] tracking-[0.2em] text-mute-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden md:block">
                    <span className="label !text-[0.625rem] text-ink">{r.kind}</span>
                    <span className="mt-1 block text-[0.75rem] text-mute-2">{r.meta}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="display display-sm block font-normal transition-transform duration-500 [transition-timing-function:var(--ease-premium)] group-hover:translate-x-2">
                      {r.title}
                    </span>
                    <span className="mt-2 block text-[0.9rem] text-mute md:hidden">
                      {r.kind} · {r.meta}
                    </span>
                    <span className="mt-2 block text-[0.9rem] leading-snug text-mute">{r.description}</span>
                  </span>
                  <span className="flex items-center gap-3 justify-self-end">
                    <span className="hidden rounded-full border border-sage-deep/30 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-sage-deep sm:inline-block">
                      {resourcesPage.free}
                    </span>
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 [transition-timing-function:var(--ease-premium)] ${
                        open ? "border-ink bg-ink text-ivory" : "border-ink/15 group-hover:bg-ink group-hover:text-ivory"
                      }`}
                    >
                      {open ? (
                        <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      )}
                    </span>
                    <span className="sr-only">{open ? resourcesPage.close : resourcesPage.open}</span>
                  </span>
                </button>

                {open && (
                  <div id={`modulo-${i}`} className="pb-8 lg:pb-10">
                    <Modulo risorsa={r} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Punto 32: il gratuito è anche il terreno di Millina. */}
        <div
          data-reveal
          className="mt-14 flex flex-col items-start gap-5 rounded-[1.25rem] border border-sage-deep/25 bg-sage-wash p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:mt-20"
        >
          <p className="max-w-xl text-[0.98rem] leading-snug text-ink">{resourcesPage.millina.text}</p>
          <Link to={resourcesPage.millina.cta.to} className="btn btn-primary shrink-0 !px-5 !py-3 !text-[0.85rem]">
            <span>{resourcesPage.millina.cta.label}</span>
            <ArrowUpRight className="btn-arrow h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
