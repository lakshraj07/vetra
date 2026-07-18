# Decision Log - All Projects

## Meta
- **Total Decisions:** 9
- **Projects Covered:** [vetra]
- **Date Range:** 2026-07-18 to 2026-07-18
- **Last Updated:** 2026-07-18
- **Categories:** Technical: 3 | Product: 3 | Design: 0 | Process: 3 | Preference: 0 | Domain: 0 | Meta: 0
- **CHINTAN Performance:**
  - Auto-answered: 4
  - Suggested-confirmed: 0
  - Suggested-overridden: 0
  - Human-answered: 5

---

## Recent Decisions (last 20)

### Decision #9
- **Timestamp:** 2026-07-18T12:24:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 2
- **Phase:** Output safety
- **Part:** B
- **Message Summary:** Research resolved how approved information may reach a patient-facing recap.
- **Decision Type:** auto-chintan
- **Category:** Technical
- **Decision:** Generate the recap only from actions that are approved and patient-visible, using a deterministic filter enforced at render time.
- **Reasoning:** The safety rule remains visible, testable, and independent of model prompting.
- **Alternatives Considered:** Prompt-only filtering; manual recap editing.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 99%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** safety, recap, approval, visibility
- **Outcome:** pending
- **Outcome Notes:** Added to the research findings and test requirements.

### Decision #8
- **Timestamp:** 2026-07-18T12:21:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 2
- **Phase:** Interoperability boundary
- **Part:** A
- **Message Summary:** Official FHIR R4 definitions were used to separate clinical requests from operational work.
- **Decision Type:** auto-chintan
- **Category:** Technical
- **Decision:** Emit draft ServiceRequest resources for clinical services and draft Task resources for operational follow-up.
- **Reasoning:** ServiceRequest describes requested services, while Task represents and tracks an activity.
- **Alternatives Considered:** Use Task for every action; use ServiceRequest for every action.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 99%
- **Reversibility:** moderate
- **Impact Scope:** this-project
- **Tags:** fhir, task, service-request, interoperability
- **Outcome:** pending
- **Outcome Notes:** Implementation must preserve patient and encounter references.

### Decision #7
- **Timestamp:** 2026-07-18T12:00:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 1
- **Phase:** Success criteria
- **Part:** A
- **Message Summary:** Lakshraj supplied the two-round judging process, three-minute demo window, and scoring criteria.
- **Decision Type:** explicit
- **Category:** Product
- **Decision:** Optimize the build and demo for a complete three-minute flow, while making impact, technical depth, and originality visible on screen.
- **Reasoning:** Execution has the largest supplied Round One weight, and a focused working build is explicitly favored over a broken ambitious one.
- **Alternatives Considered:** Maximize feature count; rely on narration to explain incomplete technical work.
- **Decided By:** human
- **CHINTAN Confidence:** 100%
- **Reversibility:** moderate
- **Impact Scope:** this-project
- **Tags:** judging, demo, execution, originality, technical-complexity
- **Outcome:** pending
- **Outcome Notes:** Added to project success criteria, research scope, and build priorities.

### Decision #6
- **Timestamp:** 2026-07-18T11:52:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 0
- **Phase:** Architecture boundary
- **Part:** -
- **Message Summary:** CHINTAN selected a separate Sites application with replay mode and a future transcript adapter.
- **Decision Type:** auto-chintan
- **Category:** Technical
- **Decision:** Build under `apps/actionchart-voice/`, use local replay now, and add Vapi later through an isolated API contract.
- **Reasoning:** This keeps human-healthcare data separate from veterinary assistants and allows every downstream workflow to run without credentials.
- **Alternatives Considered:** Modify an existing Vetra app; block all work until Vapi access arrives.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 97%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** app-architecture, replay, vapi, adapter
- **Outcome:** pending
- **Outcome Notes:** Implementation is underway.

### Decision #5
- **Timestamp:** 2026-07-18T11:51:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 0
- **Phase:** Domain resolution
- **Part:** -
- **Message Summary:** Lakshraj accepted the recommendation to keep the hackathon demo in the human-healthcare domain.
- **Decision Type:** suggested-confirmed
- **Category:** Product
- **Decision:** Treat ActionChart as a standalone human-healthcare demo that reuses Vetra workflow principles without veterinary branding.
- **Reasoning:** The supplied dataset, event, patient language, doctor role, and FHIR workflow are all human healthcare.
- **Alternatives Considered:** Convert cases to veterinary records; mix human cases into Vetra branding.
- **Decided By:** chintan-suggested->human-confirmed
- **CHINTAN Confidence:** 100%
- **Reversibility:** moderate
- **Impact Scope:** this-project
- **Tags:** domain, human-healthcare, branding, actionchart
- **Outcome:** positive
- **Outcome Notes:** The architecture now isolates the demo from veterinary assets.

