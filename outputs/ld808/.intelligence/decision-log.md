# Decision Log - All Projects

## Meta
- **Total Decisions:** 13
- **Projects Covered:** [vetra]
- **Date Range:** 2026-07-18 to 2026-07-18
- **Last Updated:** 2026-07-18
- **Categories:** Technical: 4 | Product: 4 | Design: 1 | Process: 4 | Preference: 0 | Domain: 0 | Meta: 0
- **CHINTAN Performance:**
  - Auto-answered: 7
  - Suggested-confirmed: 0
  - Suggested-overridden: 0
  - Human-answered: 6

---

## Recent Decisions (last 20)

### Decision #13
- **Timestamp:** 2026-07-18T13:31:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 5
- **Phase:** Front-door workflow
- **Part:** -
- **Message Summary:** Lakshraj asked to use Vetra's front-desk context for logging and triaging the call.
- **Decision Type:** explicit
- **Category:** Product
- **Decision:** Start the demo with a structured Capture, Route, Assign handoff before patient memory and clinician review.
- **Reasoning:** It connects the hackathon workflow to Vetra's strongest front-door product model and makes urgency, ownership, and next action visible.
- **Alternatives Considered:** Keep the replay encounter-first; change the synthetic data into veterinary cases.
- **Decided By:** human
- **CHINTAN Confidence:** 100%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** front-desk, call-log, triage, capture, route, assign
- **Outcome:** positive
- **Outcome Notes:** Implemented and covered by the test suite.

### Decision #12
- **Timestamp:** 2026-07-18T13:08:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 4
- **Phase:** Instruction format
- **Part:** -
- **Message Summary:** The build spans multiple modules and risk boundaries, so Session 4 selected the Zivon multi-phase format.
- **Decision Type:** auto-chintan
- **Category:** Process
- **Decision:** Use five delivery phases followed by separate hardening, cleanup, and documentation phases.
- **Reasoning:** This keeps setup free of feature code, makes each increment verifiable, and prevents safety and documentation work from becoming optional.
- **Alternatives Considered:** One master checklist; combine all post-coding work into the UI phase.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 99%
- **Reversibility:** easy
- **Impact Scope:** this-session
- **Tags:** instructions, phases, verification, zivon
- **Outcome:** positive
- **Outcome Notes:** Eight build-ready phase files were created.

### Decision #11
- **Timestamp:** 2026-07-18T12:42:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 3
- **Phase:** Demo architecture
- **Part:** B
- **Message Summary:** The implementation plan resolved how much product breadth appears in the live flow.
- **Decision Type:** auto-chintan
- **Category:** Design
- **Decision:** Rehearse one Ali path in the primary flow and keep the other 24 patients available for credibility and Q&A.
- **Reasoning:** This fits the three-minute window while retaining the breadth of the supplied dataset.
- **Alternatives Considered:** Tour several cases; hide the cohort and ship only one case.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 99%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** demo, interaction, cohort, judging
- **Outcome:** pending
- **Outcome Notes:** Phase 5 includes rehearsal and deterministic reset.

### Decision #10
- **Timestamp:** 2026-07-18T12:37:00-07:00
- **Project:** vetra
- **Session/Mode:** Session 3
- **Phase:** Extraction architecture
- **Part:** A
- **Message Summary:** The build plan resolved whether the demo needs a live model dependency for action extraction.
- **Decision Type:** auto-chintan
- **Category:** Technical
- **Decision:** Use a deterministic SOAP and evidence parser for the synthetic demo, with clinician review as the authority boundary.
- **Reasoning:** The supplied notes have reliable structure, and the approach keeps the live demo reproducible while preserving an upgrade path.
- **Alternatives Considered:** Live model extraction; manually author every action.
- **Decided By:** chintan-auto
- **CHINTAN Confidence:** 97%
- **Reversibility:** easy
- **Impact Scope:** this-project
- **Tags:** parser, extraction, reliability, review
- **Outcome:** pending
- **Outcome Notes:** Tests will cover ordinary and sensitive plan items.

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
- Decision #10: Use deterministic SOAP and evidence extraction for the synthetic demo.
- Decision #9: Build the patient recap through a deterministic approval and visibility filter.
- Decision #8: Use ServiceRequest for clinical-service requests and Task for operational work.
- Decision #6: Build an isolated ActionChart app with replay mode and a later Vapi adapter.

### Product Decisions
- Decision #13: Add Vetra's front-desk call logging and triage context before clinician review.
- Decision #7: Optimize the build and demo around the supplied judging process.
- Decision #5: Keep ActionChart in the human-healthcare domain.
- Decision #4: Defer Vapi and build the complete downstream workflow now.

### Design Decisions
- Decision #11: Center the rehearsed live demo on Ali and keep the full cohort for Q&A.

### Process Decisions
- Decision #12: Use a five-phase build followed by hardening, cleanup, and documentation.
- Decision #3: Use the focused onboarding set and defer unrelated documentation.
- Decision #2: Onboard the Vetra root and auto-resolve reversible workflow choices.
- Decision #1: Continue into mandatory Session 0 onboarding.

### Preference Decisions
(no entries yet)

### Domain Decisions
(no entries yet)

### Meta Decisions
(no entries yet)
