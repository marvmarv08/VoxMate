# Current State

Purpose: Current project phase, stable facts, blockers, and next recommended actions.
Read when: Starting or resuming project work.
Skip when: Only reading historical decisions or one-off command output.

## Phase

Recurring schedule-answer vertical slice complete and locally verified.

## Current Top Objective

Prepare installable mobile delivery and platform-specific home-screen integration.

## Stable Facts

- Product name: JR Voice Assistant.
- Overall product direction is cross-platform.
- The first client is a React and TypeScript web app that can later be packaged for native platforms.
- Marvin's circular portrait is the approved assistant identity.
- Data remains on the current device in the MVP.

## What Exists

- Private GitHub repository and local clone.
- React and TypeScript application with local-first modules for schedule parsing, weekday queries, storage, and voice behavior.
- Transparent circular JR logo asset generated from Marvin's supplied portrait.
- Product, technical, test, persona, epic, and story documentation for the first MVP.

## What Works

- Schedules can be added, imported from JSON/CSV, viewed chronologically, persisted, and deleted.
- Invalid imports fail atomically without changing existing schedule memory.
- JR opens manually and speaks “Hello, Marvin. How can I help you?” through browser text-to-speech.
- Supported browsers can opt in to in-app “Hey JR” recognition with visible listening and stop controls.
- Unsupported recognition falls back cleanly to manual activation.
- Weekly schedules can store weekday, start/end time, teacher, room, and notes alongside existing dated schedules.
- JR answers questions such as “What is my schedule on Wednesday?” using only saved records, shows matching cards, and speaks the detailed answer.
- Manual text questions provide the same result when speech recognition is unavailable.
- Type checking, lint, 33 automated tests, production build, nine verified story acceptance criteria, SDLC validation, and desktop/mobile Chromium smoke checks pass.

## Known Issues

- Browser speech recognition is not supported consistently across all browsers.
- System-wide background wake words require platform-specific native integrations and are not part of the web MVP.

## Current Blockers

None.

## Next Recommended Actions

Deploy an installable PWA for real-device microphone testing, then design native platform adapters: Android background/home-screen surfaces and iOS Siri/App Intent integration. The browser version must continue to state that wake listening works only while the app is open.

## Last Updated

2026-09-24
