# Session 1 decisions - ActionChart Voice

## Session Context

- **Session:** 1 - Project framing
- **Started:** 2026-07-18
- **Version:** V1
- **Part A Decisions:** 5
- **Part B Decisions:** 3

## CHINTAN Activity This Session

- Auto-answered: 4
- Suggested-confirmed: 1
- Suggested-overridden: 0
- Human-answered: 3
- Avg confidence: 97%

## Decisions

1. Keep the domain human healthcare and separate from Vetra's veterinary branding.
2. Defer live Vapi integration and retain a future transcript adapter.
3. Load all 25 patients but curate three for the live story.
4. Treat replay as a first-class demo path, not a degraded fallback.
5. Make the doctor review gate the only path to FHIR drafts and patient recap.
6. Use browser-local state for this single-user demo and avoid a database.
7. Run standard product and technical research only.
8. Optimize the product and script for a complete three-minute judge flow.

## Judging constraint

The supplied Round One rubric assigns the largest weight to execution, followed by creativity and originality. The build therefore favors a focused working loop over extra integrations. Technical complexity should be visible through the data adapter, evidence model, review state machine, recap safety filter, and FHIR mapping.
