# Mila Ecosystem

Evoluzione della web app [Mila Ecosystem](https://mila-ecosystem-growth.lovable.app/)
— *Empowerment femminile autentico* — secondo il brief di redesign 2026:
**non stravolgere, evolvere**. Identità visiva, atmosfera e struttura restano
quelle dell'app originale; cambiano ordine, linearità e interattività.

Tutti i contenuti (testi, aree, figure specialiste, storia, 23 frasi "Forse Mila
è per te se…", 8 testimonianze, 6 risorse gratuite, 4 libri, articoli del blog,
la lettera alla nonna, call iniziale, 8 pensieri, footer) sono quelli del sito
attuale, raccolti in un unico file: `src/data/content.ts`.

## Stack

Lo stesso del progetto originale (Vite + React + TypeScript + Tailwind +
lucide-react), più:

- **GSAP 3 + ScrollTrigger** per le animazioni scroll-driven (pin, scrub, parallax, reveal)
- **react-router-dom** per il routing (il componente `src/components/Link.tsx` incapsula il link: basta cambiare lì per passare a un altro router)
- **Inter** (UI e display) + **Fraunces** (titoli, come nell'originale) + **Caveat** (accento scritto a mano)

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
```

Banco di prova del motore di Millina (si lancia a ogni modifica del catalogo o
del lessico):

```bash
npm run millina
```

Le immagini ottimizzate in `public/images` sono generate dagli originali del
sito (cartella `_ref`, ignorata da git) con:

```bash
npm run images
```

Il logo (`public/images/logo-*.webp`) e le sue misure (`src/data/logo.ts`) sono
derivati da `_ref/logo-master.png`. Per sostituire il logo basta rimpiazzare
quel file e rilanciare: geometria, taglio del payoff e variante per fondo scuro
vengono misurati automaticamente dal canale alpha.

```bash
npm run logo
```

## Pagine

| Rotta | Cosa c'è | Punti del brief |
| --- | --- | --- |
| `/` | La homepage, 16 sezioni in ordine di lettura | 1-11 |
| `/percorsi` | Le due strade, Mila Reset, i tre livelli, il percorso su misura, la call | 12-14 |
| `/business` | Triskell: Academy e Agency | 15-17 |
| `/libreria` | I quattro titoli, con copertine provvisorie in tipografia | 18 |
| `/community` | Il salotto di Mila | 19 |
| `/dashboard` | L'area personale | 20-31, 33 |
| `/blog` | Pensieri di Mila: articoli e pensieri veloci | 32 |
| `/blog/lettera-a-mia-nonna` | La lettera per intero | 32 |
| `/risorse` | Le sei risorse gratuite, con il modulo di richiesta | 32 |

Restano segnaposto (`src/pages/Placeholder.tsx`): `/chi-sono`, `/viaggi`,
`/collaborazioni`, `/feedback`, `/login`.

## Struttura

```
src/
  data/content.ts        # tutti i contenuti del sito
  data/esempio.ts        # i dati di esempio dell'area personale, e nient'altro
  lib/gsap.ts            # registrazione plugin + easing "premium"
  lib/millina/           # il motore di Millina: lessico, catalogo, risposte, ruota
  lib/account/           # lo strato dati dell'area personale (vedi docs/)
  hooks/useGsap.ts       # gsap.matchMedia + cleanup, useReveal per [data-reveal]
  components/            # Navbar, Footer, Preloader, Atmosphere, Button, Link, Logo, Split, Millina
  sections/              # le sezioni della homepage, in ordine di lettura
  sections/dashboard/    # le zone dell'area personale
  sections/blog/         # articoli, pensieri, suggerimenti
  sections/risorse/      # l'elenco delle risorse con i moduli
  pages/                 # una per rotta
```

Due documenti di riferimento:

- [`docs/area-personale.md`](docs/area-personale.md) — com'è fatta l'area personale e **dove si innesta il server** (punto 34)
- [`docs/direzione-immagini.md`](docs/direzione-immagini.md) — la direzione delle immagini (punto 5)

### Sezioni della homepage (in ordine)

1. **Hero** — headline enorme parola per parola, arco fotografico asimmetrico con parallax, crop flottante, indicatore di scroll
2. **Manifesto** — sticky, titolo che si mette a fuoco (blur → nitido), statement illuminato parola per parola
3. **Ecosistema** — composizione art-directed: parola centrale stabile, figure che entrano da direzioni diverse e derivano con parallax
4. **Un mondo che cresce** — quello che l'ecosistema diventerà
5. **Le tre aree** — storytelling verticale sticky: mente, corpo, indipendenza economica (su mobile: narrativa impilata)
6. **Due strade** — la biforcazione dei percorsi
7. **La storia** — spread cinematografico: foto sticky con zoom e overlay, lettera che si rivela, pull-quote in serif
8. **Forse Mila è per te se…** — sezione pinnata: lo scroll verticale muove le 23 frasi in orizzontale (su touch: rail nativa con snap)
9. **Community** — collage editoriale con velocità di parallax diverse, titolo sovrapposto
10. **Storie** — citazioni tipografiche a tutta viewport (su touch: rail)
11. **In numeri** — i fatti della homepage con count-up
12. **Risorse gratuite** — indice editoriale, una riga per risorsa
13. **La call iniziale** — ritratto ad arco, agenda "Cosa vediamo insieme", fatti (45 minuti · In videocall · Gratuita)
14. **Costruiamo insieme** — statement fotografico full-bleed + modulo di feedback
15. **Pensieri** — marquee lento delle 8 citazioni
16. **CTA finale** — manifesto tipografico "Torna a scegliere te stessa."

### L'area personale (in ordine, punto 31)

Bentornata · frase del giorno · da dove vuoi partire (Ruota della Vita +
Millina) · i tuoi percorsi · la tua bacheca (prenotazioni, eventi, agenda) ·
il diario · accesso rapido · invita un'amica.

Senza account percorsi, prenotazioni ed eventi sono **vuoti per davvero**:
l'interruttore in cima accende dei dati di esempio dichiarati, per vedere l'area
da piena. Nessun sistema a punti, come chiede il brief.

## Accessibilità e motion

- HTML semantico, alt text, focus visibile, navigazione da tastiera (menu chiudibile con Esc)
- `prefers-reduced-motion: reduce`: le sezioni sticky/pinnate passano al layout impilato, i reveal sono disattivati, il marquee è fermo
- Animazioni solo su `transform`/`opacity` (unica eccezione: il blur del manifesto, solo desktop)
- I moduli validano in italiano, con i messaggi nello stile della pagina (`noValidate`) e `aria-invalid` sui campi
