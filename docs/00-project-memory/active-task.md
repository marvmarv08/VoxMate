---
pmm_schema: pmm.task/v1
task_id: pwa-ios-indexeddb
parent_task_id: none
task_kind: primary
execution_status: active
verification_status: pending
delivery_status: not-requested
owner: codex-root
branch: main
base_sha: cd91dd1922b364643b3d066972a3399c3827c58b
revision: 1
verification_head: none
verification_source_hash: none
verified_at: none
updated_at: 2026-09-24T00:27:35Z
---

# Active Task

Purpose: Single primary task contract, verifier, retry state, and integration checkpoint.
Read when: Starting, executing, verifying, integrating, or recovering this task.
Skip when: The task is unrelated to the current execution context.

## Status

- Title: Ship installable iOS PWA with IndexedDB
- Runtime Profile: Sprint
- Risk Level: normal
- Loop Budget: 3
- Current Attempt: 1
- Stop Condition: required behavior is verified or a concrete blocker is recorded.

## Task

- Objective: Ship installable iOS PWA with IndexedDB
- Scope: PWA manifest/service worker/install guidance, IndexedDB migration with localStorage compatibility, tests/docs, HTTPS deployment
- Allowed Files or Areas: PWA manifest/service worker/install guidance, IndexedDB migration with localStorage compatibility, tests/docs, HTTPS deployment
- Forbidden Actions: unrelated edits, destructive operations, publication, and production writes without explicit authorization.
- Source Artifacts: project instructions, current source, and task request.

## Harness

- Agent Mode: solo
- Owner: codex-root
- Branch: main
- Parent Task: none
- Tools: project-local tools and pmm lifecycle helpers.
- Environment Notes: one writer owns this task file and branch.

## Verifier

- Required Checks: typecheck; lint; unit tests; production build; SDLC validate and AC verify; mobile browser smoke; deployed HTTPS smoke
- Manual Acceptance: task-specific acceptance remains explicit.
- Evidence Needed: fresh command output bound to the current HEAD and source hash.

## Critic

- Pass/Fail: pending
- Missing Evidence: required checks have not completed.
- False-Pass Risk: stale or unrelated evidence must not count.
- Next Action: execute the first unverified acceptance step.

## Repair

- Last Failure: none
- Failure Class: none
- Attempted Fix: none
- Next Concrete Action: execute the first unverified acceptance step.

## Record

- Verification Evidence: pending
- Delivery Status: not-requested
- Delivery Evidence: pending
- Docs Updated: pending
- Remaining Risk: pending verification.
- Memory Promotion Decision: pending
- Last Updated: 2026-09-24T00:27:35Z
