// Generates optimized WebP variants from the original site assets in _ref/
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const jobs = [
  // [source, output name, width, height (optional), fit position]
  ["hero-women-community.png", "hero-circle", 1600, null, "attention"],
  ["hero-women-community.png", "hero-circle-portrait", 900, 1200, "attention"],
  ["mila-coaching.jpg", "coaching", 1600, null, "centre"],
  ["mila-coaching.jpg", "coaching-square", 900, 900, "attention"],
  ["founder-story.jpg", "founder-story", 1200, null, "centre"],
  ["community-donne-giardino.png", "garden-circle", 1000, null, "centre"],
  ["community-circle.jpg", "community-circle", 1600, null, "centre"],
  ["community-circle.jpg", "community-circle-crop", 900, 1100, "right"],
  ["martina-call.jpg", "martina-call", 900, null, "centre"],
];

await mkdir("public/images", { recursive: true });
for (const [src, name, w, h, pos] of jobs) {
  const img = sharp(`_ref/${src}`);
  const resized = h
    ? img.resize(w, h, { fit: "cover", position: pos })
    : img.resize({ width: w, withoutEnlargement: true });
  await resized.webp({ quality: 82 }).toFile(`public/images/${name}.webp`);
  const meta = await sharp(`public/images/${name}.webp`).metadata();
  console.log(`${name}.webp ${meta.width}x${meta.height}`);
}
