# Phase 7: Cleanup and simplification

> Read `master.md` first. Confirm Phase 6 is complete. Do not change behavior. Revert a cleanup if its tests fail.

## Prerequisites

- [ ] Phase 6 is complete.
- [ ] Full test suite passes.

## Steps

### Step 1: Audit

Review each changed source and test file for dead starter code, duplicated selectors, unclear names, long components, complex conditionals, unused styles, missing return types, unstable array keys, and redundant fixtures.

### Step 2: Clean domain modules

**Files:** All files under `lib/` - modify one at a time only when the audit finds a concrete issue.

**Details:** Organize imports, add explicit return types, simplify branching, share pure helpers, and keep safety rules named rather than implicit.

**Verify:** Run the narrow related test and typecheck after each file.

### Step 3: Clean UI modules

**Files:** `app/page.tsx`, `app/components/`, `app/globals.css` - modify one at a time

**Details:** Split components that mix unrelated responsibilities, remove unused selectors, consolidate repeated status mappings, and preserve accessible labels and focus behavior.

**Verify:** Typecheck and rendered tests after each file.

### Step 4: Clean scripts and tests

**Files:** `scripts/prepare-data.mjs`, `tests/` - modify one at a time

**Details:** Share fixtures where clearer, remove redundant assertions, keep scenario names specific, and avoid test order dependence.

**Verify:** `npm test` passes.

### Step 5: Lint and full suite

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Fix all project-owned warnings and errors.

## Completion

Update the master completion log. Append Phase 7 and `[COMPLEXITY]` entries to `05-execution-trace.md`.

