# US-01M372SJ: Store and import personal schedules

> **Status:** Done
> **Created:** 2026-09-23
> **Created-by:** sdlc-studio new
> **Raised-by:** Codex; agent; GPT-5
> **Template:** full
> **Affects:** src/App.tsx, src/schedule.ts, src/storage.ts, src/schedule.test.ts, src/App.test.tsx
> **Epic:** EP-01M37226
> **Points:** 5
> **Persona:** Marvin

## User Story

**As a** Marvin
**I want** to add or import schedule entries into JR
**So that** I can see and control the information JR remembers about my time.

## Context

### Persona Reference

**Marvin** — Beginner project owner who needs a clear view of what JR remembers and simple ways to correct it.
[Full persona details](../personas.md#marvin--primary)

### Background

Schedules are the first deliberately limited memory type. This proves that JR can accept user-controlled data, validate it, persist it, and present it clearly without a remote account.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scope | MVP memory is limited to structured schedules. | Word, PDF, and image understanding remain out of scope. |
| PRD | Reliability | An invalid import must not partially modify memory. | Parse and validate the whole file before updating state. |
| PRD | Privacy | Schedule records remain on the current device. | Use browser local storage and no application backend. |

## Acceptance Criteria

- **AC1:** Given valid title, date, and time values, when Marvin saves a schedule entry, then the entry appears in chronological order and remains after a page reload.
  - **Verify:** npm test -- --run src/schedule.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-23)
  - **Verification target:** functional
- **AC2:** Given a valid JSON or CSV schedule file, when Marvin imports it, then every valid row is added without removing existing entries.
  - **Verify:** npm test -- --run src/schedule.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-23)
  - **Verification target:** functional
- **AC3:** Given a malformed or unsupported schedule file, when Marvin imports it, then the app shows a clear error and preserves all existing entries.
  - **Verify:** npm test -- --run src/schedule.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-23)
  - **Verification target:** functional

## Scope

### In Scope

- Manual entry with title, date, time, and optional notes
- Chronological schedule display
- Local persistence and explicit deletion
- JSON and CSV import with validation

### Out of Scope

- Calendar-provider integrations
- Cloud synchronization
- PDF, Word, and image extraction

## Technical Notes

Use pure parsing and validation functions so malformed imports cannot partially replace stored data. Persist only a versioned schedule record collection in browser local storage.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Required title, date, or time is missing | Reject the entry with a clear field-level message. |
| Date or time is not real | Reject the entry before saving. |
| JSON is syntactically invalid | Show an error and preserve all existing schedules. |
| A CSV row has a different column count | Reject the complete import without partial additions. |
| Stored browser data is malformed | Recover to an empty list without crashing the app. |

## Test Scenarios

- [x] Save valid entries and display them in chronological order.
- [x] Restore versioned schedule memory after remounting.
- [x] Import valid JSON and CSV schedules.
- [x] Reject malformed and unsupported imports atomically.
- [x] Recover safely from malformed local storage.

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| None | — | This story is independently deliverable. | — |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Browser local storage | Platform capability | Available in the target web MVP. |
| File input API | Platform capability | Available in modern browsers. |

## Estimation

**Points:** 5
**Complexity:** Medium — parsing, atomic validation, persistence, and responsive UI are included.

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

Not applicable – this MVP is not deployed to a production runtime.

## Open Questions

- None for this MVP.

## Summary

Let Marvin add, import, review, persist, and delete schedule entries on the current device.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-23 | Codex | Authored implementation-ready MVP criteria. |
