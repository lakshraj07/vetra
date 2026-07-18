# WIP: Session 3 - Build planning
## Status: In Progress - Part A
## Started: 2026-07-18 12:24
## Contributor: ld808 - Lakshraj Doshi
## Messages This Session: 0

## Current Focus
Convert the verified product and FHIR decisions into a phased build that reaches a reliable three-minute demo quickly.

## CHINTAN Activity
- Auto-answered: 0 questions
- Suggested: 0 questions
- Asked human: 0 questions
- Current session confidence: 96%

## Open Decisions
- Exact phase boundaries for data preparation, review workflow, outputs, and demo polish.
- Minimum automated test set needed before deployment.

## Resolved Decisions
- Ali is the primary demo case.
- The first viewport centers one patient and one review decision.
- ServiceRequest represents clinical-service requests; Task represents operational work.
- Draft outputs use `status: draft` and `intent: proposal`.
- The patient recap is derived through a deterministic approval and visibility filter.
- Replay and future Vapi events share a provider-neutral contract.

## Key Outputs
- `02-research.md`: product, FHIR, adapter, safety, dataset, and judging findings.
- `02-decisions-log.md`: final research decisions and confidence.

## Blockers
None. Live Vapi remains a deferred adapter.

## Next Steps
1. Define modules, phases, acceptance checks, and risks.
2. Map every research recommendation to implementation work.
3. Produce `03-build-plan.md` and implementation instructions.
