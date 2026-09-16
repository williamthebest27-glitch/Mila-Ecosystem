/**
 * Banco di prova del motore di Millina. Si lancia con `npm run millina`.
 *
 * Serve ogni volta che cambia il catalogo o il lessico: un'assistente che
 * orienta all'acquisto può sbagliare in modo silenzioso — consigliare il
 * percorso più caro a chi ha solo detto che sta male, o un libro a chi ha
 * un'azienda senza clienti — e nessuno se ne accorge finché non lo fa con una
 * persona vera. La regola di proporzione è verificata esplicitamente in fondo.
 */
import { respond, explain } from "./engine";
import { analyseWheel, WHEEL, wheelOpening } from "./wheel";

const casi: Array<[string, string]> = [
  ["sto uscendo da una relazione tossica e non riesco a staccarmi", "sfogo emotivo -> passo leggero, MAI Ascesa"],
  ["mi sento sola, nessuno mi capisce", "solitudine -> community"],
  ["ho ansia e sto male da mesi", "fragilita -> gratuito"],
  ["vorrei costruire la mia indipendenza economica ma non so da dove partire", "pratico"],
  ["ho un'attivita' ma non arrivano clienti", "commerciale -> Agency ammessa"],
  ["voglio imparare il marketing e l'intelligenza artificiale", "competenze -> Academy"],
  ["ho gia' provato di tutto, ho bisogno di qualcuno che mi segua", "accompagnata -> call in cima"],
  ["quanto costa? non posso permettermi molto", "budget -> solo gratuito"],
  ["odio il mio corpo e mi vedo male allo specchio", "corpo"],
  ["ciao", "troppo poco -> domanda"],
  ["non so da dove partire", "direzione"],
];

let ok = 0, ko = 0;
for (const [testo, atteso] of casi) {
  const r = respond(testo);
  const e = explain(testo);
  console.log("\n> " + testo);
  console.log("  atteso: " + atteso);
  if (r.kind === "question") {
    console.log("  DOMANDA: " + r.text);
  } else {
    console.log("  capito : " + e.reading.needs.map(n => n.need.id).slice(0,2).join(", ")
      + " | prontezza " + e.reading.readiness + " | tetto " + e.cap
      + (e.reading.budgetSensitive ? " | budget" : ""));
    console.log("  echo   : " + r.echo);
    console.log("  PROPONE: " + r.main.name + "  (impegno " + r.main.commitment + ")");
    console.log("  altre  : " + r.alternatives.map(a => a.name + "[" + a.commitment + "]").join(", "));
    console.log("  passo  : " + r.nextStep.name + " (impegno " + r.nextStep.commitment + ")");
    if (r.main.commitment > e.cap) { console.log("  !! SFORA IL TETTO"); ko++; } else ok++;
  }
}

// Controllo di sicurezza: nessuno sfogo emotivo deve mai far uscire un impegno alto
const sfoghi = ["sto male", "ho ansia", "mi sento sola", "sono confusa e persa", "piango sempre"];
console.log("\n=== regola di proporzione ===");
for (const s of sfoghi) {
  const r = respond(s);
  const imp = r.kind === "suggestion" ? r.main.commitment : "domanda";
  const esito = r.kind === "question" || r.main.commitment <= 1 ? "ok" : "VIOLATA";
  if (esito !== "ok") ko++; else ok++;
  console.log("  " + s.padEnd(26) + " -> " + (r.kind==="suggestion"? r.main.name : "domanda") + " (impegno " + imp + ") " + esito);
}

// Ruota della Vita
console.log("\n=== Ruota della Vita ===");
const bassoOvunque: Record<string, number> = {}; WHEEL.forEach(w => bassoOvunque[w.id] = 3);
const unaBuca: Record<string, number> = {}; WHEEL.forEach(w => unaBuca[w.id] = 8); unaBuca["economica"] = 2;
for (const [nome, sc] of [["fatica ovunque", bassoOvunque], ["una sola buca (economica)", unaBuca]] as const) {
  const res = analyseWheel(sc)!;
  console.log("  " + nome + ": media " + res.average + " | piu' bassa: " + res.weakest.name
    + " | area " + res.area + " | prontezza " + res.readiness);
  console.log("    apertura: " + wheelOpening(res));
  console.log("    propone : " + (res.main?.name ?? "-") + " (impegno " + (res.main?.commitment ?? "-") + ")");
}
console.log("\nesiti: " + ok + " ok, " + ko + " problemi");

if (ko > 0) process.exitCode = 1;
