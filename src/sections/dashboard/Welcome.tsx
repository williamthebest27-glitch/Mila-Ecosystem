import { useEffect, useRef, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { setName, useAccount } from "@/lib/account/store";
import { dashboard } from "@/data/content";
import { SplitWords } from "@/components/Split";

/**
 * "Bentornata" — la prima riga della dashboard immaginata dal punto 31.
 *
 * Un saluto senza nome è un saluto a metà, e il nome non si può inventare:
 * l'accesso non esiste ancora. Quindi lo si chiede, una volta, e resta su
 * questo dispositivo — con scritto chiaramente che è lì che resta. Il giorno
 * in cui c'è l'account, il nome arriva dal profilo e questo pezzo di
 * interfaccia sparisce da solo.
 *
 * Il saluto funziona anche senza nome: chi non ha voglia di scriverlo legge
 * "Bentornata." e va avanti. Nessun modulo obbligatorio per entrare in casa
 * propria.
 */
export function Welcome() {
  const { name } = useAccount();
  const [aperto, setAperto] = useState(false);
  const [bozza, setBozza] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aperto) inputRef.current?.focus();
  }, [aperto]);

  function conferma(e: React.FormEvent) {
    e.preventDefault();
    setName(bozza);
    setAperto(false);
  }

  return (
    <>
      <p data-db-label className="label">
        {dashboard.label}
      </p>

      <h1 id="dashboard-title" data-db-title className="display display-xl mt-6 max-w-[14ch]">
        <span className="block">
          <SplitWords text={name ? `${dashboard.greeting},` : `${dashboard.greeting}.`} />
        </span>
        {name && <span className="serif-accent block text-sage-deep">{name}.</span>}
      </h1>

      <p data-db-lede className="lede mt-7 max-w-xl">
        {dashboard.lede}
      </p>

      {/* Il nome: chiesto una volta, mai preteso. */}
      <div data-db-lede className="mt-5">
        {aperto ? (
          <form onSubmit={conferma} className="flex flex-wrap items-center gap-3">
            <label htmlFor="nome" className="sr-only">
              {dashboard.name.label}
            </label>
            <input
              ref={inputRef}
              id="nome"
              value={bozza}
              onChange={(e) => setBozza(e.target.value)}
              maxLength={40}
              autoComplete="given-name"
              placeholder={dashboard.name.placeholder}
              className="w-48 rounded-full border border-ink/15 bg-ivory px-4 py-2 text-[0.95rem] text-ink outline-none transition-colors duration-300 placeholder:text-mute-2 focus:border-sage-deep/50"
            />
            <button type="submit" className="btn btn-primary !px-5 !py-2.5 !text-[0.85rem]">
              <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>{dashboard.name.save}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBozza(name);
                setAperto(false);
              }}
              className="link-underline text-[0.85rem] font-medium text-mute"
            >
              {dashboard.name.cancel}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setBozza(name);
              setAperto(true);
            }}
            className="link-underline inline-flex items-center gap-2 text-[0.9rem] font-medium text-mute"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            {name ? dashboard.name.change : dashboard.name.ask}
          </button>
        )}
        <p className="mt-3 max-w-md text-[0.78rem] leading-snug text-mute-2">{dashboard.name.note}</p>
      </div>
    </>
  );
}
