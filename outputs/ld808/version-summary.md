# Version summary

- **Project ID:** 22605722-e3ee-453d-a4c8-a4e59c7f3d0d
- **Schema:** 1.0
- **Version:** 0
- **Project:** ActionChart Voice in the Vetra repository
- **Contributor:** ld808 - Lakshraj Doshi
- **Last Updated:** 2026-07-18

## Tech stack

Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, vinext, Vite, synthetic FHIR R4-shaped JSON, and an external Vapi stack that is deferred until API access is supplied.

## Architecture

ActionChart is a separate human-healthcare demo under `apps/actionchart-voice/`. It converts synthetic chart context and a replay transcript into a doctor review packet. The doctor can approve, edit, reject, or defer proposed actions. Approved items create local draft FHIR Task or ServiceRequest resources. The patient recap uses approved, patient-visible items only.

The app works without live voice. A future Vapi adapter will provide transcript events through a narrow API boundary.

## Features

### Existing baseline

1. Vetra product positioning and supervised workflow rules.
2. A private Vetra research intake app.
3. Detailed Vapi assistant and provider snapshots using Deepgram Nova-3.
4. A scoped ActionChart product brief.
5. A synthetic dataset with 25 patients, transcripts, SOAP notes, encounter resources, and after-visit summaries.
6. A new Sites application shell for ActionChart.

## File structure

| Path | Purpose |
|------|---------|
| `apps/actionchart-voice/` | New human-healthcare hackathon application |
| `apps/vetra-wiki/` | Existing Vetra research and intake application |
| `outputs/vapi-dr-wendy-copy-composer/` | Existing veterinary Vapi configuration reference |
| `outputs/hackathon-returning-patient-voice-demo/` | Initial ActionChart project scope |
| `outputs/ld808/` | Zivon planning and decision artifacts for this contribution |
| `wiki/` | Canonical Vetra knowledge base |

## Known issues

1. Vapi credentials and API details are not available yet.
2. The existing webhook referenced by Vapi snapshots is not implemented in this repository.
3. Dataset summary labels are not complete FHIR resources.
4. Root documentation does not fully reflect the current repository layout.
5. The new ActionChart application has not yet completed its production build or workflow tests.

## Version history

### V0: Codebase onboarding

The baseline repository is a multi-purpose Vetra workspace with one production-shaped research app, several standalone product artifacts, and detailed veterinary voice configurations. The new ActionChart contribution is a separate human-healthcare demo built around synthetic FHIR data and a supervised doctor review gate. The main integration gap is live Vapi access, which is intentionally deferred. V0 records what existed at onboarding and the boundaries that the first implementation must preserve.
