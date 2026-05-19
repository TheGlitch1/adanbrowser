# Feature Tracker — AdanBrowser Sprint 2 (Post-MVP)

> **Reference file** — read this after `docs/FEATURES.md` is fully complete.
> Tracks all improvements required to turn the MVP into a publicly distributable extension.
> Same workflow and status values as `docs/FEATURES.md`.
>
> Status values: `TODO` · `IN PROGRESS` · `DONE`
>
> **Prerequisite:** All Sprint 1 tickets in `docs/FEATURES.md` must be `DONE` before starting here.
> Sprint 1 remaining: E7 (unit tests) · E8 (popup/options) · manual test verifications.

## Workflow

Same as Sprint 1 — see `docs/FEATURES.md` → Workflow section.

**Copilot will automate branch creation, FEATURES.md updates, commits, and merges.**

---

## Sprint 2 — Epic 1: Quality & Reliability

Goal: production-quality code that can be safely maintained and published.

| #       | Feature / Ticket                                                                                         | Status | Notes                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| S2-E1-1 | Add extension icon set — 16, 32, 48, 128 px variants                                                     | `TODO` | Required for Chrome Web Store. Crescent moon / mosque motif. Add `icons` field to `manifest.json`      |
| S2-E1-2 | Add error boundaries to `AdhanPlayer` — graceful fallback when `adhan.mp3` fails to load                 | `TODO` | Currently logs + calls onEnded. Needs user-visible fallback (e.g. overlay stays until dismissed)       |
| S2-E1-3 | Guard `chrome.runtime.sendMessage` in content script against disconnected service worker                 | `TODO` | MV3 service worker can be killed mid-cycle. Wrap in try/catch, log only                                |
| S2-E1-4 | Handle tab closed mid-Adhan — `Promise.allSettled` already used but errors should be logged consistently | `TODO` | Review `messagingAdapter.sendToYouTubeTabs` — ensure per-tab errors are surfaced in background console |

---

## Sprint 2 — Epic 2: Real Prayer Times (Core Value Proposition)

Goal: replace hardcoded placeholder times with accurate, location-aware prayer times.

| #       | Feature / Ticket                                                                    | Status | Notes                                                                                                                                                                |
| ------- | ----------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S2-E2-1 | Integrate `adhan` npm library for client-side prayer time calculation               | `TODO` | `npm install adhan`. Replace `DEFAULT_PRAYER_TIMES` in `domain/prayer/PrayerTime.ts`. No network dependency, works offline. See `docs/POST_MVP_ROADMAP.md` Phase 3.1 |
| S2-E2-2 | Add `latitude`, `longitude`, `calculationMethod` to user settings schema            | `TODO` | Extend storage key from `prayerTimes: PrayerTime[]` to a settings object. Update `storageAdapter` types. Depends on S2-E2-1                                          |
| S2-E2-3 | Update `scheduleAdhan` use case to compute times via `adhan-js` from stored lat/lng | `TODO` | Replace `findNextPrayer(stored)` with `adhan.PrayerTimes(coordinates, date, params)`. Depends on S2-E2-1, S2-E2-2                                                    |
| S2-E2-4 | Update options page — add location input (lat/lng) and calculation method selector  | `TODO` | Geolocation button + manual input fallback. Calculation methods: MWL, ISNA, Egyptian, Makkah, Karachi. Depends on S2-E2-2, Sprint 1 E8-2                             |
| S2-E2-5 | Add "Detect my location" button to options page — calls `navigator.geolocation`     | `TODO` | Fills lat/lng fields automatically. No extra manifest permission needed (options page context). Depends on S2-E2-4                                                   |

---

## Sprint 2 — Epic 3: Enhanced User Experience

Goal: polish and practical improvements for daily use.

| #       | Feature / Ticket                                                                           | Status | Notes                                                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| S2-E3-1 | Show Chrome notification when prayer time arrives but no YouTube tab is open               | `TODO` | `chrome.notifications.create(...)`. Requires adding `"notifications"` to `manifest.json` permissions. Add to `PERMISSIONS_MATRIX.md`                |
| S2-E3-2 | Adhan volume control — add volume slider to options page                                   | `TODO` | Store `adhanVolume: number` (0–1) in `chrome.storage.local`. Apply via `audio.volume` in `AdhanPlayer.ts`                                           |
| S2-E3-3 | "Do not disturb" schedule — allow users to disable interruptions during specified hours    | `TODO` | Store `{ dnd: { enabled: boolean; from: string; to: string } }`. Check in `triggerAdhan` before dispatching. Options page toggle + time range input |
| S2-E3-4 | Fajr-specific Adhan — play a different audio file for Fajr (different Adhan in the Sunnah) | `TODO` | Bundle `adhan-fajr.mp3`. Detect `prayerName === 'fajr'` in `AdhanPlayer.ts` and pick correct file                                                   |
| S2-E3-5 | Update popup to show today's full prayer schedule with times (not just next prayer)        | `TODO` | Read from `chrome.storage.local` (computed times). Display 5 rows: name + time + ✓ if passed. Depends on S2-E2-3, Sprint 1 E8-1                     |

