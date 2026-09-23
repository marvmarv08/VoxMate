# Test Strategy Document

**Project:** JR Voice Assistant  
**Version:** 0.1  
**Last Updated:** 2026-09-23

## Objectives

- Prove schedule validation, import, ordering, and persistence independently of the UI.
- Prove wake-phrase matching and spoken greeting orchestration without requiring a live microphone in automated tests.
- Exercise the complete user flow in a real browser.

## Automated Checks

| Level | Scope | Tool |
| --- | --- | --- |
| Static | Type safety and lint rules | TypeScript and ESLint |
| Unit | Schedule parsing, storage, and wake phrase helpers | Vitest |
| Component | User-visible form, import, and assistant states | Testing Library |
| Build | Production bundle integrity | Vite |

## Manual Browser Checks

1. Add a schedule item and refresh to confirm persistence.
2. Import valid JSON and CSV schedules.
3. Reject malformed files without losing stored items.
4. Delete a schedule entry.
5. Enable and disable wake listening where supported.
6. Manually open JR and confirm the spoken greeting.
7. Check desktop and narrow mobile layouts.

## Known Test Boundary

Automated tests use a fake speech adapter. Real microphone permissions, recognition accuracy, and installed system voices require manual testing on each target browser and device.
