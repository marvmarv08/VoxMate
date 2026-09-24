# EP-01M375D7: JR Weekly Schedule Answers

> **Status:** Done
> **Parent:** CR01M37591
> **Created:** 2026-09-23
> **Created-by:** sdlc-studio new
> **Raised-by:** Codex; agent; GPT-5
> **Template:** full
> **Size:** M

## Summary

Let JR store recurring weekly classes and answer weekday schedule questions with spoken and visual results.

## Inherited Constraints

> See PRD and TRD for full constraint details. Key constraints for this epic:

| Source | Type | Constraint | Impact |
| --- | --- | --- | --- |
| PRD | Reliability | Answers must come only from stored schedule records. | Use pure deterministic query functions with explicit empty results. |
| PRD | Privacy | Schedule memory remains browser-local. | No backend or remote AI service is introduced. |
| TRD | Architecture | Keep domain logic separate from browser voice APIs. | Add a pure schedule-query module consumed by the voice adapter and UI. |
| TRD | Tech Stack | Preserve the React and TypeScript local-first application. | Reuse current storage and speech synthesis boundaries. |

## Business Context

### Problem Statement

Marvin needs JR to understand a weekday schedule question and present the relevant recurring classes instead of only greeting him.

**PRD Reference:** [Functional Requirements](../prd.md#4-functional-requirements)

### Value Proposition

The feature turns stored information into an immediately useful assistant answer while remaining transparent, local, and testable.

### Success Metrics

| Metric | Current | Target | Measurement |
| --- | --- | --- | --- |
| Weekly schedule persistence | Unsupported | Valid weekly records survive reload | Storage and component tests |
| Weekday schedule answer | Greeting only | Correct visual and spoken match | Query and integration tests |
| Mobile usability | Existing MVP | Query flow works without overflow | Chromium mobile smoke test |

## Scope

### In Scope

- Weekly recurrence with weekday, start/end time, teacher, and room
- JSON/CSV import and manual creation of weekly entries
- Deterministic weekday question parsing and time-ordered matching
- Spoken answer and visible schedule cards through voice or manual text

### Out of Scope

- Background wake words and home-screen overlays
- General AI or inferred schedule information
- Cloud sync, notifications, and calendar integrations

## Acceptance Criteria (Epic Level)

- [ ] Weekly schedule records coexist with existing dated schedules.
- [ ] A weekday question returns only matching records in time order and speaks the same grounded answer shown on screen.
- [ ] Manual text questions cover browsers without speech recognition and honest empty results are shown.
- [ ] Automated checks, production build, and desktop/mobile browser smoke verification pass.

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner |
| --- | --- | --- | --- |
| Existing schedule-memory MVP | Internal foundation | Done | Project |

### Blocking

| Item | Type | Impact |
| --- | --- | --- |
| Native home-screen assistant | Future epic | This web slice supplies reusable domain logic but not OS-level activation. |

## Risks & Assumptions

### Assumptions

- A fixed English weekday vocabulary is sufficient for the first deterministic command.
- Local browser storage remains acceptable for this single-device milestone.

### Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Speech recognition differs by browser | High | Medium | Provide identical manual question flow. |
| Record migration causes data loss | Low | High | Add only optional fields and test legacy version-1 payloads. |

## Technical Considerations

### Architecture Impact

Adds optional weekly fields to the schedule domain and a pure query layer. The browser voice hook receives a response resolver but remains unaware of schedule storage details.

### Integration Points

- Schedule form and JSON/CSV importer
- Versioned local storage
- Browser speech recognition transcript callback
- Browser speech synthesis and assistant dialog

## Sizing

**Size:** M

_A T-shirt size (S / M / L / XL) - the epic's own coarse estimate, made before decomposition. An epic is never sized in story points; STORY points belong on stories._

**Estimated Story Count:** 1

**Derived Point Total:** 5

_DERIVED, not estimated: the sum of this epic's stories' points. `reconcile` recomputes it, so it can never drift from the stories beneath it - do not hand-edit it._

**Complexity Factors:**

- Backward-compatible data evolution
- Voice and manual command parity
- Grounded response construction and responsive result presentation

## Story Breakdown

- [x] [US-01M3759S: Ask JR for a weekday schedule](../stories/US-01M3759S-ask-jr-for-a-weekday-schedule.md)

## Test Plan

- Unit tests cover weekly validation, legacy compatibility, parsing, sorting, and response generation.
- Component tests cover voice and manual weekday questions plus empty results.
- Browser smoke checks exercise the query flow on desktop and mobile.

## Open Questions

- None for this slice.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-23 | Codex | Defined the weekly schedule-answer epic. |
