import { Fragment } from "react";

/**
 * Splits a string into masked lines of words so GSAP can reveal
 * word-by-word. Each word is `.split-word` inside a `.split-line` mask.
 */
export function SplitWords({
  text,
  as: Tag = "span",
  className = "",
  wordClass = "",
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "p" | "div";
  className?: string;
  wordClass?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.28em] -mb-[0.28em]" aria-hidden="true">
            <span className={`split-word ${wordClass}`}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * Splits a string into characters (`.split-char`) for the few big
 * titles that use a character reveal.
 */
export function SplitChars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="split-char" aria-hidden="true">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
