# Research findings - ActionChart Voice

## Executive finding

The strongest hackathon build is not another ambient note generator. It is a supervised memory-to-action workflow: restore the returning patient's relevant context, show the visit evidence, let the clinician decide what becomes work, and create auditable draft outputs only after approval.

The three-minute demo should stay on one patient. Ali Jerry Kuhic is the primary case because the encounter naturally produces several distinct follow-up actions: dental referral, transportation help, lipid follow-up, headache tracking, and care-coordinator outreach. A separate psychosocial case can demonstrate the sensitive-information guardrail during Q&A.

## Product findings

### 1. Open on a decision, not a dashboard

The first viewport should answer four questions immediately:

1. Who is the patient?
2. What prior context matters now?
3. What did this encounter add?
4. What needs the clinician's decision?

The cohort is useful for case switching, but it should remain a compact rail. The selected patient, memory, encounter evidence, and next proposed action should hold the visual focus.

### 2. Put evidence beside every proposed action

Each proposed action should show the note sentence that caused it, a matching transcript excerpt when available, and an extraction confidence. The clinician should not have to trust a hidden model step or search the full transcript before approving a task.

### 3. Make review status explicit

Every proposed action moves through one of five visible states:

- Pending review
- Approved
- Edited and approved
- Deferred
- Rejected

Approval should also capture an owner, due window, and whether the item may appear in the patient recap. These controls make the safety boundary concrete and give the demo a clear transformation from conversation to accountable work.

### 4. Treat the patient recap as a controlled output

The recap is derived only from actions that are both clinician-approved and marked patient-visible. Rejected, deferred, pending, and internal-only items must be excluded by a deterministic filter at render time. This is more reliable than asking a model to remember the rule inside a prompt.

### 5. Make replay and reset first-class demo controls

A prerecorded synthetic transcript should drive the same downstream contract planned for Vapi. The interface needs a one-click replay, clear progress, and a reset action that restores the case. This gives the live demo a reliable path without disguising the deferred voice integration.

### 6. Show technical depth through the product surface

The interface should expose the chain that judges otherwise cannot see:

`patient context -> encounter evidence -> proposed action -> clinician decision -> FHIR draft -> patient recap`

This makes the technical architecture understandable without a separate architecture lecture.

## Technical findings

### FHIR output boundary

FHIR R4 `ServiceRequest` represents a request for a clinical service such as a referral, diagnostic test, or treatment. FHIR R4 `Task` describes an activity and tracks its completion. ActionChart should therefore use:

- `ServiceRequest` for referrals, tests, imaging, therapies, and other clinical services.
- `Task` for coordination, scheduling, outreach, logs, reminders, and fulfillment work.

The hackathon build should emit drafts with `status: draft` and `intent: proposal`. Nothing in the demo is a signed clinical order or an instruction sent to a live care team. A clinical service can later have a separate Task that tracks its fulfillment, but the MVP should not duplicate every request.

Sources: [FHIR R4 Task](https://hl7.org/fhir/R4/task.html), [FHIR R4 ServiceRequest](https://hl7.org/fhir/R4/servicerequest.html).

### Provenance and evidence

The app should preserve the source encounter, note excerpt, transcript excerpt, extraction rule, clinician decision, and decision time in its internal review record. FHIR `Provenance` is the appropriate future interoperability resource for recording the agents and entities involved in producing or revising a resource. A full Provenance bundle is useful after the core demo, but it is not required to prove the review workflow.

Source: [FHIR R4 Provenance](https://hl7.org/fhir/R4/provenance.html).

### Voice adapter contract

Replay and future Vapi events should converge on one small contract:

```ts
type VoiceSessionInput = {
  patientId: string;
  sessionId: string;
  status: "started" | "transcript" | "ended";
  transcript?: {
    speaker: "patient" | "clinician";
    text: string;
    sequence: number;
    isFinal: boolean;
  };
};
```

The current build can produce these events locally. The Vapi webhook can translate provider-specific payloads into this shape later without changing patient memory, action review, FHIR mapping, or recap logic.

### Extraction and review model

The supplied SOAP notes already contain structured plan headings and bullets. A deterministic first pass can split SOAP sections, parse plan bullets, assign likely owners, identify ServiceRequest candidates, flag sensitive terms, and attach matching transcript evidence. This is appropriate for a reliable synthetic-data demo and keeps the hard problem focused on supervised review, not a fragile live generation step.

### Safety checks

The following rules should be enforced in code and covered by tests:

- No draft resource before clinician approval.
- No rejected, deferred, or pending item in the patient recap.
- No internal-only item in the patient recap.
- Sensitive actions start as internal-only.
- Every draft resource keeps patient and encounter references.
- Every proposed action keeps exact source evidence.

### State and persistence

Client state plus local storage is sufficient for the hackathon. It preserves the reviewer state across a refresh, requires no hosted database, and can be reset during the demo. The adapter, parser, review state machine, recap filter, and FHIR mappers should remain separate modules so persistence can be replaced later.

## Dataset findings

The supplied data contains 25 synthetic FHIR-backed encounters with a patient resource, longitudinal summary, encounter resources, transcript, SOAP-style note, and after-visit summary. The cases include general examinations, prenatal care, hospital admissions, checkups, hospice care, and isolation.

The interface must label the data as synthetic. It should not imply that the action parser has been clinically validated, that the draft resources were accepted by an EHR, or that the workflow is ready for production use.

## Judging fit

| Criterion | What the demo proves |
|---|---|
| Impact | Returning-patient context and follow-up work survive the encounter instead of becoming disconnected notes. |
| Execution | One complete replay, review, approval, FHIR draft, and recap loop works without credentials. |
| Technical complexity | FHIR-backed longitudinal context, evidence-linked extraction, a review state machine, deterministic safety rules, and provider-neutral voice events. |
| Creativity | The endpoint is doctor-approved action and accountable ownership, not only transcription or SOAP generation. |

## Final recommendations

1. Build Ali's case as the rehearsed three-minute path.
2. Keep the full 25-patient cohort available for credibility and Q&A.
3. Default sensitive actions to internal-only and demonstrate the rule with a second case.
4. Keep Vapi behind the event adapter and label it as ready to connect.
5. Spend remaining time on interaction polish, deterministic reset, and tests rather than adding infrastructure.

## Research metadata

- Research types: Product Features and Technical
- Depth: Standard
- Application: `apps/actionchart-voice/`
- Stack: Next.js 16, React 19, TypeScript 5.9, vinext
- Evidence confidence: High for FHIR resource boundaries; high for dataset structure; medium for interaction recommendations because they are product judgments tested through the demo
- Low-confidence blockers: None

