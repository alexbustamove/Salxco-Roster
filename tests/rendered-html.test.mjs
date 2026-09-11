import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { after, before, test } from "node:test";

const port = 4100 + (process.pid % 1000);
const origin = `http://127.0.0.1:${port}`;
let server;
let serverOutput = "";

before(async () => {
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  server.stdout.on("data", (chunk) => {
    serverOutput += chunk;
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk;
  });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready:\n${serverOutput}`);
    }
    try {
      const response = await fetch(`${origin}/artists`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Timed out waiting for Next.js:\n${serverOutput}`);
});

after(async () => {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await new Promise((resolve) => server.once("exit", resolve));
});

async function render(pathname = "/artists") {
  return fetch(`${origin}${pathname}`, {
    headers: { accept: "text/html" },
  });
}

test("server-renders the MGMT NATION roster sections", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>MGMT NATION Artist Roster<\/title>/i);
  assert.match(html, /property="og:title" content="MGMT NATION Artist Roster"/);
  assert.match(html, /<h1[^>]*>MGMT NATION Artist Roster<\/h1>/);
  assert.match(html, /class="intro-logo"[^>]*src="\/mgmt-nation-logo-white\.svg"/);
  assert.match(
    html,
    /<p class="intro-tagline"><span>Full Service Management<\/span><span>For World-Class Talent\.<\/span><\/p>/,
  );
  assert.doesNotMatch(
    html,
    /Artists, creators, producers, and culture-shapers represented with intention\./,
  );
  assert.match(html, /The Weeknd/);
  assert.match(html, />Nav</i);
  assert.match(html, /<div class="roster-status"[^>]*><span>Artists<\/span><\/div>/);
  assert.doesNotMatch(html, /Eryn Allen Kane|Breyan Isaac|Kriss/);
  assert.doesNotMatch(html, /class="card-index"|Search artists/);
  assert.doesNotMatch(html, /Open Love, Brandon on Instagram/);
  assert.match(html, />Artists<\/button>/);
  assert.match(html, />Producers &amp; Songwriters<\/button>/);
  assert.match(html, />Lifestyle<\/button>/);
  assert.match(html, /https:\/\/www\.instagram\.com\/theweeknd\//);
  assert.match(html, /Open The Weeknd on Instagram/);
  assert.match(html, /https:\/\/www\.instagram\.com\/unotopicmusica\?igsh=NTc4MTIwNjQ2YQ==/);
  assert.match(html, /class="card-name"><strong>Unotopic<\/strong><\/span>/);
  assert.doesNotMatch(html, /class="card-category"/);
  assert.doesNotMatch(html, /class="footer-brand-logo"/);
  assert.match(html, /class="back-to-top"[^>]*aria-label="Back to top"/);
  assert.match(html, /property="og:image" content="https:\/\/roster\.salxco\.com\/og-mgmt\.png\?v=4"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /rel="icon" href="\/favicon\.ico\?v=5"/);
  assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png\?v=5"/);
  assert.match(
    html,
    /<span>Copyright © 2026 MGMT NATION\.<\/span><span>All rights reserved\.<\/span>/,
  );
  assert.doesNotMatch(html, /Artist Management|Los Angeles|Est\. 2018/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders a direct artist profile URL", async () => {
  const response = await render("/artists/law-roach");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Law Roach/);
  assert.match(html, /Lifestyle/);
  assert.match(html, /Representation inquiries available by request/);
});

test("hidden artists are excluded from direct profile URLs", async () => {
  for (const slug of ["eryn-allen-kane", "breyan-isaac", "kriss"]) {
    const response = await render(`/artists/${slug}`);
    assert.equal(response.status, 404);
  }
});
