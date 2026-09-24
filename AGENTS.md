# Project Instructions

Purpose: Canonical project entrypoint and hot-path instructions for future agents.
Read when: Entering the project, starting a task, resuming work, or checking safety boundaries.
Skip when: Never skip during project work.

<!-- pmm-runtime:start -->
## PMM Runtime

- Managed runtime version: `0.5.1`.
- Before non-trivial task writes, run the installed `pmm-task.sh upgrade --project . --auto --owner <agent-id>` Upgrade Gate.
- Treat `docs/00-project-memory/runtime-state.md` as project runtime state; compatibility readers are for migration, recovery, rollback, and ambiguity review only.
- Keep exactly one primary task in `active-task.md`; concurrent writers use isolated branches/worktrees and work-item files.
<!-- pmm-runtime:end -->

## Project Identity

- Name: JR Voice Assistant
- One-sentence positioning: A cross-platform personal voice assistant that remembers user-provided information and responds through natural voice interaction.
- Project type: Local-first React and TypeScript web application, designed for later desktop and mobile packaging.
- Current phase: Deployed installable iOS PWA with verified IndexedDB schedule memory.
- Current top objective: Validate voice behavior on Marvin's physical iPhone, then plan platform-specific integrations without weakening local-first privacy.

## Runtime Profile

Default profile: Sprint

Use:
- Pulse for tiny edits or known-file lookups
- Sprint for normal implementation
- Project for new project or major requirements work
- Recovery for interrupted or failed-retryable work
- Audit for release, security, production, auth, payment, or compatibility risk

## Mandatory Reading Order

1. `AGENTS.md`
2. `docs/00-project-memory/active-task.md` for non-trivial task start/resume
3. Relevant sections of `current-state.md` only when project facts are needed
4. Relevant sections of `verifier-map.md` only when the task lacks complete checks
5. Task-specific source docs only when needed

Reuse content already present in the current context; do not reopen an unchanged file unless a required section was not loaded.

## Task Reading Map

- Product/features: `sdlc-studio/prd.md`
- UI/design: `src/App.tsx` and `src/styles.css`
- Frontend: `src/App.tsx`, `src/main.tsx`, `src/types.ts`
- Storage and parsing: `src/schedule.ts` and `src/storage.ts`
- Voice interaction: `src/useVoiceAssistant.ts`
- Auth/payment/permissions: no authentication or payment in the MVP; microphone access must remain explicit and user-controlled
- PRD/requirements/source review: `sdlc-studio/prd.md` plus the relevant story
- Deployment/operations: `README.md` and `package.json`
- Testing/bug fixing: relevant `src/*.test.ts` files first, then the implementing module
- Recovery: `docs/00-project-memory/active-task.md` and `docs/07-decisions/change-log.md`
- Audit/release: `sdlc-studio/tsd.md` and the current story acceptance criteria

## Execution Rules

- Keep project state in project docs, not in agent-global memory.
- Respond to Marvin in natural Taglish by default and explain unfamiliar development terms in practical language.
- Keep the shared assistant core platform-neutral; isolate browser, desktop, Android, and iOS capabilities behind platform-specific adapters when introduced.
- Use local-first storage for the MVP and label unsupported or future capabilities honestly.
- Treat microphone listening as opt-in. Always provide a visible listening state and an immediate stop control.
- Keep an ephemeral in-session read set; do not write it into project memory.
- Inspect size and headings before reading text files over 200 lines or 32 KiB, then load only relevant ranges.
- Do not create standalone plan, handoff, or evidence files that duplicate the owned task and target source.
- Batch durable task/doc updates at real state transitions; do not persist commentary or raw command transcripts.
- Run the Workspace Gate before the Subagent Gate: inspect the primary task, branch/worktree, owner, allowed scope, and existing work items.
- Reuse a matching current-branch PMM claim; continue or resume it instead of creating or switching worktrees. A default `start` from another active, checked-out worktree may auto-route to a child work item.
- Keep exactly one primary task in `active-task.md`; never append a second task contract.
- Use `docs/00-project-memory/work-items/<task-id>.md` only for branch/worktree-isolated child work.
- Put queued, paused, confirmation-gated, deployment, and release work in an optional task queue instead of the active hot path.
- Update the owned task file before broad, risky, or long-running work.
- Define Task, Harness, Verifier, Critic, Repair, and Stop Condition for substantial tasks.
- Choose Agent Mode before broad work: `solo`, `assisted`, `parallel`, or `review-only`.
- Use specialized skills or subagents only when they add value, ownership is clear, and the parent agent keeps final verification.
- Never allow two active writers to share one branch/worktree; overlapping scopes execute sequentially.
- Keep one non-idle primary claim across local worktrees, including paused/blocked tasks; require each non-idle task file to match its complete owner/branch/parent/kind claim, and never reuse an archived task ID.
- Use the lifecycle CLI for whole-file task transactions; interrupted writes must leave neither partial task state nor orphan temporary files/claims, and an interrupted takeover must restore the owner matching the durable task file.
- Treat any source-touching commit after verification as stale evidence even when a later commit reverts it.
- Keep a verified child claim at `ready-to-integrate` until its commit is merged and the primary owner runs `pmm-task.sh integrate`; then reverify the primary task.
- Do not copy full project rules into agent-specific adapters.

## Safety Boundaries

Existing explicit authorization remains valid within its scope. Do not request it again for authorized local implementation; ask for missing authorization or material scope changes. Respect platform-enforced approvals.

- Do not store secrets in files, docs, logs, or chat.
- Do not delete, migrate, overwrite, publish, charge, message, or change production data without confirmation.
- Do not modify payment, user, order, permission, billing, credential, or external publication behavior without confirmation.
- Do not use mock data as proof of real integration.
- Do not transmit uploaded schedules or microphone audio to a remote service unless the product requirement, consent flow, retention policy, and security design have been explicitly approved.
- Preserve Marvin's supplied portrait without beautification, identity changes, or unrequested editing.

## Definition Of Done

- Requested behavior implemented or blocker recorded.
- Verifier run after the final change and evidence still matches the current HEAD/source hash, or limitation recorded.
- Critic checked false-pass risk.
- `active-task.md`, `current-state.md`, `change-log.md`, and source docs updated only when durable state changed.
- Remaining risk is explicit.
- Every child work item is merged, explicitly integrated, and followed by fresh primary-task verification.
