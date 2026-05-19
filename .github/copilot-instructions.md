# Copilot Instructions

## Project Overview

AdanBrowser is a **Chrome browser extension** using TypeScript, Vite, and Manifest V3.
It is a learning project shared between a junior and a senior developer.

## Architecture

```
extension/src/
├── background/      ← Service worker (event-driven, no DOM, no persistent state)
├── content/         ← Content script (injected into pages, has DOM access)
├── popup/           ← Toolbar popup UI
├── options/         ← Extension options/settings page
├── domain/          ← Pure business logic — NO browser APIs here
├── application/     ← Use cases, orchestrates domain + infrastructure
├── infrastructure/  ← chrome.* API wrappers (storage, messaging, fetch, tabs…)
├── lib/             ← Shared browser utility helpers
└── shared/          ← Cross-layer types, interfaces, constants, message contracts
```

## Coding Rules

- All new code must be **TypeScript with strict mode** enabled
- Use `@shared/`, `@lib/`, `@domain/`, etc. path aliases instead of relative `../../` imports
- No `any` types unless truly unavoidable — if used, add a comment explaining why
- Browser APIs (`chrome.*`) belong **exclusively in `infrastructure/`**
- Domain and application layers must have zero imports from `chrome`
- Prefer `chrome.storage.local` over in-memory state for persistence across events

## Core rules

- Prioritize Chrome/Chromium compatibility first.
- Keep the architecture modular, readable, and scalable.
- Do not invent product features that are not explicitly documented in docs/.
- Do not add unnecessary dependencies.
- Keep browser permissions minimal.
- Separate concerns clearly between background, content, popup, options, shared, and lib modules.
- Keep YouTube-specific logic isolated from generic extension logic.
- Prefer small, reviewable changes.
- Do not generate large amounts of code without first clarifying module responsibilities.
- Favor maintainability and explicit naming over clever abstractions.

## Collaboration rules

- This repository is used for learning and collaboration.
- Code should be easy to review and understand.
- When implementing a feature, first identify impacted modules and files.
- If requirements are ambiguous, prefer documenting assumptions instead of inventing hidden behavior.

## Git workflow rules

- **Branch structure**: `main` (production) ← `develop` (integration) ← `feature/*` (feature branches)
- **Feature development**:
  1. Create a feature branch from `develop`: `git checkout develop && git checkout -b feature/E2-1-youtube-controller`
  2. Update `docs/FEATURES.md` status from `TODO` to `IN PROGRESS` when starting
  3. Implement the feature following the architecture rules
  4. Test the feature thoroughly (manual + type-check + build)
  5. Update `docs/FEATURES.md` status from `IN PROGRESS` to `DONE` when complete
  6. Commit with conventional commit message: `feat: implement YouTubePlayerController (E2-1)`
  7. If everything works, merge to `develop`: `git checkout develop && git merge --no-ff feature/E2-1-youtube-controller`
  8. Delete the feature branch: `git branch -d feature/E2-1-youtube-controller`
- **Commit after each completed feature** — never accumulate multiple features in one commit
- **Feature branches** — one branch per ticket from docs/FEATURES.md
- **Commit messages** — use conventional commits format:
  - `feat: description (E2-1)` for new features
  - `fix: description (E2-1)` for bug fixes
  - `docs: description` for documentation only
  - `chore: description` for build/tooling changes
  - `refactor: description` for code restructuring
- **Copilot automation**:
  - Copilot MUST update `docs/FEATURES.md` status when starting/finishing features
  - Copilot MUST commit after completing and testing each feature
  - Copilot MUST create feature branches for each ticket
  - Copilot MUST merge to develop only when feature is verified working

## Testing rules

- **Testing strategy**: See `docs/TESTING_STRATEGY.md` for comprehensive approach
- **Manual testing**: Follow `docs/MANUAL_TEST_CHECKLIST.md` before releases
- **Dev-only test helpers**: Wrap in `if (import.meta.env.DEV)` — never ship to production
- **Unit tests**: Use Vitest (to be set up in E7-1) for isolated module testing
- **Test each feature**: After implementation, verify with type-check + build + manual test
- **No test pollution**: Test code must not pollute production builds

## Browser extension rules

- Respect Manifest V3 constraints.
- Use content scripts or scripting only when appropriate.
- Do not use remote hosted code for extension logic.
- Prepare the structure so Firefox support can be added later, but do not optimize prematurely for it.

## Extension-Specific Rules

- The service worker (`background/`) is **stateless between events** — never rely on module-level variables persisting
- Content scripts must be lightweight and non-blocking
- Always declare required permissions in `manifest.json` and document them in `docs/PERMISSIONS_MATRIX.md`
- Message types must be defined in `src/shared/messages.ts` with a `type` discriminant

## Output style

- Prefer step-by-step implementation.
- Explain proposed file changes before large edits.
- Keep commits and generated changes focused.

## Development Workflow

| Command              | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Watch mode build → reload extension manually in Chrome |
| `npm run build`      | Production build to `dist/`                            |
| `npm run type-check` | TypeScript check without emitting                      |

## Adding New Features

Follow the clean architecture layers. Use the prompt template at `.github/prompts/feature.prompt.md`.

## Feature Trackers

There are two sprint trackers. Always determine which sprint is active before starting work.

| File                       | Sprint              | Purpose                                                             |
| -------------------------- | ------------------- | ------------------------------------------------------------------- |
| `docs/FEATURES.md`         | Sprint 1 — MVP      | Core YouTube interruption flow, scheduling, overlay, i18n, UX       |
| `docs/SPRINT2_FEATURES.md` | Sprint 2 — Post-MVP | Real prayer times, store publication, Firefox, additional platforms |

**Active sprint rules:**

- If `docs/FEATURES.md` has any `TODO` ticket → work Sprint 1 only.
- If all Sprint 1 tickets are `DONE` → switch to `docs/SPRINT2_FEATURES.md`.
- Always read features before starting a new feature or ticket.
- Use `.github/prompts/next-ticket.prompt.md` to pick and implement the next item.
- Use `.github/prompts/resume.prompt.md` to restore full context at the start of each session.
- Statuses: `TODO` · `IN PROGRESS` · `DONE`.
  **Scope boundaries:**
- Sprint 1 scope: `docs/MVP_YOUTUBE_ADHAN.md`
- Sprint 2 scope: `docs/POST_MVP_ROADMAP.md`
- Do not implement Sprint 2 features while Sprint 1 tickets remain open.
