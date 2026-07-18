import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { extractActions } from "../lib/actions.ts";
import { buildFhirDrafts } from "../lib/fhir.ts";
import { buildPatientRecap, recapEligibleActions } from "../lib/recap.ts";
import { createReviewState, transitionAction, updateAction } from "../lib/review.ts";

const patients = JSON.parse(
  await readFile(new URL("../app/data/patients.generated.json", import.meta.url), "utf8"),
);
const ali = patients.find((patient) => patient.givenName === "Ali");
const proposed = extractActions(ali);

test("starts every action in clinician review", () => {
  const state = createReviewState(ali.patientId, proposed);
  assert.equal(state.actions.length, proposed.length);
  assert.ok(state.actions.every((action) => action.status === "pending"));
  assert.ok(state.actions.every((action) => action.reviewedAt === null));
  assert.equal(state.audit.length, 0);
});

test("preserves edits and records review transitions", () => {
  let state = createReviewState(ali.patientId, proposed);
  const action = state.actions[0];
  state = updateAction(state, action.id, {
    summary: "Schedule dental care within two weeks",
    owner: "Referral team",
  });
  state = transitionAction(
    state,
    action.id,
    "approved",
    "Dr. Demo",
    "2026-07-18T20:00:00.000Z",
  );
  assert.equal(state.actions[0].summary, "Schedule dental care within two weeks");
  assert.equal(state.actions[0].status, "approved");
  assert.equal(state.audit.length, 1);
  assert.equal(state.audit[0].actor, "Dr. Demo");
  assert.match(state.audit[0].event, /^Approved:/);
});

test("creates no FHIR draft before approval", () => {
  const state = createReviewState(ali.patientId, proposed);
  assert.deepEqual(buildFhirDrafts(ali, state.actions), []);
});

test("maps approved work to Task and ServiceRequest drafts", () => {
  let state = createReviewState(ali.patientId, proposed);
  const serviceAction = state.actions.find((action) => action.fhirTarget === "ServiceRequest");
  const taskAction = state.actions.find((action) => action.fhirTarget === "Task");
  assert.ok(serviceAction);
  assert.ok(taskAction);
  state = transitionAction(state, serviceAction.id, "approved", "Dr. Demo", "2026-07-18T20:00:00.000Z");
  state = transitionAction(state, taskAction.id, "approved", "Dr. Demo", "2026-07-18T20:01:00.000Z");
  const drafts = buildFhirDrafts(ali, state.actions);
  const serviceRequest = drafts.find((draft) => draft.resourceType === "ServiceRequest");
  const task = drafts.find((draft) => draft.resourceType === "Task");
  assert.ok(serviceRequest);
  assert.ok(task);
  assert.equal(serviceRequest.status, "draft");
  assert.equal(serviceRequest.intent, "proposal");
  assert.equal(serviceRequest.subject.reference, ali.patientReference);
  assert.equal(task.status, "draft");
  assert.equal(task.intent, "proposal");
  assert.equal(task.for.reference, ali.patientReference);
  assert.equal(task.encounter.reference, ali.encounterReference);
});

test("keeps rejected, deferred, pending, and internal items out of the recap", () => {
  let state = createReviewState(ali.patientId, proposed);
  const [visible, internal, deferred, rejected] = state.actions;
  state = transitionAction(state, visible.id, "approved");
  state = updateAction(state, internal.id, { patientVisible: false });
  state = transitionAction(state, internal.id, "approved");
  state = transitionAction(state, deferred.id, "deferred");
  state = transitionAction(state, rejected.id, "rejected");
  const eligible = recapEligibleActions(state.actions);
  const recap = buildPatientRecap(ali, state.actions);
  assert.deepEqual(eligible.map((action) => action.id), [visible.id]);
  assert.equal(recap.items.length, 1);
  assert.equal(recap.items[0].summary, visible.summary);
  assert.doesNotMatch(JSON.stringify(recap), new RegExp(internal.summary, "i"));
});
