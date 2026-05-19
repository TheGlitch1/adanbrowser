# Feature Tracker — AdanBrowser MVP

> **Reference file** — always read this before starting any new feature or Jira ticket.
> Update the `Status` column as work progresses.
> One row = one Jira ticket.
>
> Status values: `TODO` · `IN PROGRESS` · `DONE`

## Workflow

**For each ticket:**

1. Create feature branch: `git checkout develop && git checkout -b feature/E2-1-description`
2. Update status to `IN PROGRESS` in this file
3. Implement + test (manual + type-check + build)
4. Update status to `DONE` in this file
5. Commit: `git commit -m "feat: description (E2-1)"`
6. Merge to develop if verified: `git checkout develop && git merge --no-ff feature/E2-1-description`
7. Delete feature branch: `git branch -d feature/E2-1-description`

**Copilot will automate steps 2, 4, 5, 6, 7 after implementation and testing.**

---

## Epic 1 — Dev Environment & Build Pipeline

| #    | Feature / Ticket                                                                 | Status | Notes                                                                                        |
| ---- | -------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| E1-1 | Install npm dependencies (`npm install`) and verify clean install                | `DONE` | `@types/chrome`, `vite`, `typescript`, `eslint`, `prettier` — all declared in `package.json` |
| E1-2 | Verify `npm run build` produces a valid `dist/` folder                           | `DONE` | All four Vite entry points must bundle without error: popup, options, background, content    |
| E1-3 | Load unpacked extension in Chrome and confirm it appears without manifest errors | `DONE` | Open `chrome://extensions`, enable Dev mode, load `dist/`                                    |
| E1-4 | Verify `npm run type-check` passes with zero errors                              | `DONE` | Requires E1-1 first (needs `@types/chrome` in `node_modules`)                                |
| E1-5 | Add `adhan.mp3` audio asset to `extension/public/`                               | `DONE` | Required by `AdhanPlayer.ts` and declared in `manifest.json` → `web_accessible_resources`    |

---

## Epic 2 — Core Interruption Flow (YouTube MVP)

| #    | Feature / Ticket                                                                                             | Status | Notes                                                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E2-1 | Implement `YouTubePlayerController` — detect, pause, resume `#movie_player video`                            | `DONE` | File scaffolded at `content/youtube/YouTubePlayerController.ts`. Selector must target primary player only, not ads/previews                              |
| E2-2 | Implement `AdhanOverlay` — inject styled overlay with i18n message, guard against duplicate instances        | `DONE` | File scaffolded at `content/youtube/AdhanOverlay.ts`. Styles are inline stubs — needs real design pass                                                   |
| E2-3 | Implement `AdhanPlayer` — play `adhan.mp3` via `chrome.runtime.getURL`, fire `onEnded` callback              | `DONE` | File scaffolded at `content/youtube/AdhanPlayer.ts`. Requires E1-5 (audio asset)                                                                         |
| E2-4 | Wire content script interruption flow — `ADHAN_TRIGGER` → pause → overlay → play → resume → `ADHAN_COMPLETE` | `DONE` | Logic scaffolded in `content/index.ts`. Depends on E2-1, E2-2, E2-3                                                                                      |
| E2-5 | Implement `scheduleAdhan` use case — replace 10-second dev stub with real prayer time scheduling             | `DONE` | Real implementation in `application/prayer/scheduleAdhan.ts`. Reads from `chrome.storage.local`, falls back to `DEFAULT_PRAYER_TIMES`. Unblocked by E4-1 |
| E2-6 | Implement `triggerAdhan` use case — query YouTube tabs and dispatch `ADHAN_TRIGGER`                          | `DONE` | Scaffolded in `application/prayer/triggerAdhan.ts`. Logic is complete; needs integration test                                                            |
| E2-7 | Wire background service worker — `onAlarm` → `triggerAdhan`, `onInstalled`/`onStartup` → `scheduleAdhan`     | `DONE` | Scaffolded in `background/index.ts`. Depends on E2-5, E2-6                                                                                               |

---

## Epic 3 — Infrastructure Adapters

| #    | Feature / Ticket                                                                             | Status | Notes                                                                                                      |
| ---- | -------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| E3-1 | Validate `alarmAdapter` — create alarm, verify it fires, verify `onAlarm` listener is called | `TODO` | ⚠️ NEEDS TESTING — see `MANUAL_TEST_CHECKLIST.md` E3-1 (inspect via background service worker DevTools)    |
| E3-2 | Validate `messagingAdapter` — `sendToYouTubeTabs` queries correct tabs and delivers message  | `TODO` | ⚠️ NEEDS TESTING — see `MANUAL_TEST_CHECKLIST.md` E3-2 (manually dispatch from background DevTools)        |
| E3-3 | Validate `storageAdapter` — get/set roundtrip on `chrome.storage.local`                      | `TODO` | ⚠️ NEEDS TESTING — see `MANUAL_TEST_CHECKLIST.md` E3-3 (write/read/delete via background DevTools console) |

