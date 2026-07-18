# Phase 2: Data, memory, and replay

> Read `master.md` first. Work one file at a time and verify each change.

## Prerequisites

- [ ] Phase 1 is complete in the master log.
- [ ] Typecheck, tests, and build pass.

## Delivers

A typed, compact 25-patient dataset with demographics, longitudinal memory, transcript turns, SOAP sections, source references, and the provider-neutral voice event contract.

## Steps

### Step 1: Define domain types

**File:** `apps/actionchart-voice/lib/types.ts` - create

**Goal:** Define the normalized patient, encounter, SOAP, transcript, evidence, action, review, audit, and FHIR draft shapes.

**Verify:** `npm run typecheck` passes.

### Step 2: Define voice events

**File:** `apps/actionchart-voice/lib/voice-contract.ts` - create

**Goal:** Provide typed `started`, `transcript`, and `ended` events shared by replay and the future adapter.

**Details:** Include a request validator that rejects missing patient ID, session ID, invalid speaker, non-final sequence values, and oversized transcript text.

**Verify:** `npm run typecheck` passes.

### Step 3: Complete data preparation

**File:** `apps/actionchart-voice/scripts/prepare-data.mjs` - modify

**Goal:** Produce `app/data/patients.generated.json` from the immutable source.

**Details:** Extract patient identity, date of birth, age at encounter, gender, encounter and patient IDs, visit title and type, date, condition and medication labels, resource counts, transcript turns, SOAP sections, original note, and after-visit summary. Keep source record IDs and never invent missing clinical facts.

**Verify:** Run the script twice and compare hashes.

### Step 4: Add data access helpers

**File:** `apps/actionchart-voice/lib/patients.ts` - create

**Goal:** Load typed generated cases, select Ali by default, search by name or visit, and calculate display-safe initials and age.

**Verify:** `npm run typecheck` passes.

### Step 5: Add data and contract tests

**File:** `apps/actionchart-voice/tests/data-memory.test.mjs` - create

**Details:** Cover 25 unique cases, Ali's demographics and known context, required SOAP sections, transcript order, unique FHIR references, deterministic generation, and valid or invalid voice events. Include at least ten assertions across these boundaries.

**Verify:** `npm test` passes.

### Step 6: Full suite

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` with zero failures.

## Completion

Update the master completion log. Append Phase 2 and `[COMPLEXITY]` entries to `05-execution-trace.md`.

