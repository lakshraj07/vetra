# Phase 5: Demo workspace

> Read `master.md` first. Work one file at a time and verify each change.

## Prerequisites

- [ ] Phase 4 is complete.
- [ ] All domain and output tests pass.

## Delivers

A polished, responsive clinician workspace that completes the rehearsed Ali flow in under three minutes and exposes the full 25-patient cohort for Q&A.

## Steps

### Step 1: Establish visual system

**Files:** `apps/actionchart-voice/app/globals.css`, `apps/actionchart-voice/app/layout.tsx` - modify one at a time

**Goal:** Create the ActionChart visual foundation and accurate page metadata.

**Details:** Use a warm clinical neutral background, dark readable text, teal or green for verified states, amber for review, and red only for rejection or safety. Define spacing, typography, focus, button, card, badge, table, and responsive tokens. Respect reduced motion.

**Verify:** Build passes and metadata says ActionChart Voice.

### Step 2: Build reusable panels

**Files:** Create focused components under `apps/actionchart-voice/app/components/` one at a time for the patient rail, patient memory, replay, SOAP snapshot, action review, outputs, and audit timeline.

**Goal:** Keep the page understandable without a generic dashboard template.

**Details:** Every interactive element needs an accessible name, keyboard focus, disabled state, and clear feedback. Keep evidence adjacent to its action. Label data as synthetic and FHIR resources as drafts.

**Verify:** Typecheck after each component.

### Step 3: Compose the clinician workspace

**File:** `apps/actionchart-voice/app/page.tsx` - replace

**Goal:** Connect patient selection, replay, review, persistence, outputs, and reset.

**Details:** Select Ali initially. Keep the cohort rail compact. Show prior memory separately from current encounter. Provide replay, fast-forward, and reset. Make approve the fastest action while preserving edit, defer, reject, owner, due window, and patient visibility. Reveal FHIR and recap outputs without leaving the workspace.

**Verify:** The Ali flow works without typing and survives a refresh.

### Step 4: Add the voice adapter route

**File:** `apps/actionchart-voice/app/api/voice/session/route.ts` - create

**Goal:** Expose the exact future integration boundary without pretending Vapi is connected.

**Details:** Accept and validate the provider-neutral event shape. Return `501` with `code: config_required`, a safe message, and the accepted contract until configuration exists. Do not log transcript text.

**Verify:** Valid and invalid request tests pass.

### Step 5: Add rendered and route tests

**Files:** `apps/actionchart-voice/tests/rendered-html.test.mjs`, `apps/actionchart-voice/tests/voice-route.test.mjs` - create one at a time

**Details:** Assert the built page contains product metadata, synthetic label, patient context, review language, FHIR draft language, recap boundary language, and no starter-preview copy. Test route validation and the configuration response.

**Verify:** `npm test` passes.

### Step 6: Rehearse and verify

Run the full suite and production build. Then rehearse: reset, show patient memory, replay or fast-forward, approve two items, edit one, keep one internal-only, open FHIR drafts, open recap, and point to the future voice boundary. Target under three minutes.

## Completion

Update the master completion log. Append Phase 5 and `[COMPLEXITY]` entries to `05-execution-trace.md`.

