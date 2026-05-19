---
mode: agent
description: Resume AdanBrowser development — read full context and continue from where we left off
---

# Resume Development

You are taking full ownership of the AdanBrowser project.

## Step 1 — Read context in order (always, every session)

1. `.github/copilot-instructions.md` — coding rules, architecture constraints, conventions
2. `docs/MVP_YOUTUBE_ADHAN.md` — product requirements and MVP scope boundaries
3. `docs/FEATURES.md` — Sprint 1 feature tracker (MVP tickets)
4. `docs/SPRINT2_FEATURES.md` — Sprint 2 feature tracker (post-MVP improvements)
5. `docs/MV3_ARCHITECTURE.md` — architecture layers and dependency rules
6. `docs/MESSAGE_FLOW.md` — how background, content, and popup communicate
7. `docs/MANUAL_TEST_CHECKLIST.md` — pending ⚠️ NEEDS TESTING items

## Step 2 — Determine the active sprint

**Check `docs/FEATURES.md` first:**

- If any ticket is `TODO` or `IN PROGRESS` → you are in **Sprint 1**. Work from `docs/FEATURES.md`.
- If all Sprint 1 tickets are `DONE` (or `⚠️ NEEDS TESTING` with manual tests pending) → you are in **Sprint 2**. Work from `docs/SPRINT2_FEATURES.md`.

**Sprint 1 is complete when:**

- All epics E1–E8 are `DONE`
- All `⚠️ NEEDS TESTING` items in `MANUAL_TEST_CHECKLIST.md` have been manually verified and marked `DONE` in `FEATURES.md`

## Step 3 — Pick the next ticket and implement it

1. State the active sprint and the next `TODO` ticket ID + title clearly.
2. List every file that will be created or modified.
3. Confirm the change is within MVP scope (`docs/MVP_YOUTUBE_ADHAN.md`) for Sprint 1, or within `docs/POST_MVP_ROADMAP.md` scope for Sprint 2.
4. Create a feature branch: `git checkout develop && git checkout -b feature/<ticket-id>-<description>`
5. Update the ticket status to `IN PROGRESS` in the relevant tracker file.
6. Implement the feature following the architecture rules in `.github/copilot-instructions.md`.
7. Run `npm run type-check` and `npm run build` — both must pass.
8. Update the ticket status to `DONE` in the tracker.
9. Commit: `git commit -m "feat: description (<ticket-id>)"`
10. Merge to develop: `git checkout develop && git merge --no-ff feature/<ticket-id>-<description>`
11. Delete the feature branch: `git branch -d feature/<ticket-id>-<description>`
12. Move to the next ticket.

**You must automate steps 4–11 for each feature.**

## Hard constraints (always enforced)

- Chrome / Chromium first, Manifest V3
- YouTube only for Sprint 1 MVP
- `chrome.*` APIs only in `infrastructure/` layer
- No `any` types without a comment
- No features outside the active sprint's scope document
- One ticket at a time
- After Sprint 1 is done, `docs/POST_MVP_ROADMAP.md` defines the vision — `docs/SPRINT2_FEATURES.md` tracks the tickets

## Hard constraints reminder

- Chrome / Chromium first, Manifest V3
- YouTube only for MVP
- `chrome.*` APIs only in `infrastructure/` layer
- No `any` types without a comment
- No features outside `docs/MVP_YOUTUBE_ADHAN.md` scope
- One ticket at a time
