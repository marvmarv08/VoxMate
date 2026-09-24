# JR Voice Assistant

JR is a cross-platform personal voice-assistant project that remembers information Marvin chooses to provide. The current MVP focuses on one dependable memory type: one-time and recurring weekly schedules.

## What works now

- Add, view, and delete personal schedules.
- Save recurring weekly classes with start/end time, teacher, and room.
- Import schedules from JSON or CSV files.
- Keep schedule data locally in the current browser using IndexedDB.
- Automatically migrate valid schedules saved by the earlier `localStorage` version.
- Install JR from Safari as an iPhone Home Screen web app.
- Reopen the cached app shell when the device is temporarily offline.
- Open JR manually and hear: “Hello, Marvin. How can I help you?”
- Opt in to “Hey JR” wake listening while the app is open, when the browser supports speech recognition.
- Ask “What is my schedule on Wednesday?” and receive a spoken answer plus matching schedule cards.
- Type the same question manually when speech recognition is unavailable.
- Continue using every schedule feature when voice recognition is unavailable.

The supplied circular JR portrait is used for both the app identity and the assistant popup. The area outside its black circle is transparent.

## Run the project

You need [Node.js](https://nodejs.org/) 20.19 or newer.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal, normally `http://localhost:5173`.

## Install on iPhone

The deployed site must use HTTPS before microphone and installable-app features can be tested reliably.

1. Open the deployed JR link in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Turn on **Open as Web App**, then tap **Add**.

The Home Screen icon opens JR in standalone mode. Schedules saved on the iPhone remain on that iPhone; they do not automatically sync with the computer.

## Schedule import formats

JSON files contain an array of schedules:

```json
[
  {
    "title": "Thesis consultation",
    "date": "2026-09-28",
    "time": "13:30",
    "notes": "Bring the revised chapter"
  }
]
```

Weekly schedules use `recurrence` and `dayOfWeek` instead of a date:

```json
[
  {
    "title": "IT 313 – System Analysis and Design",
    "recurrence": "weekly",
    "dayOfWeek": "Wednesday",
    "time": "14:00",
    "endTime": "16:00",
    "teacher": "Mr. Bucad",
    "room": "CICS 301"
  }
]
```

CSV files use the same field names:

```csv
title,date,time,notes
Thesis consultation,2026-09-28,13:30,Bring the revised chapter
```

`notes`, `endTime`, `teacher`, and `room` are optional. An invalid import is rejected as a whole, so it does not erase or partially change existing memory.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

## Current limitation

This is an in-app web MVP, not yet an operating-system assistant. It cannot listen after the app is closed or from the iPhone Home Screen, and speech recognition support differs by browser and iOS version. The typed schedule question remains available when wake listening is unsupported. A future native iOS layer can reuse the shared memory and assistant logic while adding Siri/App Intent integration permitted by iOS.

## Privacy direction

Schedule data stays in IndexedDB in this browser, with a same-device `localStorage` fallback for resilience. Microphone listening is off by default and must be enabled explicitly. The project does not send schedules or microphone audio to a custom backend.
