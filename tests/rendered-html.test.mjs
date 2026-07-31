import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/artists") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
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
