# Research instructions - ActionChart Voice

## Research Categories

- Product Features
- Technical
- Market: not required for this version

## Product Feature Research

### Questions

1. Which interface patterns let a clinician review proposed actions quickly without hiding uncertainty or evidence?
2. What information belongs in a compact returning-patient memory view?
3. How should approve, edit, reject, defer, ownership, and patient visibility appear in a three-minute demo?
4. Which product details best distinguish a memory-to-action workflow from an ambient scribe?
5. What replay and reset behavior makes a live hackathon demo reliable?

### Expected Output

A concise set of product recommendations tied to the ActionChart screens, judge flow, and safety boundary. Each recommendation should state the feature decision and its effect on the demo.

## Technical Research

### Questions

1. How should approved operational actions map to FHIR R4 Task drafts?
2. When should an approved item use ServiceRequest instead of Task?
3. What data contract should separate replay input from the future Vapi adapter?
4. How can patient recap leakage be prevented and tested?
5. What is the smallest architecture that still shows genuine engineering depth?
6. Which parts of the supplied synthetic data need explicit limitations in the UI or developer notes?

### Expected Output

A decision-oriented technical note with final stack choice, module boundaries, data contracts, testing implications, and direct links to authoritative FHIR references. Avoid general framework comparisons unless the chosen local stack cannot meet the requirement.

## Market Research

### Questions

N/A for this version.

### Expected Output

N/A. The supplied judging rubric and existing Vetra research are enough for the hackathon positioning.

## Research Depth

Standard. The build is time constrained, the product direction is already clear, and the highest-value unknowns are narrow technical and interaction decisions. Verify critical FHIR claims through authoritative sources and spend the remaining time on execution.

## Out of Scope

- Market size and pricing.
- A broad ambient-scribe competitor matrix.
- Production HIPAA or security certification claims.
- Model benchmarking or fine-tuning.
- Vapi provider configuration before API access arrives.
- Live EHR integration.
