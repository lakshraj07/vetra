import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { extractActions } from "../lib/actions.ts";
import { validateVoiceSessionInput } from "../lib/voice-contract.ts";
import { buildFrontDeskCallLog } from "../lib/triage.ts";

const cases = JSON.parse(
  await readFile(new URL("../app/data/patients.generated.json", import.meta.url), "utf8"),
);
const ali = cases.find((patient) => patient.givenName === "Ali");

test("prepares the full synthetic cohort with unique FHIR references", () => {
  assert.equal(cases.length, 25);
  assert.equal(new Set(cases.map((patient) => patient.patientId)).size, 25);
  assert.equal(new Set(cases.map((patient) => patient.encounterId)).size, 25);
  assert.ok(cases.every((patient) => patient.patientReference.startsWith("Patient/")));
  assert.ok(cases.every((patient) => patient.encounterReference.startsWith("Encounter/")));
});

test("preserves Ali's returning-patient context and structured encounter", () => {
  assert.ok(ali);
  assert.equal(ali.age, 31);
  assert.match(ali.visitTitle, /migraine/i);
  assert.ok(ali.conditions.some((label) => /transport/i.test(label)));
  assert.ok(ali.transcript.length > 40);
  assert.match(ali.soap.subjective, /unreliable access to transportation/i);
  assert.match(ali.soap.objective, /LDL 137\.19/i);
  assert.ok(ali.planSections.length >= 5);
});

test("extracts evidence-linked actions for the rehearsed case", () => {
  const actions = extractActions(ali);
  assert.ok(actions.length >= 6);
  assert.ok(actions.some((action) => /dental/i.test(action.summary)));
  assert.ok(actions.some((action) => /headache log/i.test(action.summary)));
  assert.ok(actions.some((action) => /ride service/i.test(action.summary)));
  assert.ok(actions.every((action) => action.evidence.note.length > 0));
  assert.ok(actions.every((action) => action.confidence >= 0.72));
});

test("logs and routes the returning-patient call without diagnosing", () => {
  const call = buildFrontDeskCallLog(ali);
  assert.match(call.id, /^CALL-/);
  assert.equal(call.patientMatched, true);
  assert.equal(call.urgency, "routine");
  assert.equal(call.route, "Primary care scheduling");
  assert.equal(call.owner, "Front desk");
  assert.match(call.nextStep, /transportation support/i);
  assert.match(call.sourceNote, /does not diagnose/i);
});

test("validates the provider-neutral voice event contract", () => {
  const valid = validateVoiceSessionInput({
    patientId: ali.patientId,
    sessionId: "demo-session-1",
    status: "transcript",
    transcript: {
      speaker: "patient",
      text: "The bus did not arrive.",
      sequence: 1,
      isFinal: true,
    },
  });
  assert.equal(valid.ok, true);
  assert.equal(validateVoiceSessionInput(null).ok, false);
  assert.equal(
    validateVoiceSessionInput({ patientId: "p", sessionId: "s", status: "unknown" }).ok,
    false,
  );
  assert.equal(
    validateVoiceSessionInput({
      patientId: "p",
      sessionId: "s",
      status: "transcript",
      transcript: { speaker: "other", text: "hello", sequence: 0, isFinal: true },
    }).ok,
    false,
  );
});
