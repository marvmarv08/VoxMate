# Product Requirements Document

**Project:** JR Voice Assistant  
**Version:** 0.1  
**Last Updated:** 2026-09-23  
**Status:** Draft

## 1. Project Overview

JR is a cross-platform personal voice assistant that can remember information explicitly provided by its user. The first milestone proves a smaller vertical slice: local schedule memory plus an in-app voice wake experience.

## 2. Problem Statement

Personal schedules are often scattered across notes and files. Marvin needs one approachable app where he can add or import schedule entries, see what JR remembers, and summon a voice interface without sending personal data to a remote service.

### Primary User

Marvin is the primary user for the MVP. He wants to manage his schedule without needing technical knowledge and expects visible, reversible controls for saved data and microphone use.

## 3. MVP Feature Inventory

| Feature | Description | Status | Priority |
| --- | --- | --- | --- |
| Schedule memory | Add, view, persist, and delete schedule entries locally | Not Started | Must Have |
| Schedule import | Import validated JSON or CSV schedule data | Not Started | Must Have |
| JR identity | Use the approved circular portrait throughout the app | Not Started | Must Have |
| In-app wake experience | Detect “Hey JR” while listening is enabled and the app is open | Not Started | Must Have |
| Spoken greeting | Show JR and speak “Hello, Marvin. How can I help you?” | Not Started | Must Have |
| Compatibility fallback | Explain when speech recognition is unavailable and retain manual activation | Not Started | Must Have |

## 4. Functional Requirements

1. The user can add a schedule item with title, date, time, and optional notes.
2. Schedule items persist after refreshing the app on the same device.
3. The user can delete a stored schedule item.
4. The app accepts JSON arrays and CSV files containing `title`, `date`, `time`, and optional `notes` columns.
5. Invalid imports are rejected with a clear message and do not overwrite existing data.
6. The user must explicitly enable microphone listening.
7. When supported recognition hears “Hey JR”, the JR popup appears and the device speaks the configured greeting.
8. The user can manually open or close the JR popup without voice recognition.

## 5. Non-Functional Requirements

- Schedule data stays in browser-local storage for the MVP.
- The app must remain usable without microphone permission.
- Listening state must always be visible and easy to stop.
- Desktop and mobile layouts must remain readable at 320 px width and above.
- The app must not claim system-wide or background wake-word support in the browser MVP.

## 6. Data Architecture

Each schedule item contains a unique identifier, title, ISO date, 24-hour time, optional notes, and creation timestamp. The MVP stores only these records and UI preferences locally.

## 7. Out of Scope

- Cloud accounts or synchronization
- Word, PDF, and image knowledge extraction
- General AI question answering
- System-wide background wake-word activation
- Native Android, iOS, Windows, macOS, or Linux packaging
- Predictive analytics and recommendations

## 8. Open Questions

- Which native platform should receive the first packaged version after the web MVP?
- Should future knowledge memory remain on-device or support encrypted cloud synchronization?

## Changelog

| Date | Version | Changes |
| --- | --- | --- |
| 2026-09-23 | 0.1 | Defined the first schedule-memory and spoken wake experience. |
