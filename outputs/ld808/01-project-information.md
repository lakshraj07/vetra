# Project information - ActionChart Voice

## Overview

ActionChart Voice is a returning-patient intake and doctor review demo for a healthcare hackathon. It retrieves prior synthetic FHIR context, replays or receives a patient conversation, prepares a SOAP snapshot, and proposes evidence-linked next actions. A doctor can approve, edit, reject, or defer each action before the system produces draft FHIR workflow resources and a patient recap.

The demo is designed to show a complete conversation-to-action loop in three minutes. Live Vapi voice is deferred until API access is supplied. Replay mode uses the provided transcripts and exercises the same patient memory, review, FHIR, and recap path.

## Target Users

The primary user is a clinician preparing for or reviewing a returning-patient encounter. The secondary users are care coordinators, referral teams, nursing staff, and front-desk staff who own approved follow-up work. Patients benefit from shorter intake, fewer repeated questions, and a recap limited to information their doctor approved.

Hackathon judges are a temporary but important audience. They need to understand the pain, see a working product, recognize the engineering depth, and grasp the difference from a standard ambient scribe within the first minute.

## Problem Statement

Returning-patient conversations often start without the right chart context. Staff repeat questions, clinicians reconstruct history during the visit, and useful plan items remain trapped in notes. Ambient documentation helps write the record but does not reliably decide what changed, who owns the next step, or what can safely be sent back to the patient.

ActionChart uses prior context to ask better questions, then separates extraction from authorization. It turns the conversation into proposed work with evidence and keeps the doctor in control of every consequential action.

## Constraints

- Round One allows about three minutes for the live demo and one to two minutes for questions.
- Execution has the largest supplied Round One weight at 30 percent. A complete replay is more valuable than a fragile live integration.
- Creativity and originality carry 25 percent in Round One. The product must clearly go beyond transcription and SOAP generation.
- Impact and technical complexity each carry 20 percent in the supplied Round One rubric.
- Round Two uses equal weighting across the four criteria.
- Vapi credentials and event details will arrive later.
- The dataset is synthetic and is not a validated clinical benchmark.
- The app cannot diagnose, prescribe, place orders, or write to a live EHR.
- The doctor review gate is mandatory before recap or FHIR draft generation.
- The first version is a single-user demo and does not need a database or authentication.
- The app must retain a replay fallback even after Vapi is connected.

## Key Decisions

1. Build a standalone human-healthcare demo inside the Vetra repository.
2. Use the full set of 25 patients for search and replay, with three curated judge cases.
3. Defer Vapi without changing the downstream workflow contract.
4. Treat SOAP as a compact context view, not the product endpoint.
5. Require evidence on every proposed action.
6. Generate patient-facing text only from approved, patient-visible items.
7. Keep FHIR resources in draft or proposal-like states and never write to a live system.
8. Optimize the live path for a polished three-minute story with a reliable reset.

## Success Criteria

### Impact

- The demo explains the scaled pain in one sentence: returning patients repeat context while care teams still lose next actions inside notes.
- The patient memory view shows that the system used prior conditions, medications, and care barriers without reading the full chart aloud.

### Execution

- A judge can select a curated patient, replay the intake, review actions, finalize, and see the recap and FHIR drafts in under three minutes.
- The main path works without external credentials.
- Resetting the case restores a clean review state.
- The layout is usable on a presentation laptop and remains legible on a tablet.

### Technical complexity

- All 25 supplied records load through a typed data adapter.
- SOAP sections and proposed actions preserve source evidence.
- Review items support approve, edit, reject, defer, ownership, due window, and patient visibility.
- Finalization produces structurally readable FHIR Task and ServiceRequest drafts.
- Automated checks confirm that rejected and internal-only items never enter the patient recap.

### Creativity and originality

- The first screen and demo script make the memory-to-action loop obvious.
- The product differentiates itself from an ambient scribe through context retrieval, reviewable ownership, and downstream workflow output.
- The safety model is visible in the interaction, not left to narration.

## Research Needs

Session 2 should validate the product pattern and implementation choices needed for a strong hackathon demo. It should focus on action-oriented clinical workflow, human review patterns, FHIR Task versus ServiceRequest mapping, replay reliability, and ways to make technical depth visible without adding fragile infrastructure. Market sizing, pricing, and broad competitor research are outside this build.
