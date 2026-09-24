# US-01M3759S: Ask JR for a weekday schedule

> **Status:** Done
> **Parent:** CR01M37591
> **Created:** 2026-09-23
> **Created-by:** sdlc-studio new
> **Raised-by:** Codex; agent; GPT-5
> **Template:** full
> **Affects:** src/types.ts, src/schedule.ts, src/scheduleQuery.ts, src/storage.ts, src/useVoiceAssistant.ts, src/App.tsx, src/styles.css, src/schedule.test.ts, src/scheduleQuery.test.ts, src/storage.test.ts, src/App.test.tsx, tests/browser-smoke.mjs
> **Epic:** EP-01M375D7
> **Points:** 5
> **Persona:** Marvin

## User Story

**As a** Marvin
**I want** to ask JR for my schedule on a weekday
**So that** I can see and hear my classes without searching the full list.

## Context

### Persona Reference

**Marvin** — Beginner project owner who needs quick, trustworthy access to his own schedule.
[Full persona details](../personas.md#marvin--primary)

### Background

The current assistant can wake and greet Marvin but cannot interpret a schedule question. Existing dated records must continue working as weekly recurrence is introduced.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Grounding | Answers use only matching stored records. | Tests compare displayed and spoken content to saved data. |
| PRD | Compatibility | Existing dated schedules remain usable. | Legacy storage and import tests must stay green. |
| PRD | Privacy | Queries and records stay on device. | No backend or external AI call is added. |

## Acceptance Criteria

- **AC1:** Given a valid weekly entry or import, when Marvin saves it, then JR preserves its weekday and structured class details and keeps existing one-time records compatible.
  - **Verify:** npm test -- --run src/schedule.test.ts src/storage.test.ts
  - **Verified:** yes (2026-09-24)
  - **Verification target:** functional
- **AC2:** Given stored Wednesday classes, when the transcript or manual question asks what is scheduled on Wednesday, then JR shows only those classes in time order and speaks a grounded summary.
  - **Verify:** npm test -- --run src/scheduleQuery.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-24)
  - **Verification target:** functional
- **AC3:** Given no matching entries or unsupported speech recognition, when Marvin asks through the manual input, then JR provides an honest empty answer without blocking schedule management.
  - **Verify:** npm test -- --run src/scheduleQuery.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-24)
  - **Verification target:** functional

## Scope

### In Scope

- Weekly schedule creation and structured import
- English weekday question parsing
- Voice and manual question entry
- Visual and spoken grounded answers

### Out of Scope

- System-wide or closed-app activation
- Free-form conversational AI
- Notifications and calendar synchronization

## Technical Notes

Use optional fields on version-1 schedule records for backward compatibility. Put transcript parsing, filtering, and response construction in pure functions. The voice hook accepts a resolver and speaks its result; the app derives matching cards from the same query.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Question contains a weekday but not schedule intent | Do not treat it as a schedule command. |
| Weekday has no saved records | Say and show that nothing is scheduled. |
| Legacy dated entry lacks weekly fields | Load and display it unchanged. |
| Weekly entry lacks a date | Validate using its weekday instead of rejecting it. |
| Recognition is unavailable | Manual question input remains available. |

## Test Scenarios

- [ ] Create, import, store, reload, and display a weekly record.
- [ ] Preserve and query legacy dated records without migration loss.
- [ ] Parse schedule questions for every English weekday and reject unrelated text.
- [ ] Return Wednesday matches in start-time order and exclude other days.
- [ ] Show and speak an honest empty answer through manual fallback.

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| None | — | Existing MVP modules are already complete. | — |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Browser speech recognition | Optional capability | Manual fallback implemented. |
| Browser speech synthesis | Optional capability | Visual answer remains available. |

## Estimation

**Points:** 5
**Complexity:** Medium — data compatibility, deterministic language parsing, and voice/UI synchronization cross multiple existing modules.

> **Points** are a RELATIVE size on the modified Fibonacci scale (1, 2, 3, 5, 8, 13, 20) - not
> "how long will this take" but "is this bigger than that one", sized against stories already
> delivered. The gaps widen deliberately, because uncertainty grows with size: it is much harder
> to argue a story is a 7 rather than an 8 than to choose between a 5 and an 8. A value off the
> scale is REFUSED, never rounded - the scale IS the estimate. Above 8, SPLIT the story;
> estimator consistency collapses beyond it, so a bigger number is a triage failure rather than
> a harder estimate. This is the one size vocabulary: the planner, the forecast and the measured
> velocity all read this field.

## Rollback Envelope

> Required when `affects_production_runtime: true`; optional otherwise. See `reference-story.md#rollback-envelope`.

**Affects production runtime:** false

Not applicable – the application is not deployed to a production runtime.

## Open Questions

- None for this slice.

## Summary

Store weekly schedules and provide grounded spoken and visual weekday answers through voice or text.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-23 | Codex | Defined implementation-ready weekly query behavior. |
