# Change Log

Purpose: Chronological record of durable project behavior, requirement, implementation, and operation changes.
Read when: You need recent durable changes or must record a state-changing task.
Skip when: You only need the active task or current state.

## 2026-09-23

- Change: Delivered the first JR MVP as a responsive React and TypeScript application with local schedule memory, JSON/CSV import, manual and in-app wake activation, spoken greeting, and Marvin's transparent circular portrait.
- Evidence: `npm run typecheck`, `npm run lint`, 20 Vitest checks, production build, six verified story acceptance criteria, SDLC validation, and Playwright desktop/mobile smoke checks passed.
- Remaining risk: Web speech recognition varies by browser and has not been proven with a physical microphone in this headless environment. Closed-app or system-wide wake activation still requires later native platform work.
