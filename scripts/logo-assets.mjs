// Derives the site logo assets from the master artwork in _ref/logo-master.png.
// Run with `npm run logo`.
//
// Three outputs:
//   logo-full        the complete banner, for the intro screen
//   logo-lockup      emblem + wordmark, for the header
//   logo-lockup-dark the same lockup re-coloured for the dark glass header
//
// The tagline is dropped from the header lockup: at ~40px tall it renders as an
// illegible smudge. The emblem reads well on both backgrounds, so only the
// wordmark is re-coloured for the dark variant.
//
// Everything is measured off the alpha channel rather than hard-coded, so
// dropping in new artwork and re-running is enough. Aspect ratios and the
// wordmark span are written to src/data/logo.ts for the components to import.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "_ref/logo-master.png";
const OUT = "public/images";

const IVORY = [250, 244, 243]; // --color-ivory
const SAGE_ON_DARK = [198, 214, 194]; // --color-sage, lightened for ink glass
const ON = 24; // alpha above which a pixel counts as artwork

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const clamp8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

/** Bounding box of everything that is not fully transparent. */
function alphaBox(px, W, H, thr = 3) {
  let x0 = W;
  let y0 = H;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (px[(y * W + x) * 4 + 3] <= thr) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { x0, y0, x1, y1 };
}

/** Contiguous runs of `true`, longer than `min`. */
function runs(flags, min = 1) {
  const out = [];
  let open = null;
  flags.forEach((on, i) => {
    if (on) {
      if (open === null) open = i;
    } else if (open !== null) {
      if (i - open > min) out.push({ from: open, to: i - 1 });
      open = null;
    }
  });
  if (open !== null && flags.length - open > min) out.push({ from: open, to: flags.length - 1 });
  return out;
}

/**
 * Locates the emblem, the logotype and the tagline.
 *
 * The far right of the banner only ever holds type, so row bands measured there
 * separate the wordmark from the tagline cleanly. The emblem is then whatever
 * climbs above the wordmark's cap line — that is what makes it the emblem —
 * which gives its right edge without having to guess at letter spacing.
 */
function measure(px, W, H, box) {
  const at = (x, y) => px[(y * W + x) * 4 + 3] > ON;
  const width = box.x1 - box.x0 + 1;
  const margin = Math.round(H * 0.012);

  const typeOnly = box.x0 + Math.round(width * 0.55);
  const rows = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = typeOnly; x <= box.x1; x++) if (at(x, y)) n++;
    rows.push(n > 2);
  }
  const bands = runs(rows, 2);
  if (!bands.length) throw new Error("no type found on the right of the banner");
  const wordmark = bands.reduce((a, b) => (b.to - b.from > a.to - a.from ? b : a));
  const tagline = bands.find((b) => b.from > wordmark.to) ?? null;

  const capLine = Math.max(box.y0, wordmark.from - margin);
  let emblemRight = box.x0;
  for (let x = box.x0; x <= box.x1; x++) {
    for (let y = box.y0; y < capLine; y++) {
      if (at(x, y)) {
        emblemRight = x;
        break;
      }
    }
  }
  const split = emblemRight + Math.max(2, Math.round(width * 0.003));

  let x0 = box.x1;
  let x1 = box.x0;
  for (let x = split; x <= box.x1; x++) {
    for (let y = wordmark.from; y <= wordmark.to; y++) {
      if (!at(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      break;
    }
  }

  return {
    split,
    emblemRight,
    wordmark: {
      x0,
      x1,
      y0: Math.max(0, wordmark.from - margin),
      y1: Math.min(H - 1, wordmark.to + margin),
    },
    tagline: tagline
      ? {
          x0: split,
          y0: Math.max(0, tagline.from - margin),
          x1: W - 1,
          y1: Math.min(H - 1, tagline.to + margin),
        }
      : null,
  };
}

function clearRect(px, W, r) {
  for (let y = r.y0; y <= r.y1; y++) {
    for (let x = r.x0; x <= r.x1; x++) px[(y * W + x) * 4 + 3] = 0;
  }
}

/**
 * Re-colours the logotype for ink backgrounds. The glyphs are flat two-colour
 * type and the alpha channel already carries the antialiasing, so replacing the
 * fill outright keeps the letterforms crisp. A little of the original modelling
 * is kept so the type does not go dead flat.
 */
function recolourWordmark(px, W, geo) {
  for (let y = geo.wordmark.y0; y <= geo.wordmark.y1; y++) {
    for (let x = geo.split; x < W; x++) {
      const i = (y * W + x) * 4;
      if (px[i + 3] === 0) continue;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const sage = g - (r + b) / 2 > 8;
      const target = sage ? SAGE_ON_DARK : IVORY;
      const shade = Math.min(1.06, 0.88 + (lum(r, g, b) / (sage ? 150 : 70)) * 0.12);
      for (let c = 0; c < 3; c++) px[i + c] = clamp8(target[c] * shade);
    }
  }
}

function crop(px, W, box) {
  const w = box.x1 - box.x0 + 1;
  const h = box.y1 - box.y0 + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    px.copy(out, y * w * 4, ((y + box.y0) * W + box.x0) * 4, ((y + box.y0) * W + box.x1 + 1) * 4);
  }
  return { data: out, width: w, height: h };
}

