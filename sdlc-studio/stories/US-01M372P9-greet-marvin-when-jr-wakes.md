# US-01M372P9: Greet Marvin when JR wakes

> **Status:** Done
> **Created:** 2026-09-23
> **Created-by:** sdlc-studio new
> **Raised-by:** Codex; agent; GPT-5
> **Template:** full
> **Affects:** src/App.tsx, src/useVoiceAssistant.ts, src/voice.ts, src/voice.test.ts, src/App.test.tsx, public/jr-avatar.png
> **Epic:** EP-01M37226
> **Points:** 3
> **Persona:** Marvin

## User Story

**As a** Marvin
**I want** JR to appear and speak after I say “Hey JR”
**So that** starting a conversation feels natural and personal.

## Context

### Persona Reference

**Marvin** — Beginner project owner who wants a natural assistant while retaining control of microphone use and stored data.
[Full persona details](../personas.md#marvin--primary)

### Background

The MVP needs to prove JR's recognizable interaction loop before general conversation is added: an explicit wake-listening control, the phrase “Hey JR,” a portrait popup, and a spoken greeting.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scope | Wake recognition is in-app only; system-wide background activation is deferred. | UI copy and tests must not claim closed-app listening. |
| PRD | Compatibility | Speech recognition is not supported consistently across browsers. | Manual activation must provide the same popup and greeting. |
| PRD | Privacy | Microphone access must be explicit and user-controlled. | Listening starts only after opt-in and always has a stop control. |

## Acceptance Criteria

- **AC1:** Given wake listening is enabled in a supported browser, when recognition returns a phrase containing Hey JR, then the assistant popup opens and JR speaks Hello, Marvin. How can I help you? exactly once.
  - **Verify:** npm test -- --run src/voice.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-23)
  - **Verification target:** functional
- **AC2:** Given microphone listening is disabled or unsupported, when Marvin uses the manual Talk to JR control, then the same popup and spoken greeting are available without claiming background listening.
  - **Verify:** npm test -- --run src/voice.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-23)
  - **Verification target:** functional
- **AC3:** Given the app is listening, when Marvin selects Stop listening or closes the app view, then active recognition stops and the visible state no longer says listening.
  - **Verify:** npm test -- --run src/voice.test.ts src/App.test.tsx
  - **Verified:** yes (2026-09-23)
  - **Verification target:** functional

## Scope

### In Scope

- Explicit listening toggle and visible listening state
- In-app recognition of “Hey JR” in supported browsers
- Manual activation fallback
- Circular portrait popup and spoken greeting

### Out of Scope

- Background recognition while the browser is closed
- Operating-system default assistant integration
- Voice cloning or a custom speech model

## Technical Notes

Wrap browser speech APIs behind a hook and pure phrase matcher. Stop recognition before speaking so JR does not recognize its own greeting. Restart only when the greeting ends and listening remains enabled.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Recognition hears punctuation or different capitalization | Normalization still detects “Hey JR.” |
| Recognition fires again while the popup is open | JR does not speak a duplicate greeting. |
| Microphone permission is denied | Listening stops, a clear message appears, and manual activation remains usable. |
| Recognition is unavailable | Schedule features remain usable and the UI shows a support note. |
| JR's own speech could be re-recognized | Recognition aborts before text-to-speech starts. |

## Test Scenarios

- [x] Match normalized wake phrases and reject near misses.
- [x] Open the popup and invoke speech once after a supported recognition result.
- [x] Prevent duplicate speech while the popup is already open.
- [x] Stop recognition and remove the listening state when requested.
- [x] Open JR manually with the approved greeting when recognition is unavailable.

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| None | — | This story is independently deliverable. | — |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Web Speech API | Browser capability | Optional; manual fallback is implemented. |
| Browser text-to-speech | Browser capability | Supported broadly; popup still works without it. |

## Estimation

**Points:** 3
**Complexity:** Medium — browser support and recognition lifecycle require careful fallback behavior.

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

Provide an opt-in in-app wake experience that displays JR and speaks a greeting.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-23 | Codex | Authored wake and greeting acceptance criteria. |
