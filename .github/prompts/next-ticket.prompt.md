---
mode: agent
description: Pick the next TODO ticket and implement it — sprint-aware
---

# Next Ticket

## Determine the active sprint

1. Read `docs/FEATURES.md` — if any ticket is `TODO` or `IN PROGRESS`, you are in **Sprint 1**.
2. If all Sprint 1 tickets are `DONE`, read `docs/SPRINT2_FEATURES.md` — you are in **Sprint 2**.
3. State clearly: **"Active sprint: Sprint 1 / Sprint 2"** before proceeding.

## Scope reference

- **Sprint 1** — scope defined in `docs/MVP_YOUTUBE_ADHAN.md`
- **Sprint 2** — scope defined in `docs/POST_MVP_ROADMAP.md`

## Implementation steps

1. State the ticket ID and title clearly (e.g. `E7-1`, `S2-E2-1`).
2. List every file that will be created or modified.
3. Confirm the change is within the active sprint's scope document.
4. Implement the feature following the architecture in `.github/copilot-instructions.md`.
5. Run `npm run type-check` and `npm run build` — both must pass before committing.
6. Update the ticket status to `DONE` in the active tracker file.
7. Commit, merge to develop, delete the feature branch — following the workflow in the active tracker.

## Constraints

- One ticket at a time only.
- Do not implement anything beyond the ticket scope.
- For Sprint 2 tickets that require new `chrome` permissions, update `docs/PERMISSIONS_MATRIX.md` and note in `manifest.json`.
- For Sprint 2 tickets that add npm dependencies (e.g. `adhan`), confirm the dependency is necessary and minimal before installing.
