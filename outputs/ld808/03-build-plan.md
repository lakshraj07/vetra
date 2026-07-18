# Build plan - ActionChart Voice

## Build objective

Deliver a deployed clinician-facing demo that can run a complete returning-patient workflow in three minutes:

1. Select a synthetic returning patient.
2. Restore relevant longitudinal context.
3. Replay the recorded encounter through the future voice-event contract.
4. Review the SOAP summary and evidence-linked proposed actions.
5. Approve, edit, defer, or reject each action.
6. Generate draft FHIR Task and ServiceRequest resources from approved items.
7. Produce a patient recap that excludes unapproved and internal-only information.

Live Vapi input is the only deferred part. Replay must exercise the same downstream boundary so the later integration is additive.

## Architecture

```text
Synthetic FHIR records
        |
        v
Data preparation and normalization
        |
        +--> patient memory
        +--> SOAP sections
        +--> transcript turns
        +--> proposed actions and evidence
                         |
                         v
                 Review state machine
                         |
              +----------+----------+
              |                     |
              v                     v
       FHIR draft mapper     Patient recap filter
              |                     |
              v                     v
       Task/ServiceRequest   Approved visible items
```

The replay producer and future Vapi webhook both emit the same `VoiceSessionInput` events. They do not call review or output modules directly.

## Module plan

| Module | Responsibility | Primary verification |
|---|---|---|
| `scripts/prepare-data.mjs` | Convert the supplied records into a compact, deterministic application dataset. | All 25 patients load and retain source references. |
| `app/data/` | Store the generated patient cases used by the static demo. | Schema checks and representative case checks. |
| `lib/types.ts` | Define patient, evidence, action, review, voice event, and FHIR draft types. | Typecheck. |
| `lib/actions.ts` | Parse SOAP plan bullets, assign candidate owners, flag sensitivity, and match evidence. | Unit tests for ordinary and sensitive cases. |
| `lib/review.ts` | Apply approve, edit, defer, reject, visibility, owner, and due-window transitions. | State transition tests. |
| `lib/fhir.ts` | Map approved actions to draft Task or ServiceRequest resources. | Required field and resource-boundary tests. |
| `lib/recap.ts` | Select only approved, patient-visible actions and compose recap sections. | Leakage tests. |
| `lib/voice-contract.ts` | Define the provider-neutral transcript event boundary. | Contract tests and replay use. |
| `app/api/voice/session/route.ts` | Document the future webhook surface and return a clear configuration response until credentials arrive. | Response contract test. |
| `app/page.tsx` and UI components | Present memory, replay, SOAP, review, outputs, and reset in one coherent clinician workspace. | Build, rendered smoke test, and live rehearsal. |

## Phase 1: Application and data foundation

### Work

- Normalize the package scripts for Windows and hosting.
- Remove starter preview code and unused dependencies.
- Copy the original synthetic JSON into the app as immutable source data.
- Add a deterministic preparation script and generate a compact application dataset.
- Define shared domain types and display utilities.
- Add synthetic-data and deferred-voice labels.

### Exit criteria

- The app builds from a clean install.
- All 25 patients appear in the generated data.
- Ali Jerry Kuhic is selected by default.
- No original source file is modified.

## Phase 2: Patient memory, encounter, and replay

### Work

- Build the cohort rail and patient switcher.
- Show demographics, visit context, conditions, medications, and FHIR resource counts.
- Parse and present SOAP sections.
- Build replay controls that emit transcript events over time.
- Keep the full transcript available without making it the primary visual surface.

### Exit criteria

- Switching patients updates every related panel.
- Replay starts, pauses or completes predictably, and can be reset.
- The interface clearly distinguishes prior memory from current encounter evidence.

## Phase 3: Evidence-linked doctor review

### Work

- Parse proposed plan actions from the note.
- Attach exact note and transcript evidence.
- Add confidence, sensitivity, candidate owner, due window, and FHIR target.
- Implement approve, edit and approve, defer, reject, and reset transitions.
- Persist review state in local storage by patient.
- Default sensitive actions to internal-only.

