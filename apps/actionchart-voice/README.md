# ActionChart Voice

ActionChart is a hackathon demo of a returning-patient call moving from front-desk intake to clinician-approved follow-up.

It uses Vetra's front-door operating model:

1. Capture the reason for contact and match the returning patient.
2. Route the request by urgency without turning triage into diagnosis.
3. Assign an accountable owner and next step.
4. Restore longitudinal patient context.
5. Let a clinician approve, edit, defer, or reject proposed actions.
6. Create draft FHIR resources and a filtered patient recap.

All patient records in this app are synthetic. It does not connect to an EHR, contact a patient, place an order, or make a production triage decision.

## What works

- 25 synthetic FHIR-backed returning-patient cases.
- Structured call log with reason, concerns, urgency, route, owner, next step, and callback state.
- Longitudinal memory from Conditions, Medications, Encounters, Observations, Procedures, and DiagnosticReports.
- Encounter replay over a provider-neutral voice-event contract.
- SOAP parsing and evidence-linked proposed actions.
- Clinician review with editing, ownership, due windows, patient visibility, decisions, and audit history.
- Draft FHIR `Task` resources for operational work and `ServiceRequest` resources for clinical services.
- A patient recap that includes only approved and patient-visible actions.
- Browser-local persistence and one-click reset.

## Run locally

Prerequisites: Node.js 22.13 or newer and npm. No API key is required for replay mode.

From `apps/actionchart-voice/`:

```bash
npm install
npm run prepare:data
npm run dev
```

Open `http://localhost:3000`.

The data-preparation command reads the immutable JSON under `data/source/` and writes the compact application dataset to `app/data/patients.generated.json`.

## Verify

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The checks cover the 25-patient cohort, call logging and triage, voice events, action extraction, review transitions, draft FHIR fields, and patient-recap exclusions.

## Three-minute demo path

1. Reset Ali Jerry Kuhic's case.
2. Show the call log: routine, primary-care scheduling, front-desk owner, transportation support flagged.
3. Show patient memory from prior FHIR resources.
4. Process the encounter replay.
5. Approve the dental referral, edit or approve the headache log, and keep one item internal.
6. Open Approved outputs.
7. Show the Task and ServiceRequest JSON, then the filtered patient recap.

## Voice integration boundary

Replay and a future Vapi webhook use this contract:

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

`POST /api/voice/session` validates `application/json` events and limits requests to 16 KB. Until Vapi credentials and webhook details are added, a valid event returns HTTP `501`:

```json
{
  "code": "config_required",
  "message": "The voice event contract is ready. Add Vapi credentials to enable live sessions.",
  "accepted": {
    "patientId": "synthetic-patient-id",
    "sessionId": "demo-session",
    "status": "started"
  }
}
```

Invalid JSON, an invalid event shape, a wrong content type, or an oversized request returns a specific 4xx response. The route does not log transcript text.

## Output boundaries

- A referral, diagnostic test, imaging request, or therapy becomes a draft `ServiceRequest`.
- Outreach, scheduling, coordination, and reminders become draft `Task` resources.
- Both use `status: draft` and `intent: proposal`.
- Pending, deferred, and rejected items create no draft.
- The patient recap receives only items where `status === "approved"` and `patientVisible === true`.

Sensitive actions start as internal. These are demo-shaped FHIR R4 resources, not validated EHR orders.

## Project structure

```text
app/
  api/voice/session/route.ts   Future live voice adapter
  data/patients.generated.json
  globals.css                  Product visual system
  page.tsx                     Interactive clinician workspace
data/source/                   Immutable synthetic source JSON
lib/
  actions.ts                   Evidence-linked action extraction
  fhir.ts                      Task and ServiceRequest mapping
  patients.ts                  Patient access and display helpers
  recap.ts                     Approved and visible recap filter
  review.ts                    Review state transitions and audit
  review-storage.ts            Local persistence adapter
  triage.ts                    Front-desk call log and routing
  types.ts                     Shared domain types
  voice-contract.ts            Provider-neutral event validation
scripts/prepare-data.mjs       Deterministic data preparation
tests/                         Data, workflow, output, and surface checks
```

## Known limitations

- The call log is a clearly labeled demo derivation from each supplied encounter, not an original call record in the dataset.
- Triage categories are deterministic routing aids. They are not clinically validated and do not replace a clinician or local protocol.
- The action extractor uses the supplied SOAP structure and simple evidence matching. Every action still requires review.
- Review state is stored in the current browser only.
- Live Vapi and Deepgram Nova-3 mapping is deferred until API details are provided.
- There is no identity, authorization, EHR writeback, or production audit store.
