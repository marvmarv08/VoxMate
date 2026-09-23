# EP-01M37226: JR Schedule Memory MVP

> **Status:** Done
> **Created:** 2026-09-23
> **Created-by:** sdlc-studio new
> **Raised-by:** Codex; agent; GPT-5
> **Template:** full
> **Size:** M

## Summary

Deliver a local-first schedule app with an in-app wake phrase and spoken JR greeting.

## Inherited Constraints

> See PRD and TRD for full constraint details. Key constraints for this epic:

| Source | Type | Constraint | Impact |
| --- | --- | --- | --- |
| PRD | Reliability | Invalid imports must not partially alter memory. | Parse and validate a complete file before updating state. |
| PRD | Privacy | Schedules remain local and microphone use is opt-in. | No backend; clear listening indicator and stop control. |
| TRD | Architecture | Begin as a modular local-first application. | Isolate schedule, storage, and voice behavior for later reuse. |
| TRD | Tech Stack | Use React, TypeScript, Vite, and browser APIs. | Keep the MVP cross-platform without premature native code. |

## Business Context

### Problem Statement

Marvin needs a concrete first version of JR that can remember useful information and respond with a recognizable voice-assistant interaction, without hiding unsupported system-wide behavior.

**PRD Reference:** [Problem Statement](../prd.md#problem-statement)

### Value Proposition

This MVP validates the core product loop—user-controlled memory plus voice activation—while remaining private, understandable, and portable.

### Success Metrics

| Metric | Current | Target | Measurement |
| --- | --- | --- | --- |
| Schedule memory acceptance criteria | 0 verified | 3 verified | Automated story verification |
| Voice interaction acceptance criteria | 0 verified | 3 verified | Mocked browser API integration tests |
| Responsive browser smoke | Not run | Desktop and mobile pass | Playwright Chromium script |

## Scope

### In Scope

- Responsive local-first schedule dashboard
- Manual schedule creation, deletion, and JSON/CSV import
- Opt-in in-app “Hey JR” recognition where browser support exists
- Manual assistant activation and spoken greeting fallback
- Automated checks and real-browser smoke verification

### Out of Scope

- Remote accounts, cloud storage, or synchronization
- General document and image knowledge memory
- System-wide background activation and native packaging
- Predictive analytics or generative AI responses

## Acceptance Criteria (Epic Level)

- [x] Marvin can add, import, view, persist, and delete schedule entries without data leaving the device.
- [x] JR uses the approved circular portrait and speaks the configured greeting when opened manually or through a supported in-app wake phrase.
- [x] Unsupported speech recognition does not block schedule use and is explained clearly.
- [x] Type checks, lint, automated tests, production build, and browser smoke checks pass.

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner |
| --- | --- | --- | --- |
| None | — | — | — |

### Blocking

| Item | Type | Impact |
| --- | --- | --- |
| Future native wake-word milestone | Product follow-up | Does not block this in-app MVP. |

## Risks & Assumptions

### Assumptions

- Browser local storage is acceptable for the first single-device prototype.
- Users understand wake listening only works while the web app remains open.

### Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Speech recognition is unavailable in some browsers | High | Medium | Keep manual activation fully functional and explain support honestly. |
| Local browser data can be cleared | Medium | Medium | Label storage as browser-local; add backup/sync in a later milestone. |
| Always-on listening harms trust or battery | Medium | High | Make listening opt-in with visible state and immediate stop control. |

## Technical Considerations

### Architecture Impact

Introduces platform-neutral schedule parsing/storage modules and a browser-specific voice hook. This separation preserves a path to desktop and mobile adapters.

### Integration Points

- Browser local storage for versioned schedule records
- File input API for JSON and CSV imports
- Browser speech recognition when available
- Browser speech synthesis for the spoken greeting

## Sizing

**Size:** M

_A T-shirt size (S / M / L / XL) - the epic's own coarse estimate, made before decomposition. An epic is never sized in story points; STORY points belong on stories._

**Estimated Story Count:** 2

**Derived Point Total:** 8

_DERIVED, not estimated: the sum of this epic's stories' points. `reconcile` recomputes it, so it can never drift from the stories beneath it - do not hand-edit it._

**Complexity Factors:**

- Browser speech support and permission differences
- Atomic validation for two import formats
- Responsive voice-assistant interaction across desktop and mobile

## Story Breakdown

- [x] [US-01M372SJ: Store and import personal schedules](../stories/US-01M372SJ-store-and-import-personal-schedules.md)
- [x] [US-01M372P9: Greet Marvin when JR wakes](../stories/US-01M372P9-greet-marvin-when-jr-wakes.md)

## Test Plan

- Unit and component tests verify parsing, persistence, fallback behavior, wake detection, speech invocation, and stop controls.
- Type checking, linting, and production build run before completion.
- A Playwright smoke script verifies the shipped UI at desktop and mobile widths.

## Open Questions

- None for the MVP.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-23 | Codex | Defined the MVP boundary and acceptance criteria. |
