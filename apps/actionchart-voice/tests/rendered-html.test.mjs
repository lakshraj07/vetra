import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const route = await readFile(
  new URL("../app/api/voice/session/route.ts", import.meta.url),
  "utf8",
);

test("replaces the starter with the complete ActionChart surface", () => {
  assert.match(layout, /ActionChart Voice/);
  assert.match(page, /Patient memory/);
  assert.match(page, /Call logged and triaged/);
  assert.match(page, /Vetra front-door workflow/);
  assert.match(page, /Encounter replay/);
  assert.match(page, /Action review/);
  assert.match(page, /SOAP snapshot/);
  assert.match(page, /FHIR draft queue/);
  assert.match(page, /Approved recap/);
  assert.match(page, /Synthetic FHIR R4/);
  assert.doesNotMatch(page, /SkeletonPreview|Your site is taking shape/);
});

test("documents the deferred voice boundary without logging transcript text", () => {
  assert.match(route, /config_required/);
  assert.match(route, /validateVoiceSessionInput/);
  assert.match(route, /status: 501/);
  assert.doesNotMatch(route, /console\.(log|error)|transcript\.text/);
});
