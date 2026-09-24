# Current State

Purpose: Current project phase, stable facts, blockers, and next recommended actions.
Read when: Starting or resuming project work.
Skip when: Only reading historical decisions or one-off command output.

## Phase

Installable JR 0.2.0 PWA deployed and verified over HTTPS.

## Current Top Objective

Validate the deployed app on Marvin's physical iPhone, then design platform-specific voice integrations.

## Stable Facts

- Product name: JR Voice Assistant.
- Overall product direction is cross-platform.
- The first client is a React and TypeScript web app that can later be packaged for native platforms.
- Marvin's circular portrait is the approved assistant identity.
- Data remains on the current device in the MVP.
- Production URL: `https://voice-assistant-black-eta.vercel.app`, owned by the authenticated Vercel user `marvmarv08` under scope `cjmarv`.

## What Exists

- Private GitHub repository and local clone.
- React and TypeScript application with local-first modules for schedule parsing, weekday queries, storage, and voice behavior.
- Transparent circular JR logo asset generated from Marvin's supplied portrait.
- Product, technical, test, persona, epic, and story documentation for the first MVP.
- PWA manifest, service worker, iPhone installation guidance, and Vercel HTTPS deployment.

## What Works

- Schedules can be added, imported from JSON/CSV, viewed chronologically, persisted, and deleted.
- Invalid imports fail atomically without changing existing schedule memory.
- JR opens manually and speaks “Hello, Marvin. How can I help you?” through browser text-to-speech.
- JR prefers an available male English system voice and uses a slightly deeper pitch as a fallback.
- Active conversations use a focused centered pop-up containing only JR's portrait, speaking status, spoken response text, and close control; manual text questions remain on the main screen.
- Supported browsers can opt in to in-app “Hey JR” recognition with visible listening and stop controls.
- Unsupported recognition falls back cleanly to manual activation.
- Weekly schedules can store weekday, start/end time, teacher, room, and notes alongside existing dated schedules.
- JR answers questions such as “What is my schedule on Wednesday?” using only saved records, shows matching cards, and speaks the detailed answer.
- Manual text questions provide the same result when speech recognition is unavailable.
- Schedule memory uses IndexedDB with automatic migration and a same-device localStorage fallback.
- The installed app opens in standalone mode and its cached shell can reopen offline.
- Type checking, lint, 36 automated tests, production build, SDLC validation, and local plus deployed PWA browser smoke checks pass.

## Known Issues

- Browser speech recognition is not supported consistently across all browsers.
- System-wide background wake words require platform-specific native integrations and are not part of the web MVP.
- Physical-iPhone microphone and speech-recognition behavior remains unverified; typed questions are the supported fallback.

## Current Blockers

None.

## Next Recommended Actions

Open the production URL in Safari, add JR to the iPhone Home Screen, import Marvin's schedule, and test speech output plus optional wake listening. After physical-device results are recorded, design iOS Siri/App Intent integration and the Android background/home-screen adapter.

## Last Updated

2026-09-24
