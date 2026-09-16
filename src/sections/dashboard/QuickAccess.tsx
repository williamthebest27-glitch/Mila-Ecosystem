import { ArrowUpRight } from "lucide-react";
import { doors } from "@/data/content";
import { Link } from "@/components/Link";
import { Card } from "./kit";

/**
 * "Accesso rapido" (punto 31) e, dentro, il punto 33: le tredici cose che si
 * possono fare qui dentro, presentate in maniera ordinata.
 *
 * L'ordine è per quanto chiedono, dal niente al molto. È l'unico ordine che
 * serve a chi non sa ancora cosa vuole — un elenco per categoria di prodotto
 * gli chiederebbe di sapere già come è fatto l'ecosistema.
 *
 * Ogni voce porta in una pagina che esiste: l'elenco è diventato scrivibile
 * solo adesso che blog e risorse gratuite non sono più dei vicoli ciechi.
 */
export function QuickAccess() {
  return (
    <Card id="porte" title={doors.label} note={doors.note} ground="sand">
      <div className="mt-7 grid gap-7">
        {doors.groups.map((gruppo) => (
          <div key={gruppo.name}>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-mute-2">{gruppo.name}</p>

            <ul className="mt-2 border-t hairline">
              {gruppo.items.map((porta) => (
                <li key={`${gruppo.name}-${porta.name}`}>
                  <Link
                    to={porta.to}
                    className="group flex items-center justify-between gap-4 border-b hairline py-3 transition-colors duration-500 [transition-timing-function:var(--ease-premium)] hover:border-sage-deep/40"
                  >
                    <span className="min-w-0 text-[0.92rem] leading-snug">
                      <span className="text-sage-deep">{porta.verb}</span>
                      <span className="text-mute-2"> · </span>
                      <span className="text-ink transition-transform duration-500 [transition-timing-function:var(--ease-premium)] group-hover:translate-x-0.5 inline-block">
                        {porta.name}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 text-mute-2 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