### Exit criteria

- Every action shows source evidence.
- Review decisions are visible and reversible.
- Edited content is preserved in approved outputs.
- Sensitive actions never start as patient-visible.

## Phase 4: FHIR drafts, recap, and audit trail

### Work

- Map approved operational work to Task.
- Map approved clinical-service requests to ServiceRequest.
- Use draft status and proposal intent.
- Add patient, encounter, author time, owner or requester, and evidence notes.
- Build the recap from approved, patient-visible actions only.
- Show an audit timeline of review decisions.
- Provide readable and JSON views of outputs.

### Exit criteria

- Pending, rejected, and deferred items create no FHIR draft.
- Internal-only items never appear in the patient recap.
- Task and ServiceRequest outputs contain the required demo fields.
- Reset removes local decisions and restores the initial case.

## Phase 5: Demo experience and deployment

### Work

- Polish layout, typography, color, density, empty states, and responsive behavior.
- Add a guided demo path with clear next steps but no modal tutorial.
- Make the deferred Vapi boundary honest and visible.
- Add a clinician-safe browser voice playback for the approved recap if supported.
- Add deterministic demo reset and a backup case.
- Run typecheck, tests, production build, and deployment validation.

### Exit criteria

- The primary flow completes in under three minutes without typing.
- The app remains understandable at laptop and projected widths.
- A refresh retains review state; reset produces a clean demo.
- The deployed version matches the tested commit.

## Test plan

### Automated

- Prepared dataset contains 25 distinct patient and encounter references.
- SOAP parsing returns the expected sections for Ali.
- Action parsing produces the known referral, transportation, and follow-up items.
- Sensitive-keyword cases start internal-only.
- Review transitions produce the expected final state.
- Recap excludes pending, rejected, deferred, and internal-only items.
- Task outputs include `resourceType`, `status`, `intent`, `for`, `encounter`, and `description`.
- ServiceRequest outputs include `resourceType`, `status`, `intent`, `subject`, `encounter`, and `code`.
- Production build renders the main page.

### Manual rehearsal

1. Reset Ali's case.
2. Explain restored context in under 25 seconds.
3. Replay or fast-forward the encounter.
4. Approve two actions, edit one, and keep one internal-only.
5. Open FHIR drafts and the patient recap.
6. State the Vapi adapter boundary and the safety guarantee.

## Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Live voice credentials are unavailable | Certain for the current build | Medium | Use replay through the final adapter contract and label voice as ready to connect. |
| Broad scope weakens the live demo | Medium | High | Rehearse one Ali path and keep other cases for Q&A. |
| Parser produces noisy actions | Medium | High | Use deterministic SOAP headings, evidence display, and clinician review before outputs. |
| Sensitive information leaks into recap | Low after controls | High | Default flagged actions to internal-only and enforce a tested filter at render time. |
| FHIR output is mistaken for a signed order | Medium | High | Use draft and proposal semantics with explicit UI copy. |
| Client persistence is cleared | Low | Low | Add a one-click replay and deterministic regeneration from source data. |
| Hosting differs from local behavior | Medium | Medium | Run the production build, publish the exact commit, and validate the deployment. |

## Research traceability

| Research finding | Build response |
|---|---|
| Center one patient and one decision | Cohort rail stays secondary; review panel carries primary focus. |
| Evidence beside actions | Action cards keep note and transcript evidence visible. |
| Explicit review states | Typed state machine and audit timeline. |
| Deterministic recap safety | Separate recap module with exclusion tests. |
| Task and ServiceRequest boundary | Separate FHIR mappers with resource-specific tests. |
| Provider-neutral voice events | Replay producer and API route share one contract. |
| Replay reliability | One-click replay, fast-forward, reset, and default case. |
| Technical depth must be visible | The interface shows memory, evidence, decisions, and FHIR results as one chain. |

## Definition of done

The build is done when a judge can watch one synthetic returning patient move from restored context to doctor-approved work and a safe patient recap, see the evidence and FHIR drafts, and understand exactly where the future Vapi stream connects.