---

## Epic 4 — Prayer Time Scheduling

| #    | Feature / Ticket                                                                                   | Status | Notes                                                                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E4-1 | Define `PrayerTime` data source for MVP — hardcoded daily times or user-configurable input         | `DONE` | Decision: hardcoded `DEFAULT_PRAYER_TIMES` in `domain/prayer/PrayerTime.ts`. Stored under `prayerTimes` key in `chrome.storage.local` — overridable without UI |
| E4-2 | Implement real `scheduleAdhan` use case — compute next prayer from current time and register alarm | `DONE` | `findNextPrayer` + `nextPrayerDate` pure functions in domain. `scheduleNextAdhan` reads storage, computes next, creates alarm                                  |
| E4-3 | Persist prayer schedule to `chrome.storage.local` via `storageAdapter`                             | `DONE` | `scheduleNextAdhan` reads from storage on every call with `DEFAULT_PRAYER_TIMES` fallback — survives service worker restarts automatically                     |
| E4-4 | Re-schedule after each completed Adhan cycle — `ADHAN_COMPLETE` triggers next `scheduleAdhan`      | `DONE` | Wired in `background/index.ts` — `ADHAN_COMPLETE` handler calls `scheduleNextAdhan(alarmAdapter, storageAdapter)`                                              |

---

## Epic 5 — Localisation

| #    | Feature / Ticket                                                     | Status | Notes                                                                                                                    |
| ---- | -------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| E5-1 | Verify `en` locale renders correctly in overlay                      | `TODO` | ⚠️ NEEDS TESTING — see `MANUAL_TEST_CHECKLIST.md` E5-1. Requires E5-3 (now done)                                         |
| E5-2 | Verify `ar` locale renders correctly in overlay (RTL text direction) | `TODO` | ⚠️ NEEDS TESTING — see `MANUAL_TEST_CHECKLIST.md` E5-2. `dir="auto"` added to overlay message element                    |
| E5-3 | Add prayer name translations to locale files for both `en` and `ar`  | `DONE` | `prayer_fajr` … `prayer_isha` keys added to both locales. Overlay calls `getMessage('prayer_${name}')` with raw fallback |

---

## Epic 6 — Overlay UX & Polish

| #    | Feature / Ticket                                                                               | Status | Notes                                                                                                                                                                                                                                          |
| ---- | ---------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E6-1 | Design and implement overlay visuals — background, typography, icon                            | `DONE` | Dark card, gradient, 🕌 icon, fade-in animation, backdrop blur. Respectful + non-aggressive per MVP spec                                                                                                                                       |
| E6-2 | Ensure overlay does not break YouTube navigation (SPA route changes)                           | `DONE` | `yt-navigate-start` + `popstate` listeners in `content/index.ts`. Navigation calls `runCleanup()` — hides overlay + stops audio                                                                                                                |
| E6-3 | Ensure overlay does not appear if a second `ADHAN_TRIGGER` arrives while one is already active | `TODO` | ⚠️ NEEDS TESTING — guard exists (element ID check) but not manually verified. See `MANUAL_TEST_CHECKLIST.md` E6-3                                                                                                                              |
| E6-4 | **Add skip/dismiss button to overlay** — allow users to exit Adhan early and resume video      | `DONE` | **CRITICAL UX**: Add close button (×) + Escape key handler. When dismissed: stop audio, hide overlay, resume video. Send ADHAN_COMPLETE with `skipped: true` flag. ⚠️ Merged without manual test — see `MANUAL_TEST_CHECKLIST.md` E6-4 section |

---

## Epic 7 — Quality & Testing

| #    | Feature / Ticket                                                                                   | Status | Notes                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| E7-1 | Configure Vitest as the test runner — add to `package.json`, create `vitest.config.ts`             | `TODO` | `scripts/test` is a placeholder stub currently                                                   |
| E7-2 | Unit test `YouTubePlayerController` — mock `document.querySelector`, verify pause/resume/isPlaying | `TODO` | Depends on E7-1, E2-1                                                                            |
| E7-3 | Unit test `AdhanOverlay` — verify inject/remove/guard behaviour with JSDOM                         | `TODO` | Depends on E7-1, E2-2                                                                            |
| E7-4 | Unit test `scheduleAdhan` use case — mock `alarmAdapter`, verify correct alarm time                | `TODO` | Depends on E7-1, E4-2                                                                            |
| E7-5 | Unit test `triggerAdhan` use case — mock `messagingAdapter`, verify message is sent to tabs        | `TODO` | Depends on E7-1, E2-6                                                                            |
| E7-6 | End-to-end smoke test — load extension in Chrome, trigger alarm manually, verify full flow         | `TODO` | Manual test checklist: pause ✓ overlay appears ✓ audio plays ✓ overlay removed ✓ video resumes ✓ |