async function emit(name, { data, width, height }, targetW) {
  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize({ width: targetW, withoutEnlargement: true })
    .webp({ quality: 94, alphaQuality: 100, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);
  const m = await sharp(`${OUT}/${name}.webp`).metadata();
  console.log(`${name}.webp  ${m.width}x${m.height}  (ratio ${(m.width / m.height).toFixed(4)})`);
  return m;
}

await mkdir(OUT, { recursive: true });
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

const fullBox = alphaBox(data, W, H);
const geo = measure(data, W, H, fullBox);
console.log("measured", JSON.stringify({ fullBox, ...geo }));

/** The logotype's span, as a fraction of a cropped output's width. */
const span = (box) => {
  const w = box.x1 - box.x0 + 1;
  return { start: (geo.wordmark.x0 - box.x0) / w, end: (geo.wordmark.x1 - box.x0 + 1) / w };
};

// 1. Full banner.
const full = await emit("logo-full", crop(data, W, fullBox), 1500);

// 2. Header lockup.
const lockup = Buffer.from(data);
if (geo.tagline) clearRect(lockup, W, geo.tagline);
const lockBox = alphaBox(lockup, W, H);
const lock = await emit("logo-lockup", crop(lockup, W, lockBox), 760);

// 3. Header lockup on ink.
recolourWordmark(lockup, W, geo);
await emit("logo-lockup-dark", crop(lockup, W, lockBox), 760);

const fullSpan = span(fullBox);
const lockSpan = span(lockBox);
await writeFile(
  "src/data/logo.ts",
  `// Generated by scripts/logo-assets.mjs — do not edit by hand. Run \`npm run logo\`.
//
// \`wordmark\` is where the logotype sits inside the artwork, as a fraction of
// the image width: it starts at the left edge of the "M" of Mila and ends at
// the right edge of the "m" of Ecosystem.

export const logoFull = {
  src: "/images/logo-full.webp",
  ratio: ${(full.width / full.height).toFixed(4)},
  wordmark: { start: ${fullSpan.start.toFixed(4)}, end: ${fullSpan.end.toFixed(4)} },
} as const;

export const logoLockup = {
  src: "/images/logo-lockup.webp",
  srcDark: "/images/logo-lockup-dark.webp",
  ratio: ${(lock.width / lock.height).toFixed(4)},
  wordmark: { start: ${lockSpan.start.toFixed(4)}, end: ${lockSpan.end.toFixed(4)} },
} as const;
`,
  "utf8",
);
console.log("src/data/logo.ts written");
