# Phase 3: Doctor review workflow

> Read `master.md` first. Work one file at a time and verify each change.

## Prerequisites

- [ ] Phase 2 is complete.
- [ ] The generated dataset and full suite pass.

## Delivers

Deterministic, evidence-linked proposed actions and a typed review state machine that supports approval, editing, deferral, rejection, ownership, due windows, patient visibility, and reset.

## Steps

### Step 1: Parse proposed actions

**File:** `apps/actionchart-voice/lib/actions.ts` - create

**Goal:** Convert SOAP plan headings and bullets into reviewable action candidates.

**Details:** Keep exact note evidence, match the best transcript excerpt, set an extraction confidence, propose an owner and due window, and choose Task or ServiceRequest. Flag sensitive language and default it to internal-only. Stable IDs must derive from patient, encounter, and source position.

**Verify:** Ali produces recognizable dental, transportation, lipid, headache-log, and outreach actions.

### Step 2: Implement review transitions

**File:** `apps/actionchart-voice/lib/review.ts` - create

**Goal:** Centralize all valid action-state changes.

**Details:** Implement approve, edit-and-approve, defer, reject, visibility update, owner update, due-window update, and reset. Preserve original text and record actor, time, previous state, and new state in audit entries. Invalid transitions return a typed error or unchanged state, never partial state.

**Verify:** `npm run typecheck` passes.

### Step 3: Add local persistence adapter

**File:** `apps/actionchart-voice/lib/review-storage.ts` - create

**Goal:** Load, save, and reset review state by patient without assuming browser storage is always available.

**Details:** Version stored data, validate parsed JSON, and fall back to initial state when unavailable or malformed.

**Verify:** Browser-unavailable and malformed-value tests pass.

### Step 4: Add review tests

**File:** `apps/actionchart-voice/tests/review.test.mjs` - create

**Details:** Test extraction, evidence retention, owner mapping, FHIR target selection, sensitive default, every state transition, edit preservation, audit creation, invalid transitions, persistence fallback, and reset. Include at least fifteen assertions.

**Verify:** `npm test` passes.

### Step 5: Full suite

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` with zero failures.

## Completion

Update the master completion log. Append Phase 3 and `[COMPLEXITY]` entries to `05-execution-trace.md`.

