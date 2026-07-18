# Session 3 decisions - Build planning

## Final planning decisions

| Decision | Chosen option | Reasoning | Confidence |
|---|---|---|---|
| Delivery sequence | Data, memory and replay, review, outputs, polish | Each phase leaves a coherent working surface and isolates the highest-risk logic. | 98% |
| Parsing approach | Deterministic SOAP and evidence parser | The supplied notes are structured, and reliability matters more than a live generation dependency. | 97% |
| Review persistence | Local storage by patient | Supports refresh and reset without adding infrastructure to the demo. | 96% |
| Safety implementation | Sensitive default plus recap filter | Combines safe defaults with an enforceable output boundary. | 99% |
| Demo interaction | One rehearsed Ali path, other cases on demand | Fits the three-minute constraint while preserving dataset breadth for Q&A. | 99% |
| Validation | Unit checks, typecheck, production build, deployed smoke check | Covers the main logic and deployment risk without building production compliance tooling. | 97% |

## Deferred decisions

- Vapi assistant identifiers, webhook authentication, and call metadata mapping wait for the user's API details.
- Production identity, authorization, encryption, audit retention, EHR writeback, and clinical validation are outside the hackathon build.
- Full FHIR Provenance packaging can follow the internal evidence and decision record.

## CHINTAN outcome

The plan is ready for build instructions. No product-changing choice remains open, and no low-confidence research item requires another user checkpoint.

