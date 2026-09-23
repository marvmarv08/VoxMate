# JR Voice Assistant

JR is a cross-platform personal voice-assistant project that will remember information Marvin chooses to provide. This first MVP focuses on one dependable memory type: schedules.

## What works now

- Add, view, and delete personal schedules.
- Import schedules from JSON or CSV files.
- Keep schedule data locally in the current browser using `localStorage`.
- Open JR manually and hear: “Hello, Marvin. How can I help you?”
- Opt in to “Hey JR” wake listening while the app is open, when the browser supports speech recognition.
- Continue using every schedule feature when voice recognition is unavailable.

The supplied circular JR portrait is used for both the app identity and the assistant popup. The area outside its black circle is transparent.

## Run the project

You need [Node.js](https://nodejs.org/) 20.19 or newer.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal, normally `http://localhost:5173`.

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

CSV files use the same field names:

```csv
title,date,time,notes
Thesis consultation,2026-09-28,13:30,Bring the revised chapter
```

`notes` is optional. An invalid import is rejected as a whole, so it does not erase or partially change existing memory.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

## Current limitation

This is an in-app web MVP, not yet an operating-system assistant. It cannot listen after the app or browser is closed, and speech recognition support differs by browser. A future desktop/mobile layer can reuse the shared memory and assistant logic while adding native background wake-word capabilities where each operating system permits them.

## Privacy direction

Schedule data stays in this browser in the MVP. Microphone listening is off by default and must be enabled explicitly. The project does not yet send schedules or microphone audio to a custom backend.
