# Mila Ecosystem — Homepage

Ricostruzione completa della homepage di [Mila Ecosystem](https://mila-ecosystem-growth.lovable.app/) — *Empowerment femminile autentico* — con una nuova architettura visiva e un'esperienza scroll-driven.

Tutti i contenuti (testi, aree, figure specialiste, storia, 23 frasi "Forse Mila è per te se…", 8 testimonianze, 6 risorse gratuite, call iniziale, "Costruiamo insieme", 8 pensieri, footer) sono quelli del sito attuale, raccolti in un unico file: `src/data/content.ts`.

## Stack

Lo stesso del progetto originale (Vite + React + TypeScript + Tailwind + lucide-react), più:

- **GSAP 3 + ScrollTrigger** per le animazioni scroll-driven (pin, scrub, parallax, reveal)
- **react-router-dom** per il routing (il componente `src/components/Link.tsx` incapsula il link: basta cambiare lì per passare a un altro router)
- **Inter** (UI e display) + **Fraunces** italic (accenti editoriali)

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
```

Le immagini ottimizzate in `public/images` sono generate dagli originali del sito (cartella `_ref`, ignorata da git) con:

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

## Struttura

```
src/
  data/content.ts        # tutti i contenuti della homepage
  lib/gsap.ts            # registrazione plugin + easing "premium"
  hooks/useGsap.ts       # gsap.matchMedia + cleanup, useReveal per [data-reveal]
  components/            # Navbar, Footer, Cursor, Button, Link, Logo, Split
  sections/              # le 14 sezioni della homepage, in ordine di lettura
  pages/Home.tsx         # composizione della homepage
  pages/Placeholder.tsx  # stub per le rotte dell'app completa (/percorsi, /community, …)
```

### Sezioni (in ordine)

1. **Hero** — headline enorme parola per parola, arco fotografico asimmetrico con parallax, crop flottante, indicatore di scroll
2. **Manifesto** — sticky scuro, titolo che si mette a fuoco (blur → nitido), statement illuminato parola per parola
3. **Ecosistema** — composizione art-directed: parola centrale stabile, 7 figure che entrano da direzioni diverse e derivano con parallax
4. **Le tre aree** — storytelling verticale sticky: numero 01/02/03, contenuto e immagine che cambiano con lo scroll (su mobile: narrativa impilata)
5. **La storia** — spread cinematografico: foto sticky con zoom e overlay, lettera che si rivela, pull-quote in serif
6. **Forse Mila è per te se…** — sezione pinnata: lo scroll verticale muove le 23 frasi in orizzontale (su touch: rail nativa con snap)
7. **Community** — collage editoriale con velocità di parallax diverse, titolo sovrapposto
8. **Storie** — citazioni tipografiche a tutta viewport, entrano da sinistra ed escono verso l'alto (su touch: rail)
9. **In numeri** — i fatti già presenti nella homepage (3 aree, 7 figure, 6 risorse, 45 min, 17–62 anni) con count-up
10. **Risorse gratuite** — indice editoriale, una riga per risorsa
11. **La call iniziale** — ritratto ad arco, agenda "Cosa vediamo insieme", fatti (45 minuti · In videocall · Gratuita)
12. **Costruiamo insieme** — statement fotografico full-bleed + modulo di feedback
13. **Pensieri** — marquee lento delle 8 citazioni
14. **CTA finale** — manifesto tipografico "Torna a scegliere te stessa." con scala e sfondo che cambiano
15. **Footer** — ridisegnato, senza griglia a 4 colonne

## Accessibilità e motion

- HTML semantico, alt text, focus visibile, navigazione da tastiera (menu chiudibile con Esc)
- `prefers-reduced-motion: reduce`: le sezioni sticky/pinnate passano al layout impilato, i reveal sono disattivati, il marquee è fermo
- Animazioni solo su `transform`/`opacity` (unica eccezione: il blur del manifesto, solo desktop)
