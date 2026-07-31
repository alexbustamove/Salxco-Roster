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

test("server-renders the complete SALXCO roster", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SALXCO — Artist Roster<\/title>/i);
  assert.match(html, /<span>The<\/span><span>Roster\.<\/span>/);
  assert.match(html, /Full service management for world-class talent\./);
  assert.match(
    html,
    /<h1[^>]*><span>The<\/span><span>Roster\.<\/span><\/h1><\/div><p[^>]*>Full service management for world-class talent\.<\/p>/,
  );
  assert.doesNotMatch(
    html,
    /Artists, creators, producers, and culture-shapers represented with intention\./,
  );
  assert.match(html, /The Weeknd/);
  assert.match(html, />Nav</);
  assert.match(html, /Kriss/);
  assert.match(html, /Search artists/);
  assert.match(html, /Producers &amp; Songwriters/);
  assert.match(html, /https:\/\/www\.instagram\.com\/theweeknd\//);
  assert.match(html, /Open The Weeknd on Instagram/);
  assert.match(html, /https:\/\/www\.instagram\.com\/b2thar\?igsh=NTc4MTIwNjQ2YQ==/);
  assert.match(html, /https:\/\/www\.instagram\.com\/brandon_arreaga\?igsh=NTc4MTIwNjQ2YQ==/);
  assert.match(html, /https:\/\/www\.instagram\.com\/krissm\.e\?igsh=NTc4MTIwNjQ2YQ==/);
  assert.match(html, /salxco-logo-white\.png/);
  assert.match(
    html,
    /<span>Copyright © 2026 SALXCO \| XO MGMT\.<\/span><span>All rights reserved\.<\/span>/,
  );
  assert.doesNotMatch(html, /Artist Management|Los Angeles|Est\. 2018/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders a direct artist profile URL", async () => {
  const response = await render("/artists/law-roach");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Law Roach/);
  assert.match(html, /Fashion &amp; Creative/);
  assert.match(html, /Representation inquiries available by request/);
});
