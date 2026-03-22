---
mode: agent
description: Resume AdanBrowser development — read full context and continue from where we left off
---

# Resume Development

You are taking full ownership of the AdanBrowser project.
Before doing anything, read these files in order:

1. `.github/copilot-instructions.md` — coding rules, architecture constraints, conventions
2. `docs/MVP_YOUTUBE_ADHAN.md` — product requirements and MVP scope boundaries
3. `docs/FEATURES.md` — feature tracker, current statuses, recommended ticket order
4. `docs/MV3_ARCHITECTURE.md` — architecture layers and dependency rules
5. `docs/MESSAGE_FLOW.md` — how background, content, and popup communicate

## Current project state (as of last session — March 22, 2026)

### What is done
- Full project scaffold: all folders, all config files (`package.json`, `tsconfig.json`, `vite.config.ts`)
- `manifest.json` — MV3, scoped to `*://*.youtube.com/watch*`, permissions: `alarms` + `storage`, `web_accessible_resources` for `adhan.mp3`
- All architecture layers created — domain, application, infrastructure, lib, shared
- All MVP modules **scaffolded with placeholders and TODO comments** — not yet implemented:
  - `content/youtube/YouTubePlayerController.ts`
  - `content/youtube/AdhanOverlay.ts`
  - `content/youtube/AdhanPlayer.ts`
  - `application/prayer/scheduleAdhan.ts` (10s stub)
  - `application/prayer/triggerAdhan.ts`
  - `background/index.ts` (wired but untested)
  - `content/index.ts` (wired but untested)
- Infrastructure adapters scaffolded: `alarmAdapter`, `messagingAdapter`, `storageAdapter`
- Shared types and message contracts: `shared/messages.ts`, `shared/types.ts`
- Locales: `_locales/en/messages.json`, `_locales/ar/messages.json`
- Repository pushed to: https://github.com/TheGlitch1/adanbrowser.git

### What is NOT done (next steps in order)
1. **E1-1** `npm install` — dependencies have never been installed (switching to local machine)
2. **E1-2** `npm run build` — first build, fix any compile errors
3. **E1-3** Load `dist/` as unpacked extension in Chrome — confirm no manifest errors
4. **E1-4** `npm run type-check` — must pass zero errors once `@types/chrome` is installed
5. **E1-5** Add `adhan.mp3` to `extension/public/` — without this audio cannot play
6. Then proceed to **E2-1** through **E2-7** — the core interruption flow implementation

## Your task

1. Confirm the current state by listing the next `TODO` ticket from `docs/FEATURES.md`
2. Implement it following the architecture rules in `copilot-instructions.md`
3. After each ticket is complete, tell the developer to update `docs/FEATURES.md` status to `DONE`
4. Then move to the next ticket

## Hard constraints reminder
- Chrome / Chromium first, Manifest V3
- YouTube only for MVP
- `chrome.*` APIs only in `infrastructure/` layer
- No `any` types without a comment
- No features outside `docs/MVP_YOUTUBE_ADHAN.md` scope
- One ticket at a time
