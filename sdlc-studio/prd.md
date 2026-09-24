# Product Requirements Document

**Project:** JR Voice Assistant  
**Version:** 0.2
**Last Updated:** 2026-09-23  
**Status:** Draft

## 1. Project Overview

JR is a cross-platform personal voice assistant that can remember information explicitly provided by its user. The current milestone adds recurring weekly schedule memory and grounded weekday answers to the in-app voice wake experience.

## 2. Problem Statement

Personal schedules are often scattered across notes and files. Marvin needs one approachable app where he can add or import schedule entries, see what JR remembers, and summon a voice interface without sending personal data to a remote service.

### Primary User

Marvin is the primary user for the MVP. He wants to manage his schedule without needing technical knowledge and expects visible, reversible controls for saved data and microphone use.

## 3. MVP Feature Inventory

| Feature | Description | Status | Priority |
| --- | --- | --- | --- |
| Schedule memory | Add, view, persist, and delete schedule entries locally | Done | Must Have |
| Schedule import | Import validated JSON or CSV schedule data | Done | Must Have |
| JR identity | Use the approved circular portrait throughout the app | Done | Must Have |
| In-app wake experience | Detect “Hey JR” while listening is enabled and the app is open | Done | Must Have |
| Spoken greeting | Show JR and speak “Hello, Marvin. How can I help you?” | Done | Must Have |
| Compatibility fallback | Explain when speech recognition is unavailable and retain manual activation | Done | Must Have |
| Weekly schedules | Store recurring weekday classes with structured details | Done | Must Have |
| Weekday schedule answers | Show and speak stored schedules for a requested weekday | Done | Must Have |

## 4. Functional Requirements

1. The user can add a schedule item with title, date, time, and optional notes.
2. Schedule items persist after refreshing the app on the same device.
3. The user can delete a stored schedule item.
4. The app accepts JSON arrays and CSV files containing `title`, `date`, `time`, and optional `notes` columns.
5. Invalid imports are rejected with a clear message and do not overwrite existing data.
6. The user must explicitly enable microphone listening.
7. When supported recognition hears “Hey JR”, the JR popup appears and the device speaks the configured greeting.
8. The user can manually open or close the JR popup without voice recognition.
9. The user can add or import a weekly schedule with a weekday and start time plus optional end time, teacher, room, and notes.
10. A transcript containing schedule intent and an English weekday returns only matching saved records in time order.
11. The spoken answer and visual result cards are derived from the same stored records.
12. A manual question input provides the same deterministic answer when voice recognition is unavailable.

## 5. Non-Functional Requirements

- Schedule data stays in browser-local storage for the MVP.
- The app must remain usable without microphone permission.
- Listening state must always be visible and easy to stop.
- Desktop and mobile layouts must remain readable at 320 px width and above.
- The app must not claim system-wide or background wake-word support in the browser MVP.

## 6. Data Architecture

Each schedule item contains a unique identifier, title, start time, recurrence type, optional date or weekday, optional end time, teacher, room, notes, and creation timestamp. New fields remain optional so existing version-1 browser records continue to load.

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
| 2026-09-23 | 0.2 | Added recurring weekly schedules and grounded weekday voice/text answers. |
