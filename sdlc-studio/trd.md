# Technical Requirements Document

**Project:** JR Voice Assistant  
**Version:** 0.1  
**Status:** Draft  
**Last Updated:** 2026-09-23

## Architecture

The MVP is a local-first React and TypeScript single-page application built with Vite. It uses a layered monolith: UI components call small schedule, storage, import, and voice modules through typed interfaces. This keeps the initial deployment simple while leaving clean boundaries for future native platform adapters.

## Components

| Component | Responsibility |
| --- | --- |
| App shell | Navigation, dashboard, forms, schedule list, and assistant popup |
| Schedule module | Validation, sorting, and import parsing |
| Schedule query module | Weekday intent parsing, matching, and grounded response construction |
| Storage module | Versioned browser-local persistence |
| Voice adapter | Browser speech recognition and text-to-speech |
| Static assets | Approved JR portrait and application metadata |

## Key Decisions

1. Use a modular monolith instead of microservices for the single-user MVP.
2. Keep schedule data local and dependency-free.
3. Treat browser speech recognition as an optional enhancement because support varies.
4. Require explicit user action before listening begins.
5. Keep platform-specific wake integrations outside the shared core.
6. Construct every schedule answer from pure query functions over stored records; do not use generative text for factual results.

## Security and Privacy

- No account, backend, analytics tracker, or remote database is included.
- Schedule data is not transmitted by application code.
- Microphone access is requested only when the user enables wake listening.
- Browsers may provide speech recognition through their own services; the UI must disclose this limitation.

## Browser Support

The schedule experience targets current evergreen browsers. Spoken output uses the widely available Speech Synthesis API. Wake-phrase recognition is enabled only where `SpeechRecognition` or `webkitSpeechRecognition` exists.
