/**
 * One-way gate between the intro screen and the page behind it, so the hero
 * choreography starts on the frame the intro finishes rather than playing out
 * unseen underneath it.
 */
let done = false;
let guard: number | undefined;
const waiting = new Set<() => void>();

/** Opens the gate. Safe to call more than once. */
export function completeIntro() {
  if (done) return;
  done = true;
  if (guard !== undefined) window.clearTimeout(guard);
  waiting.forEach((fn) => fn());
  waiting.clear();
}

/**
 * Runs `fn` once the intro has lifted, or straight away if it already has.
 * Returns an unsubscribe. A watchdog opens the gate regardless after ten
 * seconds — comfortably past the intro's own backstop — so a page that never
 * mounted an intro at all can still reveal itself.
 */
export function onIntroDone(fn: () => void): () => void {
  if (done) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  if (guard === undefined) guard = window.setTimeout(completeIntro, 10000);
  return () => {
    waiting.delete(fn);
  };
}
