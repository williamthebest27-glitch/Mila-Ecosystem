import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "./Link";
import { Sparkles } from "./Atmosphere";

type Props = {
  to: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light" | "ghost-light";
  arrow?: "right" | "up" | "none";
  className?: string;
  size?: "md" | "lg";
  /**
   * Trattamento prezioso per le pochissime azioni che devono attirare lo
   * sguardo: contorno dorato, alone che pulsa, riflesso e brillantini.
   *
   * `"quiet"` toglie i brillantini e tiene solo contorno, alone e respiro —
   * da usare nella barra fissa e dove intorno c'è già dell'atmosfera, così
   * due effetti non si accavallano nella stessa schermata.
   *
   * Va riservato a una CTA per schermata: se brilla tutto non brilla niente.
   */
  highlight?: boolean | "quiet";
};

/**
 * Seme stabile ricavato dalla destinazione (FNV-1a): due CTA diverse hanno
 * trame di brillantini diverse, ma la stessa CTA è identica a ogni render.
 */
function seedFrom(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 9973) + 1;
}

export function Button({
  to,
  children,
  variant = "primary",
  arrow = "right",
  className = "",
  size = "md",
  highlight = false,
}: Props) {
  const sizeCls = size === "lg" ? "!px-7 !py-[1.15rem] !text-base" : "";
  const link = (
    <Link to={to} className={`btn btn-${variant} ${sizeCls} ${highlight ? "btn-gilded" : ""} ${className}`}>
      <span>{children}</span>
      {arrow === "right" && <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
      {arrow === "up" && <ArrowUpRight className="btn-arrow h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
    </Link>
  );

  if (!highlight) return link;

  // Alone e brillantini stanno su un contenitore, non sul bottone: il respiro
  // usa `transform` e schiaccerebbe il sollevamento in hover di `.btn`.
  return (
    <span className="cta-gilded">
      <span className="cta-halo" aria-hidden="true" />
      {highlight !== "quiet" && (
        <Sparkles
          count={6}
          seed={seedFrom(to)}
          tone="gold"
          minSize={6}
          maxSize={13}
          className="!-inset-5 !overflow-visible"
        />
      )}
      {link}
    </span>
  );
}
