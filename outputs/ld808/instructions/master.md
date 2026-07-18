# ActionChart Voice - Master instruction

> Read this entire document before any phase. Work one file at a time within each phase. After each phase, update Section 8 as the last action.

## 1. Overview

**What:** Build and deploy a clinician-facing returning-patient demo that restores synthetic FHIR context, replays an encounter, presents SOAP and evidence-linked actions for doctor review, creates draft FHIR resources from approved items, and produces a safe patient recap.

**Why:** A clinical conversation may be documented while its follow-up work remains disconnected. This build shows a supervised path from patient memory to owned action.

**In scope:** 25 supplied synthetic patients, patient memory, transcript replay, SOAP display, proposed action extraction, doctor review, audit history, draft Task and ServiceRequest output, patient recap, local persistence, reset, responsive UI, tests, and deployment.

**Out of scope:** Live Vapi credentials, EHR writeback, production identity and authorization, HIPAA claims, signed orders, production clinical validation, and full FHIR Provenance bundles.

## 2. Current state

The repository contains a new Sites scaffold at `apps/actionchart-voice/`, the immutable source archives outside the repository, and completed product research under `outputs/ld808/`. The starter screen has no product feature code. A dev server can start with a direct vinext command, but package scripts still use Unix-style environment assignment.

| Module | Key files | Change type |
|---|---|---|
| Application setup | `apps/actionchart-voice/package.json`, `app/layout.tsx`, `app/globals.css` | Modify |
| Source preparation | `data/source/`, `scripts/prepare-data.mjs`, `app/data/patients.generated.json` | New |
| Domain logic | `lib/types.ts`, `lib/actions.ts`, `lib/review.ts`, `lib/fhir.ts`, `lib/recap.ts`, `lib/voice-contract.ts` | New |
| API boundary | `app/api/voice/session/route.ts` | New |
| Clinician workspace | `app/page.tsx`, `app/components/` | Replace and new |
| Validation | `tests/` | New |
| Documentation | `apps/actionchart-voice/README.md` | Replace or new |

## 3. Design

**Approach:** Prepare a compact deterministic dataset at build time. Keep patient memory, action extraction, review transitions, FHIR mapping, recap filtering, and voice events as separate typed modules. Use a client workspace for the interactive demo and local storage for review persistence.

**Data model changes:** Add typed normalized patient cases, evidence records, proposed actions, review decisions, audit entries, voice-session events, and FHIR draft unions.

**API changes:** Add `POST /api/voice/session` as a documented future adapter surface. Until configuration arrives, it validates the request shape and returns a clear `config_required` response without changing state.

**Config changes:** Normalize package scripts for Windows and Sites hosting. No secrets or environment variables are required for replay mode.

**Key decisions:**

- Use Ali Jerry Kuhic as the rehearsed case because one encounter produces several understandable actions.
- Use deterministic extraction for reproducibility, then make doctor review the authority boundary.
- Use ServiceRequest for clinical services and Task for operational follow-up.
- Generate patient recap content only from approved and patient-visible items.
- Keep replay and Vapi behind the same provider-neutral event contract.

## 4. Constraints for all phases

- Preserve all unrelated repository changes.
- Treat the source archives and copied source JSON as immutable evidence.
- Label every patient and output as synthetic demo data.
- Do not imply an EHR write, signed order, clinical validation, or production compliance.
- Do not create a FHIR draft before approval.
- Do not expose internal-only, pending, deferred, or rejected content in the patient recap.
- Keep the live path usable without credentials or network calls.
- Avoid adding dependencies when platform APIs or existing packages are sufficient.
- Keep user-facing copy brief, specific, and free of unsupported claims.
- Work one file at a time and run the narrowest relevant check before continuing.

## 5. Phase index

| Phase | File | Delivers | Depends on |
|---|---|---|---|
| 1 | `phase-1-setup.md` | Verified scaffold, source copy, scripts, and test harness | None |
| 2 | `phase-2-data-memory.md` | Typed 25-patient dataset, memory, SOAP, and replay contract | Phase 1 |
| 3 | `phase-3-review-workflow.md` | Evidence-linked actions and clinician review state machine | Phase 2 |
| 4 | `phase-4-fhir-recap.md` | Draft FHIR outputs, safe recap, and audit trail | Phase 3 |
| 5 | `phase-5-demo-ui.md` | Polished three-minute workspace and deployment-ready build | Phase 4 |
| 6 | `phase-6-edge-cases.md` | Hardening and boundary tests | All coding |
| 7 | `phase-7-cleanup.md` | Code quality and behavior-preserving simplification | Phase 6 |
| 8 | `phase-8-documentation.md` | Developer documentation and final audit | Phase 7 |

## 6. Cross-phase dependencies

| Producer | Creates | Consumer | Usage |
|---|---|---|---|
| Phase 1 | copied source record file and test command | Phase 2 | deterministic preparation input and validation |
| Phase 2 | normalized cases and shared types | Phases 3 to 5 | patient context, evidence, UI, and output references |
| Phase 2 | voice event contract | Phase 5 and future Vapi adapter | replay and webhook payload normalization |
| Phase 3 | reviewed actions and audit entries | Phase 4 | FHIR and recap eligibility |
| Phase 4 | FHIR drafts and recap selector | Phase 5 | readable and JSON output panels |
| Phase 5 | complete interaction surface | Phases 6 to 8 | hardening, cleanup, and documentation target |

## 7. Done when

- [x] All eight phases are complete.
- [x] The prepared dataset contains 25 patients with unique patient and encounter references.
- [x] Ali's flow completes from call log and triage through reviewed actions, FHIR drafts, and recap.
- [x] Recap leakage and FHIR-boundary tests pass.
- [x] Typecheck, lint, tests, and production build pass with zero failures.
- [x] A fresh developer can run the app from the README.
- [ ] The deployed version matches the final tested commit.
- [x] The completion log contains one entry for every phase.

## 8. Phase completion log

### Phase 1: Application foundation
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Verified the scaffold, normalized commands, copied the immutable source, and added deterministic data preparation.

### Phase 2: Data, memory, and replay
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Prepared 25 typed patient cases, longitudinal memory, SOAP sections, transcripts, and the voice-event contract.

### Phase 3: Doctor review workflow
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Added evidence-linked action extraction, review transitions, audit history, and local persistence.

### Phase 4: FHIR drafts, recap, and audit
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Added draft Task and ServiceRequest mapping plus the approved and patient-visible recap filter.

### Phase 5: Demo workspace
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Built the responsive clinician workspace and added Vetra-style call logging, triage, routing, and assignment.

### Phase 6: Edge cases and hardening
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Added input limits, safe storage fallback, route validation, sensitive defaults, and leakage tests.

### Phase 7: Cleanup and simplification
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Removed starter preview, database examples, and unused dependencies without changing behavior.

### Phase 8: Documentation and dependency audit
**Status:** Complete
**Date:** 2026-07-18
**Outcome:** Added app-specific README and CLAUDE guidance, audited dependencies, and ran the full suite.
