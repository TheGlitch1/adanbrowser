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

| Command | Purpose |
|---|---|
| `npm run dev` | Watch mode build → reload extension manually in Chrome |
| `npm run build` | Production build to `dist/` |
| `npm run type-check` | TypeScript check without emitting |

## Adding New Features

Follow the clean architecture layers. Use the prompt template at `.github/prompts/feature.prompt.md`.

## Feature Tracker

`docs/FEATURES.md` is the **single source of truth** for all planned and completed work.
- Always read it before starting a new feature or ticket.
- Use `.github/prompts/next-ticket.prompt.md` to pick and implement the next item.
- Statuses: `TODO` · `IN PROGRESS` · `DONE`.
