# Phase 8: Documentation and dependency audit

> Final phase. Read `master.md` first and confirm Phase 7 is complete. The build is not complete until this phase passes.

## Prerequisites

- [ ] Phase 7 is complete.
- [ ] Full suite passes.

## Steps

### Step 1: Audit dependencies and imports

Compare every import against `package.json`, search for removed starter symbols, and remove unused direct dependencies. Regenerate the lockfile through the package manager. Do not hand-edit integrity fields.

**Verify:** `npm list --depth=0`, typecheck, and tests pass.

### Step 2: Audit code documentation

Review public types, exported functions, non-obvious safety rules, and the voice adapter boundary. Add short TSDoc or comments where they help a new contributor understand parameters, return values, failure behavior, and clinical-safety boundaries. Do not add comments that repeat the code.

**Verify:** Typecheck and lint pass.

### Step 3: Complete the app README

**File:** `apps/actionchart-voice/README.md` - create or replace

**Details:** Document purpose, synthetic-data notice, prerequisites, install, prepare-data, run, test, build, project structure, review states, FHIR mapping, `POST /api/voice/session`, Vapi connection point, limitations, and deployment process. Never include credentials or claim production readiness.

**Verify:** Follow the commands in order from the app directory.

### Step 4: Document the API

Keep the one route in the README. Include request shape, valid status and transcript values, the current `501 config_required` response, invalid request response, and a sample with synthetic text.

**Verify:** Compare the documentation directly with the route code and tests.

### Step 5: Project-context boundary

Do not replace the repository root `CLAUDE.md`, which describes Vetra. Add an app-local `apps/actionchart-voice/CLAUDE.md` only if needed to document ActionChart-specific commands and domain boundaries. Preserve the standalone human-healthcare identity.

**Verify:** No veterinary product instructions appear in the ActionChart UI or API docs.

### Step 6: Final verification

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Confirm all docs match the final code, no stale preview copy remains, and all Section 7 checks in `master.md` are complete.

## Completion

Update the master completion log. Append Phase 8 and `[COMPLEXITY]` entries to `05-execution-trace.md`. Mark every Done When item only after the checks pass.

