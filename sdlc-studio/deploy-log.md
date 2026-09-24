# Deploy Log

Append-only record of deploy outcomes.

| When | Status | Detail |
| --- | --- | --- |
| 2026-09-24 08:44 | rolled-out | JR 0.2.0 deployed to https://voice-assistant-ten-xi.vercel.app; production build and live PWA browser smoke passed. |
| 2026-09-24 08:45 | verified | Live HTTPS smoke passed for manifest, service worker, offline app shell, IndexedDB persistence, schedule flow, and 390px mobile layout. |
| 2026-09-24 09:16 | rolled-back | Removed the voice-assistant and jr-voice-assistant projects from the incorrect mark-lester Vercel scope at Marvin's request; their URLs are retired. |
| 2026-09-24 09:16 | verified | JR 0.2.1 deployed under authenticated Vercel user marvmarv08 (scope cjmarv) at https://voice-assistant-black-eta.vercel.app; full live PWA smoke passed. |