### Decision #4
- **Timestamp:** 2026-07-18T11:50:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 0
- **Phase:** Integration scope
- **Part:** -
- **Message Summary:** Lakshraj asked to leave the Vapi voice agent until API access is provided and build everything else now.
- **Decision Type:** explicit
- **Category:** Product
- **Decision:** Defer live Vapi integration without reducing the patient memory, replay, SOAP, review, FHIR, or recap scope.
- **Reasoning:** The core workflow can be built and tested from supplied transcripts. Voice can connect later at the transcript boundary.
- **Alternatives Considered:** Wait for Vapi; remove the intake flow entirely.
- **Decided By:** human
- **CHINTAN Confidence:** 100%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** vapi, scope, replay, implementation
- **Outcome:** pending
- **Outcome Notes:** Live voice remains the only deferred component.

### Decision #3
- **Timestamp:** 2026-07-18T11:43:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 0
- **Phase:** Documentation discovery
- **Part:** -
- **Message Summary:** CHINTAN narrowed 121 Markdown files to the 12 directly relevant sources, plus the Vapi configuration and synthetic dataset.
- **Decision Type:** auto-chintan
- **Category:** Process
- **Decision:** Defer unrelated repository documentation and use the focused onboarding set.
- **Reasoning:** The selected sources cover product boundaries, voice behavior, technical configuration, FHIR context, and the proposed review workflow. The choice is reversible.
- **Alternatives Considered:** Read all 121 Markdown files; read only the root README-style documents.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 95%
- **Reversibility:** trivial
- **Impact Scope:** this-session
- **Tags:** documentation, scope, prioritization, speed
- **Outcome:** positive
- **Outcome Notes:** The focused read surfaced five material contradictions and gaps.

### Decision #2
- **Timestamp:** 2026-07-18T11:40:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 0
- **Phase:** Codebase-path confirmation
- **Part:** -
- **Message Summary:** Lakshraj confirmed the Vetra repository path and requested fast progression with quick updates.
- **Decision Type:** explicit
- **Category:** Process
- **Decision:** Onboard the Vetra repository root and auto-resolve obvious, reversible workflow choices.
- **Reasoning:** The requested pace favors focused analysis and minimal blocking questions while preserving explicit confirmation for product-changing choices.
- **Alternatives Considered:** Onboard a smaller subdirectory; stop for approval at every checkpoint.
- **Decided By:** human
- **CHINTAN Confidence:** 100%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** codebase-path, speed, autonomy, onboarding
- **Outcome:** positive
- **Outcome Notes:** Documentation discovery and contradiction analysis proceeded immediately.

### Decision #1
- **Timestamp:** 2026-07-18T11:32:08-07:00
- **Project:** vetra
- **Session/Mode:** Session 0
- **Phase:** Codebase onboarding activation
- **Part:** -
- **Message Summary:** Lakshraj confirmed that the Zivon workflow should continue after contributor and Git setup.
- **Decision Type:** explicit
- **Category:** Process
- **Decision:** Continue into the mandatory Session 0 onboarding checkpoint.
- **Reasoning:** The repository contains existing code, so Zivon routes the contribution through Session 0 before product scoping.
- **Alternatives Considered:** Pause after setup; skip directly to Session 1.
- **Decided By:** human
- **CHINTAN Confidence:** 100%
- **Reversibility:** easy
- **Impact Scope:** this-session
- **Tags:** zivon, session-0, onboarding, continuation
- **Outcome:** pending
- **Outcome Notes:** Awaiting codebase-path confirmation.

---

## Full Log by Category

### Technical Decisions
- Decision #9: Build the patient recap through a deterministic approval and visibility filter.
- Decision #8: Use ServiceRequest for clinical-service requests and Task for operational work.
- Decision #6: Build an isolated ActionChart app with replay mode and a later Vapi adapter.

### Product Decisions
- Decision #7: Optimize the build and demo around the supplied judging process.
- Decision #5: Keep ActionChart in the human-healthcare domain.
- Decision #4: Defer Vapi and build the complete downstream workflow now.

### Design Decisions
(no entries yet)

### Process Decisions
- Decision #3: Use the focused onboarding set and defer unrelated documentation.
- Decision #2: Onboard the Vetra root and auto-resolve reversible workflow choices.
- Decision #1: Continue into mandatory Session 0 onboarding.

### Preference Decisions
(no entries yet)

### Domain Decisions
(no entries yet)

### Meta Decisions
(no entries yet)
