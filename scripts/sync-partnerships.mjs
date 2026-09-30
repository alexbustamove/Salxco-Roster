import fs from "node:fs/promises";

const sourceUrl = "https://salxco.com/partnerships/";
const outputPath = new URL("../app/data/partnerships.ts", import.meta.url);

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Unable to load ${sourceUrl}: ${response.status}`);
}

const html = await response.text();
const entryPattern = /<a[^>]*data-image-id="([^"]+)"[^>]*href="([^"]+)"[^>]*><\/a>\s*<img[^>]*title="([^"]*)"[^>]*src="([^"]+)"/g;

function decodeHtml(value) {
  let decoded = value;
  for (let pass = 0; pass < 3; pass += 1) {
    decoded = decoded
      .replaceAll("&amp;", "&")
      .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
      .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)))
      .replaceAll("&quot;", '"')
      .replace(/&#039;|&apos;/g, "'")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
  }
  return decoded;
}

const items = [...html.matchAll(entryPattern)].map((match, index) => ({
  id: match[1],
  title: decodeHtml(match[3]).trim() || `Partnership ${index + 1}`,
  href: decodeHtml(match[2]),
  image: decodeHtml(match[4]),
}));

if (items.length === 0) {
  throw new Error("No partnership entries were found; the source page structure may have changed.");
}

const file = `export type PartnershipItem = {\n  id: string;\n  title: string;\n  href: string;\n  image: string;\n};\n\nexport const partnershipItems: PartnershipItem[] = ${JSON.stringify(items, null, 2)};\n`;

await fs.writeFile(outputPath, file);
console.log(`Wrote ${items.length} partnership entries to ${outputPath.pathname}`);
