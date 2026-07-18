# Session 4 decisions - Instruction generation

## Format decision

Multi-phase instructions are required because the work changes more than three modules and includes independent data, state, interoperability, safety, UI, and deployment risks.

## Instruction decisions

| Decision | Chosen option | Reasoning |
|---|---|---|
| Setup phase | Scaffold verification, source copy, commands, and test harness only | The Zivon format keeps feature work out of Phase 1. |
| Coding phases | Four domain phases plus one UI phase | Each phase leaves a testable product increment and isolates risk. |
| Post-coding | Separate hardening, cleanup, and documentation phases | Safety checks and polish cannot be treated as optional final notes. |
| Documentation boundary | App-local README and optional app-local CLAUDE.md | The repository root CLAUDE.md describes the separate Vetra veterinary product. |
| Completion record | Master log plus execution trace | Makes deviations and actual verification visible during implementation. |

## Outcome

The instruction set is build-ready. No unresolved user decision blocks implementation, so Session 5 can start immediately.

