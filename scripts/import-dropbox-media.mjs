import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const sourceDirectory = process.argv[2];

if (!sourceDirectory) {
  throw new Error("Usage: node scripts/import-dropbox-media.mjs <source-directory>");
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(projectRoot, "public", "media");
const dataPath = path.join(projectRoot, "app", "data", "lifestyleMedia.ts");
const supportedExtensions = new Set([".jpeg", ".jpg", ".png", ".webp"]);

function toSlug(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const entries = (await fs.readdir(sourceDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
  .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base", numeric: true }));

if (entries.length === 0) {
  throw new Error(`No supported media images found in ${sourceDirectory}`);
}

await fs.mkdir(outputDirectory, { recursive: true });

const items = [];
const slugs = new Set();

for (const entry of entries) {
  const title = path.basename(entry.name, path.extname(entry.name)).trim();
  const slug = toSlug(title);

  if (!slug || slugs.has(slug)) {
    throw new Error(`Duplicate or invalid media slug for ${entry.name}: ${slug}`);
  }

  slugs.add(slug);
  const outputName = `${slug}.jpg`;
  const publicPath = `/media/${outputName}`;

  await sharp(path.join(sourceDirectory, entry.name))
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outputDirectory, outputName));

  items.push({
    id: slug,
    title,
    href: publicPath,
    image: publicPath,
  });
}

const file = `export type LifestyleMediaItem = {\n  id: string;\n  title: string;\n  href: string;\n  image: string;\n};\n\nexport const lifestyleMediaItems: LifestyleMediaItem[] = ${JSON.stringify(items, null, 2)};\n`;

await fs.writeFile(dataPath, file);
console.log(`Imported ${items.length} media images into ${outputDirectory}`);
