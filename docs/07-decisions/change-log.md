# Change Log

Purpose: Chronological record of durable project behavior, requirement, implementation, and operation changes.
Read when: You need recent durable changes or must record a state-changing task.
Skip when: You only need the active task or current state.

## 2026-09-24

- Change: Released JR 0.2.0 as an installable HTTPS PWA at `https://voice-assistant-ten-xi.vercel.app`. Schedule memory now uses IndexedDB, migrates valid legacy localStorage data, retains a same-device fallback, and includes an offline app shell plus iPhone installation guidance.
- Evidence: Type checking, lint, 34 Vitest checks, production build, SDLC validation, local production PWA smoke, and live HTTPS smoke all passed. Browser checks covered IndexedDB persistence, migration-facing flows, schedule queries, manifest, service worker, offline reload, and a 390px mobile viewport.
- Remaining risk: Voice recognition still depends on Safari/iOS support and must be tested on Marvin's physical iPhone. The PWA cannot listen while closed or appear over the Home Screen like Siri.

- Change: Added recurring weekly schedule records and deterministic weekday questions through both voice and manual input. JR now displays matching class cards and speaks an answer built only from saved data. Updated Marvin's Desktop `class-schedule.json` to the weekly format.
- Evidence: `npm run typecheck`, `npm run lint`, 33 Vitest checks, production build, three newly verified acceptance criteria, SDLC validation, and Playwright desktop/mobile schedule-query smoke checks passed.
- Remaining risk: The live microphone and installed device voices still require testing on Marvin's phone. Home-screen or closed-app activation remains a separate native-platform milestone.

## 2026-09-23

- Change: Delivered the first JR MVP as a responsive React and TypeScript application with local schedule memory, JSON/CSV import, manual and in-app wake activation, spoken greeting, and Marvin's transparent circular portrait.
- Evidence: `npm run typecheck`, `npm run lint`, 20 Vitest checks, production build, six verified story acceptance criteria, SDLC validation, and Playwright desktop/mobile smoke checks passed.
- Remaining risk: Web speech recognition varies by browser and has not been proven with a physical microphone in this headless environment. Closed-app or system-wide wake activation still requires later native platform work.
