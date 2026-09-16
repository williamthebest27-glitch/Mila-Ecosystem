// Esegue il banco di prova del motore di Millina fuori dal browser.
// Usa esbuild, che è già una dipendenza di Vite, per risolvere TypeScript e
// l'alias "@" senza aggiungere strumenti al progetto.
import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const dir = await mkdtemp(path.join(tmpdir(), "millina-"));
const out = path.join(dir, "check.cjs");

await build({
  entryPoints: ["src/lib/millina/check.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: out,
  alias: { "@": path.resolve("src") },
  logLevel: "error",
});

const { default: run } = await import(`file://${out}`).catch(async (e) => {
  await rm(dir, { recursive: true, force: true });
  throw e;
});
void run;
await rm(dir, { recursive: true, force: true });
