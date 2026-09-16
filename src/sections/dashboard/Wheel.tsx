import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { analyseWheel, WHEEL, wheelOpening, type WheelScores } from "@/lib/millina/wheel";
import { MillinaFace } from "@/components/Millina";
import { Link } from "@/components/Link";

/**
 * Punto 23 — la Ruota della Vita.
 *
 * Dieci voci da 1 a 10, poi Millina legge il risultato. Non è un quiz a parte
 * con una sua logica: il risultato entra nello stesso motore che ascolta le
 * parole, così le due porte d'ingresso non possono dare consigli discordanti.
 *
 * Il valore iniziale è 5 e non 1: partire dal minimo suggerisce che il difetto
 * sia lo stato normale, e per dieci voci di seguito è un messaggio pesante da
 * dare a qualcuno che sta già facendo fatica.
 */
export function Wheel() {
  const [scores, setScores] = useState<WheelScores>(() =>
    Object.fromEntries(WHEEL.map((s) => [s.id, 5])),
  );
  const [done, setDone] = useState(false);
  const result = useMemo(() => (done ? analyseWheel(scores) : null), [done, scores]);

  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-ivory p-6 sm:p-8">
      <p className="label">La Ruota della Vita</p>
      <p className="mt-3 max-w-xl text-[0.95rem] leading-snug text-mute">
        Quanto ti senti a posto, oggi, in ciascuna di queste dieci aree? Non pensarci troppo: conta la prima
        sensazione, non l'analisi.
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-x-10">
        {WHEEL.map((slice) => (
          <li key={slice.id}>
            <label className="flex items-baseline justify-between gap-4" htmlFor={`wheel-${slice.id}`}>
              <span className="text-[0.95rem] font-medium text-ink">{slice.name}</span>
              <span className="num text-[0.95rem] tabular-nums text-sage-deep">{scores[slice.id]}</span>
            </label>
            <input
              id={`wheel-${slice.id}`}
              type="range"
              min={1}
              max={10}
              step={1}
              value={scores[slice.id]}
              onChange={(e) => {
                const v = Number(e.target.value);
                setScores((prev) => ({ ...prev, [slice.id]: v }));
                setDone(false);
              }}
              className="wheel-range mt-2 w-full"
              aria-describedby={`wheel-${slice.id}-hint`}
            />
            <span id={`wheel-${slice.id}-hint`} className="sr-only">
              Da 1, per niente, a 10, molto.
            </span>
          </li>
        ))}
      </ul>

      {!done && (
        <button
          type="button"
          onClick={() => setDone(true)}
          className="btn btn-primary btn-gilded mt-9"
        >
          <span>Fai leggere il risultato a Millina</span>
        </button>
      )}

      {result && (
        <div className="mt-10 rounded-[1.25rem] border border-sage-deep/25 bg-sage-wash p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <MillinaFace className="h-9 w-9" />
            <p className="label !text-[0.625rem]">Millina legge il risultato</p>
          </div>

          <p className="mt-5 text-[1.05rem] leading-snug text-ink">{wheelOpening(result)}</p>

          <p className="mt-4 text-[0.95rem] leading-snug text-mute">
            La voce più bassa è <strong className="font-medium text-ink">{result.weakest.name}</strong>
            {result.alsoLow.length > 0 && (
              <>
                , e lì vicino ci sono anche{" "}
                {result.alsoLow.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && (i === result.alsoLow.length - 1 ? " e " : ", ")}
                    <strong className="font-medium text-ink">{s.name.toLowerCase()}</strong>
                  </span>
                ))}
              </>
            )}
            . La media che hai segnato è <span className="num">{result.average}</span>.
          </p>

          {result.main && (
            <>
              <p className="serif-accent mt-6 text-[1.15rem] text-sage-deep">Da qui ti consiglierei di partire:</p>
              <Link
                to={result.main.to}
                className="card-hover group mt-3 block rounded-[1.1rem] border border-sage-deep/30 bg-ivory p-5 hover:border-sage-deep/60"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-[1.05rem] font-medium tracking-[-0.015em]">{result.main.name}</span>
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ink group-hover:text-ivory">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-2 block text-[0.9rem] leading-snug text-mute">{result.main.line}</span>
              </Link>
            </>
          )}

          {result.alternatives.length > 0 && (
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.85rem] text-mute-2">
              <span>Oppure:</span>
              {result.alternatives.map((alt) => (
                <Link key={alt.id} to={alt.to} className="link-underline font-medium text-mute">
                  {alt.name}
                </Link>
              ))}
            </p>
          )}

          <button
            type="button"
            onClick={() => setDone(false)}
            className="link-underline mt-7 text-[0.85rem] font-medium text-mute"
          >
            Rifai la ruota
          </button>
        </div>
      )}
    </div>
  );
}
