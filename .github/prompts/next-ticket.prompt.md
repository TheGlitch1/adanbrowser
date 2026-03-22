---
mode: agent
description: Pick the next TODO ticket from FEATURES.md and implement it
---

# Next Ticket

Read `docs/FEATURES.md` and identify the first ticket with status `TODO` in the recommended order.

Then:
1. State the ticket ID and title clearly.
2. List every file that will be created or modified.
3. Confirm the change is within `docs/MVP_YOUTUBE_ADHAN.md` scope.
4. Implement the feature following the architecture in `.github/copilot-instructions.md`.
5. After completing, remind me to update the ticket status in `docs/FEATURES.md` to `DONE`.

Constraints:
- One ticket at a time only.
- Do not implement anything beyond the ticket scope.
- Do not mark the ticket as DONE yourself — the human updates the tracker.
