# ActionChart Voice project context

ActionChart is a standalone human-healthcare hackathon demo under the Vetra repository. Reuse Vetra's Capture, Route, Assign workflow model, but do not mix veterinary copy, pet records, or clinic-specific claims into this app.

## Product boundary

- Capture the returning patient's reason for contact and relevant context.
- Route by urgency while stating that triage is not diagnosis.
- Assign an owner and concrete next step.
- Require clinician review before creating draft clinical or operational outputs.
- Build the patient recap only from approved and patient-visible actions.

## Source boundary

The file under `data/source/` is copied from the supplied synthetic archive and must remain unchanged. Run `npm run prepare:data` to regenerate `app/data/patients.generated.json`.

## Commands

```bash
npm run prepare:data
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

## Integration boundary

`POST /api/voice/session` is the future Vapi adapter. Translate provider-specific payloads into `VoiceSessionInput` without changing triage, patient memory, review, FHIR, or recap modules. Never log transcript text.

## Safety language

Always label data as synthetic and FHIR outputs as draft proposals. Do not claim EHR writeback, signed orders, production triage, HIPAA readiness, or clinical validation.
