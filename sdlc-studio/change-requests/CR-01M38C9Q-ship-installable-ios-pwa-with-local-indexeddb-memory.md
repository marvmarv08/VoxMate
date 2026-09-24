# CR-01M38C9Q: Ship installable iOS PWA with local IndexedDB memory

> **Status:** inbox
> **Created:** 2026-09-24
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Affects:** src/storage.ts, src/App.tsx, src/main.tsx, public/manifest.webmanifest, public/sw.js, vite.config.ts, README.md
> **Priority:** P2
> **Type:** feature-request
> **Size:** M

## Summary

Deliver JR as an HTTPS-hosted Progressive Web App (PWA) that Marvin can add to an iPhone Home Screen. Replace synchronous browser storage with IndexedDB while preserving and automatically migrating schedules saved by the earlier localStorage version.

## Impact

Marvin can install and test JR on iPhone over HTTPS while schedules remain on-device; existing saved schedules must migrate without loss.

## Acceptance Criteria

- [ ] The JR web app is installable from Safari using Add to Home Screen and opens in standalone display mode.
- [ ] Schedules persist in IndexedDB and existing localStorage schedule data migrates without loss.
- [ ] The deployed HTTPS app supports explicit microphone permission and clearly states that wake listening works only while JR is open.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-09-24 | sdlc-studio | Created via `new` (deterministic) |
