# Session 2 decisions - Research

## Decision summary

| Decision | Alternatives considered | Chosen option | Reasoning | Confidence |
|---|---|---|---|---|
| Main demo case | Broad cohort tour; hospital case; Ali annual physical | Ali annual physical | It produces several understandable actions and shows memory, coordination, referral, and follow-up in one encounter. | 96% |
| First viewport | Analytics dashboard; transcript-first view | One patient and one review decision | Judges can understand the patient, evidence, and decision without navigation. | 97% |
| Clinical output | Task for every item; ServiceRequest for every item | ServiceRequest for clinical services, Task for operational work | Matches the responsibilities described by the FHIR R4 resources. | 99% |
| Draft semantics | Active order; completed task; draft proposal | `status: draft`, `intent: proposal` | The demo produces clinician-reviewed drafts, not signed or transmitted orders. | 99% |
| Recap safety | Prompt-only instruction; manual copy | Deterministic approved and patient-visible filter | The rule remains enforceable and testable regardless of future model behavior. | 99% |
| Provenance | Full FHIR Provenance bundle now; no provenance | Internal evidence and audit record now, FHIR Provenance later | Preserves trust and auditability without displacing the core workflow. | 94% |
| Persistence | Hosted database; memory only | Local storage with reset | Reliable for a hackathon and replaceable behind separate modules. | 96% |
| Voice boundary | Vapi-specific downstream code; no voice surface | Provider-neutral event contract with replay producer | Every downstream feature works now and Vapi can connect without a rewrite. | 98% |

## CHINTAN notes

- Research depth remained Standard because no low-confidence blocker appeared.
- Product and technical research were sufficient. Market research would not change the current build.
- The user asked for fast progress, so reversible implementation choices were auto-resolved.
- The judging rubric was treated as a product constraint rather than presentation copy.

## Session outcome

Research is complete. The build plan should preserve a narrow first path, keep the review and safety logic independently testable, and reserve the final phase for demo polish and rehearsal reliability.