---

## Sprint 2 — Epic 4: Chrome Web Store Publication

Goal: everything needed to publish on the Chrome Web Store.

| #       | Feature / Ticket                                                            | Status | Notes                                                                                                                                                    |
| ------- | --------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S2-E4-1 | Write privacy policy page — hosted externally (GitHub Pages or similar)     | `TODO` | Chrome Web Store requires a privacy policy URL. Content: no personal data collected, no remote servers, all storage is local                             |
| S2-E4-2 | Prepare Chrome Web Store listing — description, screenshots, category       | `TODO` | English + Arabic descriptions. 3+ screenshots: overlay on YouTube, options page, popup. Category: Productivity. See `docs/POST_MVP_ROADMAP.md` Phase 5.3 |
| S2-E4-3 | Bump `manifest.json` version to `1.0.0` and run production build validation | `TODO` | `npm run build` → load `dist/` in Chrome → full smoke test → tag git release `v1.0.0`                                                                    |
| S2-E4-4 | Submit to Chrome Web Store                                                  | `TODO` | Upload zip of `dist/`. Review typically takes 1–3 business days. Depends on all S2-E4 tickets and Sprint 1 being fully verified                          |

---

## Sprint 2 — Epic 5: Firefox Support

Goal: extend the extension to Firefox without breaking Chrome behaviour.

| #       | Feature / Ticket                                                                  | Status | Notes                                                                                                                  |
| ------- | --------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| S2-E5-1 | Add `browser_specific_settings` to `manifest.json` for Firefox (AMO)              | `TODO` | Firefox requires `gecko.id` field. Create `manifest.firefox.json` override or use Vite env substitution                |
| S2-E5-2 | Install and configure `webextension-polyfill` for cross-browser API compatibility | `TODO` | `npm install webextension-polyfill`. Wrap all `chrome.*` calls or use the polyfill globally in infrastructure adapters |
| S2-E5-3 | Test full flow on Firefox Nightly — alarm, overlay, audio, dismiss                | `TODO` | Firefox MV3 has some `chrome.alarms` API differences. Add Firefox smoke test to `MANUAL_TEST_CHECKLIST.md`             |
| S2-E5-4 | Submit to addons.mozilla.org (AMO)                                                | `TODO` | Requires source code upload for review. Depends on S2-E5-1 to S2-E5-3                                                  |

---

## Sprint 2 — Epic 6: Additional Platform Support

Goal: extend the interruption flow beyond YouTube to other video platforms.

| #       | Feature / Ticket                                                                            | Status | Notes                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S2-E6-1 | Implement `TwitchPlayerController` — pause/resume Twitch livestream player                  | `TODO` | Twitch player selector: `.video-player video`. Add `*://*.twitch.tv/*` to content script matches. Isolate in `content/twitch/`                                 |
| S2-E6-2 | Implement generic `HTMLVideoController` — pause/resume any `<video>` element on any page    | `TODO` | Fallback for unlisted sites. Requires `<all_urls>` permission — discuss with team first (significant permission scope increase). Isolate in `content/generic/` |
| S2-E6-3 | Add platform detection to content script — route to correct controller based on current URL | `TODO` | Factory function: `createPlayerController(url): PlayerController`. Depends on at least one additional platform being implemented                               |

---

## Recommended Sprint 2 Ticket Order

Work in this sequence:

```
S2-E1-1                          (icon — needed for store, low effort, do first)
S2-E1-2 → S2-E1-3 → S2-E1-4     (error hardening)
S2-E2-1 → S2-E2-2 → S2-E2-3     (adhan-js integration — core value)
S2-E2-4 → S2-E2-5                (options page location + method)
S2-E3-2 → S2-E3-3 → S2-E3-1     (UX: volume, DND, notifications)
S2-E3-4                          (Fajr-specific audio)
S2-E3-5                          (popup full schedule)
S2-E4-1 → S2-E4-2 → S2-E4-3 → S2-E4-4   (store publication)
S2-E5-1 → S2-E5-2 → S2-E5-3 → S2-E5-4   (Firefox)
S2-E6-1 → S2-E6-3                (Twitch)
S2-E6-2 → S2-E6-3                (generic video, only after team discussion)
```
