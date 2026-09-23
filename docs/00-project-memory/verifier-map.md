# Verifier Map

Purpose: Project-specific map from task types to required checks and evidence.
Read when: Defining or reviewing the verifier for an active task.
Skip when: The active task already has a complete verifier.

## Default Checks

- Code: `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
- Frontend: Browser smoke test at desktop and mobile widths; exercise schedule add, import, persistence, delete, wake toggle, and popup close.
- Backend/API: Not applicable for the local-only MVP.
- Docs/skills: SDLC validation and `git diff --check`.
- Recovery: PMM doctor and exact active-task status.
- Release: Production build plus acceptance-criteria verification.
- Security/high risk: Confirm microphone activation is opt-in and schedule data does not leave the device.

## Required Evidence

- Command output summary: passing typecheck, lint, tests, build, and SDLC validation.
- Manual inspection: core schedule and voice flows exercised in a real browser.
- Screenshot or artifact: desktop and mobile screenshots when browser tooling is available.
- Remaining risk: browser speech-recognition compatibility and real-device microphone behaviour.

## False-Pass Guards

- Do not report skipped checks as passed.
- Do not delete or weaken failing checks without recording why.
- Do not treat mocks as real integration evidence.
- Do not mark high-risk tasks done without confirmation and rollback notes.