---

## Epic 8 — Popup & Options UI

| #    | Feature / Ticket                                                                     | Status | Notes                                                                             |
| ---- | ------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------- |
| E8-1 | Design popup UI — show next prayer name and time, manual "test Adhan" trigger button | `TODO` | `popup/popup.ts` is a placeholder. Outside core MVP flow but useful for testing   |
| E8-2 | Implement options page — allow user to configure prayer times manually               | `TODO` | `options/options.ts` is a placeholder. Depends on E4-1 decision about data source |

---

## Completed

| #   | Feature / Ticket                                                                                     | Notes              |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------ |
| ✅  | Project scaffold — folder structure, `package.json`, `tsconfig.json`, `vite.config.ts`               | Phase 0 foundation |
| ✅  | `manifest.json` — MV3, YouTube-only content script match, permissions, `web_accessible_resources`    |                    |
| ✅  | Architecture layers — `domain/`, `application/`, `infrastructure/`, `lib/`, `shared/` created        |                    |
| ✅  | `shared/messages.ts` — `ADHAN_TRIGGER` / `ADHAN_COMPLETE` discriminated union                        |                    |
| ✅  | `shared/types.ts` — `PrayerName` type                                                                |                    |
| ✅  | `domain/prayer/PrayerTime.ts` — value object scaffolded                                              |                    |
| ✅  | `domain/prayer/AdhanSession.ts` — value object scaffolded                                            |                    |
| ✅  | `application/prayer/scheduleAdhan.ts` — use case scaffolded (10s dev stub)                           |                    |
| ✅  | `application/prayer/triggerAdhan.ts` — use case scaffolded                                           |                    |
| ✅  | `infrastructure/alarms/alarmAdapter.ts` — adapter scaffolded                                         |                    |
| ✅  | `infrastructure/messaging/messagingAdapter.ts` — adapter scaffolded                                  |                    |
| ✅  | `infrastructure/storage/storageAdapter.ts` — adapter scaffolded                                      |                    |
| ✅  | `content/youtube/YouTubePlayerController.ts` — module scaffolded                                     |                    |
| ✅  | `content/youtube/AdhanOverlay.ts` — module scaffolded                                                |                    |
| ✅  | `content/youtube/AdhanPlayer.ts` — module scaffolded                                                 |                    |
| ✅  | `lib/i18n.ts` — `chrome.i18n` wrapper scaffolded                                                     |                    |
| ✅  | `_locales/en/messages.json` + `_locales/ar/messages.json` — locale files created                     |                    |
| ✅  | `background/index.ts` — service worker wired (alarm → triggerAdhan, install/startup → scheduleAdhan) |                    |
| ✅  | `content/index.ts` — interruption flow wired                                                         |                    |
| ✅  | `docs/MVP_YOUTUBE_ADHAN.md` — product requirements documented                                        |                    |
| ✅  | `docs/MV3_ARCHITECTURE.md` — architecture documented                                                 |                    |
| ✅  | `docs/PERMISSIONS_MATRIX.md` — permissions documented                                                |                    |
| ✅  | `docs/MESSAGE_FLOW.md` — message flow documented                                                     |                    |
| ✅  | `.github/copilot-instructions.md` — Copilot rules defined                                            |                    |
| ✅  | `.github/prompts/feature.prompt.md` — new feature prompt template                                    |                    |
| ✅  | `.github/agents/scaffold.agent.md` — scaffold agent defined                                          |                    |

---

## Recommended Jira Ticket Order

Work in this sequence to unblock each epic cleanly:

```
E1-1 → E1-2 → E1-3 → E1-4   (environment must work before anything else)
E1-5                           (audio asset, parallel with above)
E2-1 → E2-2 → E2-3 → E2-4   (core YouTube flow, in order)
E3-1 → E3-2 → E3-3           (validate adapters)
E4-1 → E4-2 → E4-3 → E4-4   (real prayer scheduling)
E2-5 → E2-6 → E2-7           (finalize background wiring after E4 is done)
E5-1 → E5-2 → E5-3           (localisation)
E6-1 → E6-2 → E6-3           (UX polish)
E7-1 → E7-2..E7-6            (testing)
E8-1 → E8-2                   (popup / options, last — not blocking MVP flow)
```

---

## Sprint Handoff

When all tickets above are `DONE` and all `⚠️ NEEDS TESTING` items in `docs/MANUAL_TEST_CHECKLIST.md` are verified:

➡️ **Continue in `docs/SPRINT2_FEATURES.md`**

Sprint 2 covers: real prayer times via `adhan-js`, Chrome Web Store publication, Firefox support, additional video platforms, and enhanced UX.

Full vision: `docs/POST_MVP_ROADMAP.md`
