# Phase 6: Edge cases and hardening

> Read `master.md` first. Confirm all coding phases are complete. Work one file at a time.

## Prerequisites

- [ ] Phases 1 through 5 are complete.
- [ ] Full test suite and production build pass.

## Steps

### Step 1: Audit all changed source files

Read the files named in the completion log. Check malformed source data, missing FHIR references, empty notes, unusual transcript formatting, duplicate action IDs, oversized text, browser storage failure, rapid replay control, stale state after patient switching, and output leakage.

### Step 2: Harden data and contract boundaries

**Files:** `scripts/prepare-data.mjs`, `lib/patients.ts`, `lib/voice-contract.ts` - modify one at a time

**Details:** Add explicit validation, bounded text lengths, stable fallback labels, duplicate detection, and actionable errors. Never print clinical transcript content in errors or logs.

**Verify:** Run the narrow related tests after each file.

### Step 3: Harden action and review logic

**Files:** `lib/actions.ts`, `lib/review.ts`, `lib/review-storage.ts` - modify one at a time

**Details:** Handle empty plans, unmatched evidence, duplicate transitions, invalid owners, unavailable local storage, corrupt stored versions, and reset during active replay. Preserve original evidence and fail closed on patient visibility for sensitive items.

**Verify:** Run review tests after each file.

### Step 4: Harden output boundaries

**Files:** `lib/fhir.ts`, `lib/recap.ts`, `lib/outputs.ts` - modify one at a time

**Details:** Validate patient and encounter references, omit invalid drafts, escape display text, enforce the recap filter before formatting, and show clear empty states. No code path may bypass the approval check.

**Verify:** Run output tests after each file.

### Step 5: Harden the interface and adapter

**Files:** `app/page.tsx`, affected components, `app/api/voice/session/route.ts` - modify one at a time

**Details:** Cover loading, no matches, missing storage, fast repeated clicks, disabled actions, keyboard focus, small screens, reduced motion, invalid JSON, wrong content type, and oversized requests. The route must not echo transcript content in an error.

**Verify:** Typecheck and route or rendered tests after each file.

### Step 6: Add edge-case tests

**File:** `tests/edge-cases.test.mjs` - create

**Details:** Add at least two boundary cases for each hardened module group. Required cases include malformed data, missing references, empty plan, sensitive visibility, corrupt storage, duplicate approval, recap leakage, invalid route body, and reset during replay.

**Verify:** `npm test` passes.

### Step 7: Full suite

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` with zero failures.

## Completion

Update the master completion log. Append Phase 6 and `[COMPLEXITY]` entries to `05-execution-trace.md`.

