# Phase 1: Application foundation

> Read `master.md` first. This phase prepares the application only. Do not add feature UI.

## Prerequisites

- [ ] Master instruction read.
- [ ] Current branch and dirty worktree reviewed so unrelated files remain untouched.

## Delivers

A verified ActionChart scaffold with cross-platform commands, immutable synthetic source data, a deterministic preparation entry point, and a working test harness.

## Steps

### Step 1: Verify the scaffold

**Files:** `apps/actionchart-voice/package.json`, `apps/actionchart-voice/tsconfig.json`, `apps/actionchart-voice/next.config.ts` - inspect

**Goal:** Confirm the initialized Next.js, React, TypeScript, and vinext versions and identify starter-only files.

**Verify:** `npm list --depth=0` completes from the app directory.

### Step 2: Normalize package configuration

**File:** `apps/actionchart-voice/package.json` - modify

**Goal:** Make `dev`, `build`, `start`, `test`, `typecheck`, and `lint` work on Windows and hosting.

**Details:** Remove starter-only dependencies if unused. Use direct vinext commands without shell-specific environment assignment. Add a Node test command and a TypeScript no-emit command.

**Verify:** `npm run typecheck` starts successfully and `npm run lint` can scan the scaffold.

### Step 3: Remove starter preview assets

**Files:** `apps/actionchart-voice/app/_sites-preview/` - delete generated starter files; `apps/actionchart-voice/app/page.tsx` - replace with a minimal temporary product shell

**Goal:** Remove the skeleton-preview dependency without adding feature behavior.

**Verify:** Search finds no `_sites-preview`, `SkeletonPreview`, or `react-loading-skeleton` import.

### Step 4: Add immutable source data

**File:** `apps/actionchart-voice/data/source/synthetic-ambient-fhir-25.json` - copy from the supplied archive

**Goal:** Put the exact original JSON in a clearly marked source folder.

**Details:** Do not reformat or edit the content. Record its source archive in the app README later.

**Verify:** A JSON parse succeeds and returns 25 records.

### Step 5: Add preparation entry point

**File:** `apps/actionchart-voice/scripts/prepare-data.mjs` - create

**Goal:** Create a deterministic build-time transformation command without implementing product heuristics yet.

**Details:** Validate the root array, require record IDs and patient resources, then write a placeholder normalized list that retains patient and encounter references. Fail with a useful message on malformed input.

**Verify:** `node scripts/prepare-data.mjs` succeeds twice with identical output hashes.

### Step 6: Add the test harness

**File:** `apps/actionchart-voice/tests/setup.test.mjs` - create

**Goal:** Confirm the source data and preparation contract are available.

**Details:** Test record count, unique record IDs, and generated output existence.

**Verify:** `npm test` passes.

### Step 7: Verify the environment

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. All must pass before Phase 2.

## Completion

Update `master.md` Section 8 and append a Phase 1 entry to `05-execution-trace.md`, including the mandatory `[COMPLEXITY]` note and any deviations.

