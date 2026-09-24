# CR-01M37591: Add recurring schedule voice lookup

> **Status:** Complete
> **Triaged-by:** Marvin; human; owner
> **Decomposed-into:** US01M3759S
> **Created:** 2026-09-23
> **Created-by:** sdlc-studio new
> **Raised-by:** Codex; agent; GPT-5
> **Affects:** sdlc-studio/prd.md, sdlc-studio/trd.md, sdlc-studio/tsd.md, src/types.ts, src/schedule.ts, src/scheduleQuery.ts, src/storage.ts, src/useVoiceAssistant.ts, src/App.tsx, src/styles.css, src/schedule.test.ts, src/scheduleQuery.test.ts, src/storage.test.ts, src/App.test.tsx, tests/browser-smoke.mjs, README.md
> **Priority:** P2
> **Type:** feature-request
> **Size:** M

## Summary

Add weekly schedule records and deterministic weekday questions to the in-app JR experience.

## Problem

JR can store dated events but cannot represent a weekly class timetable or answer a question such as “What is my schedule on Wednesday?” The next slice must add that capability without pretending to provide unrestricted AI or system-wide background listening.

---

## Proposed Changes

### Item 1: Weekly schedule model and lookup

<!-- `Item points`, never `Points`: story points belong on the stories this CR decomposes into,
and a per-item field spelled `Points` would be mis-read as a CR-level size (the CR is sized by
its T-shirt `Size` above, not by points). Keep the per-item estimate spelled `Item points`. -->

**Item priority:** P2
**Item points:** 5

Extend local schedule records with weekly recurrence and structured class details, then add deterministic weekday parsing, spoken answers, and matching visual cards for voice and manual questions.

---

## Impact Assessment

Marvin can ask JR for a weekday schedule and receive a grounded spoken and visual answer; existing saved schedules remain readable.

<!-- The CR's own size is the T-shirt `**Size:**` in the metadata block above (S/M/L/XL), not
points. A CR is a request, sized before it is decomposed; story points belong on the stories. -->

### Existing Functionality

Existing dated schedules, imports, storage, deletion, and manual JR activation must continue to work. Optional fields extend the existing storage record instead of replacing it.

### Affected Modules

| Module | Impact | Change Type |
| --- | --- | --- |
| Schedule domain | Add weekly recurrence, weekdays, and structured class details | Modified |
| Voice interaction | Route recognized weekday questions to a grounded answer | Modified |
| Assistant UI | Show manual question input and matching schedule cards | Modified |
| Automated verification | Cover compatibility, queries, empty results, and responsive UI | Modified |

### Breaking Changes

None intended. Existing version-1 local schedule records remain valid and load with one-time defaults.

---

## Acceptance Criteria

- [x] Weekly schedule entries can be created or imported with weekday, start time, optional end time, teacher, and room.
- [x] When JR hears or receives a question asking for a weekday schedule, it shows matching records and speaks an answer based only on stored data.
- [x] Existing one-time schedules and unsupported speech browsers continue to work through backward-compatible storage and manual text input.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Weekday parser matches unrelated speech | Medium | Medium | Require both a schedule-related phrase and an explicit weekday. |
| Existing browser records stop loading | Low | High | Keep all new fields optional and test legacy records directly. |
| Spoken answer invents missing details | Low | High | Build responses exclusively from matched stored records. |

---

## Dependencies

### CR Dependencies

| CR | Title | Status | Required Before |
| --- | --- | --- | --- |
| None | — | — | — |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Browser speech synthesis | Optional platform capability | Manual visual answers remain available. |

---

## Linked Epics

> *Populated when CR is actioned via `/sdlc-studio cr action`*

| Epic | Title | Status |
| --- | --- | --- |
| [EP-01M375D7](../epics/EP-01M375D7-jr-weekly-schedule-answers.md) | JR Weekly Schedule Answers | Done |

---

## Out of Scope

- System-wide background activation or overlays outside the web app
- General-purpose AI question answering
- Cloud synchronization and calendar-provider integrations

---

## Open Questions

- None for this web slice.

---

## Close Reason

> *Filled when CR is closed*

**Outcome:** Complete
**Rationale:** The linked epic and story passed all acceptance verifiers plus desktop and mobile browser smoke checks.

---

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-23 | Marvin | Requested recurring schedule answers through JR. |
| 2026-09-24 | Codex | Completed the verified weekly schedule query feature. |
