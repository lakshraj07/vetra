# Phase 4: FHIR drafts, recap, and audit

> Read `master.md` first. Work one file at a time and verify each change.

## Prerequisites

- [ ] Phase 3 is complete.
- [ ] Review-state tests pass.

## Delivers

Approved actions become readable draft Task or ServiceRequest resources. The patient recap is derived only from approved and patient-visible actions, and the clinician can inspect an audit history.

## Steps

### Step 1: Map FHIR drafts

**File:** `apps/actionchart-voice/lib/fhir.ts` - create

**Goal:** Map approved actions to draft FHIR R4-shaped objects.

**Details:** Use `status: draft` and `intent: proposal`. Task must include description, patient reference, encounter reference, owner display, priority, and authored time. ServiceRequest must include code text, subject, encounter, requester display, priority, note evidence, and authored time. Return no resource for pending, deferred, or rejected items.

**Verify:** `npm run typecheck` passes.

### Step 2: Build the safe recap selector

**File:** `apps/actionchart-voice/lib/recap.ts` - create

**Goal:** Compose a concise patient recap from the allowed action set.

**Details:** Filter first for `approved` and `patientVisible === true`; then format. Never pass the full action collection into a text generator. Include a deterministic empty state when nothing is eligible.

**Verify:** A mixed review set returns only approved visible items.

### Step 3: Add output helpers

**File:** `apps/actionchart-voice/lib/outputs.ts` - create

**Goal:** Group FHIR drafts by resource type, format readable summaries, and sort audit entries without changing source state.

**Verify:** `npm run typecheck` passes.

### Step 4: Add output tests

**File:** `apps/actionchart-voice/tests/outputs.test.mjs` - create

**Details:** Cover Task required fields, ServiceRequest required fields, correct resource choice, no draft before approval, edited content, patient and encounter references, patient recap exclusions, empty recap, and audit ordering. Include at least twelve assertions.

**Verify:** `npm test` passes.

### Step 5: Full suite

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` with zero failures.

## Completion

Update the master completion log. Append Phase 4 and `[COMPLEXITY]` entries to `05-execution-trace.md`.

