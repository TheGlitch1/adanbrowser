# AdanBrowser — Post-MVP Roadmap

> **Purpose:** This document maps the path from a working MVP to a polished, publicly distributable extension.
> It is the single source of truth for what to build **after** all `docs/FEATURES.md` tickets are closed.
>
> Organised into phases. Each phase must be fully shipped before moving to the next.

---

## Current State (May 2026)

The MVP core interruption flow is **code-complete**:

- ✅ YouTube video pauses on prayer time
- ✅ Overlay appears with translated prayer name
- ✅ Adhan audio plays (real 3:14 Makkah recording)
- ✅ Video resumes after Adhan ends
- ✅ User can dismiss early (close button + Escape key)
- ✅ SPA navigation cleanup (no orphaned overlay)
- ✅ Prayer schedule persists across service worker restarts
- ✅ Re-schedules automatically after each cycle

**What blocks public release:**

1. No UI for users to set their prayer times (currently requires DevTools)
2. No unit test coverage
3. Several features merged without manual verification
4. Default prayer times are hardcoded placeholders — not accurate for any real location

---

## Phase 1 — Release Candidate (Pre-Publication)

> Goal: make the extension usable by a real person without developer tools.

### 1.1 — Complete pending manual tests

Work through all `⚠️ NEEDS TESTING` items in `docs/MANUAL_TEST_CHECKLIST.md`:

- [ ] E3-1: Alarm fires and re-schedules correctly
- [ ] E3-2: Messaging reaches YouTube tabs
- [ ] E3-3: Storage persists after service worker restart
- [ ] E5-1: English overlay shows "Fajr", "Dhuhr"... (not raw keys)
- [ ] E5-2: Arabic overlay shows "الفجر", "الظهر"... with RTL layout
- [ ] E6-3: Second ADHAN_TRIGGER while one is active is silently ignored
- [ ] E6-4: Close button and Escape key dismiss correctly

### 1.2 — Options page (E8-2) — CRITICAL for real users

The extension is unusable without a way to configure prayer times.

**Minimum viable options page:**

- A form with 5 time inputs (one per prayer)
- Pre-filled with `DEFAULT_PRAYER_TIMES` from storage
- Save button writes to `chrome.storage.local` under `prayerTimes` key
- "Reset to defaults" button clears the key

**Files to create/modify:**

- `options/options.ts` — load from storage, render form, save on submit
- `options/index.html` — simple form layout
- No framework needed — plain DOM + the existing `storageAdapter`

### 1.3 — Popup (E8-1) — useful for testing and daily use

**Minimum viable popup:**

- Show next prayer name + scheduled time (read from `chrome.alarms.getAll`)
- "Test Adhan now" button — sends `ADHAN_TRIGGER` to active YouTube tab
- Link to options page

### 1.4 — End-to-end smoke test (E7-6)

Load the built extension in Chrome, go through the complete flow manually:
pause → overlay → audio → resume → re-schedule.

---

## Phase 2 — Quality & Reliability

> Goal: production-quality code that can be safely maintained by any contributor.

### 2.1 — Vitest unit tests (E7-1 to E7-5)

Set up Vitest and write unit tests for the pure, testable parts:

| Test | What to verify |
|------|---------------|
| `findNextPrayer()` | Correct next prayer, wrap to tomorrow, empty array |
| `nextPrayerDate()` | Today if ahead, tomorrow if passed, exact timestamps |
| `YouTubePlayerController` | pause/resume/isPlaying with mocked DOM |
| `AdhanOverlay` | show/hide/guard with JSDOM |
| `triggerAdhan` | sends ADHAN_TRIGGER with correct prayerName |
| `scheduleNextAdhan` | creates alarm with correct timestamp via mocked adapters |

### 2.2 — Error boundaries

- Graceful handling when `adhan.mp3` fails to load (network error)
- Graceful handling when `chrome.storage.local` is unavailable
- Log and recover when a YouTube tab closes mid-Adhan
- Guard against `chrome.runtime.sendMessage` throwing when the service worker is unresponsive

### 2.3 — Extension icon and branding

- Design a proper icon set: 16×16, 32×32, 48×48, 128×128 px
- Crescent moon / mosque motif, works in both light and dark Chrome toolbars
- Add `icons` field to `manifest.json`

---

## Phase 3 — Real Prayer Times (Core Value Proposition)

> Goal: the extension knows the correct prayer times for each user's location automatically.

### 3.1 — Automatic prayer time calculation

Currently times are hardcoded defaults. For real use, times must match the user's location.

**Option A — Client-side calculation (recommended):**

Integrate [`adhan-js`](https://github.com/batoulapps/adhan-js) (open-source, MIT licensed, well-maintained):

```bash
npm install adhan
```

The library computes the 5 daily prayer times for any latitude/longitude using standard calculation methods (MWL, ISNA, Egyptian, Makkah, etc.).

**What to build:**

- Add `latitude`, `longitude`, and `calculationMethod` to the stored user settings
- On `scheduleNextAdhan`, compute times using `adhan-js` instead of reading hardcoded list
- Update the options page with a location input (or auto-detect via Geolocation API)

**Option B — Remote API:**

Fetch from [aladhan.com Prayer Times API](https://aladhan.com/prayer-times-api) (free, no auth):

```
GET https://api.aladhan.com/v1/timingsByCity?city=Paris&country=FR&method=2
```

- Requires `host_permissions` in `manifest.json` for `https://api.aladhan.com/*`
- Needs caching in storage to avoid daily API calls
- Adds a network dependency — fragile for a browser extension

**Recommendation:** Option A (adhan-js) — no network dependency, no API key, works offline, more control.

### 3.2 — Location detection

- Add a "Detect my location" button in options → calls `navigator.geolocation.getCurrentPosition()`
- Store lat/lng in `chrome.storage.local`
- Requires no additional `manifest.json` permission (geolocation in options page is allowed)
- Fallback: manual city + country input

### 3.3 — Calculation method selection

Different Islamic jurisprudence schools use different calculation parameters. Expose this in options:

| Method | Region |
|--------|--------|
| Muslim World League (MWL) | Europe, Far East |
| Islamic Society of North America (ISNA) | North America |
| Egyptian General Authority | Africa, Syria |
| Umm Al-Qura University, Makkah | Arabian Peninsula |
| University of Islamic Sciences, Karachi | Pakistan, Bangladesh, India |

---

## Phase 4 — User Experience Improvements

### 4.1 — Notification when YouTube is not open

If prayer time arrives and no YouTube tab is open, silently re-schedule only. Optionally show a Chrome notification:

```typescript
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icons/icon128.png',
  title: 'Prayer Time',
  message: 'It is time for Dhuhr prayer.',
});
```

Requires adding `"notifications"` to `manifest.json` permissions.

### 4.2 — Multiple Adhan audio options

Allow users to select their preferred reciter or recording in the options page:

- Default: Sheikh Salah Idrees Fullatah (Makkah, already bundled)
- Option: Makkah Fajr-specific Adhan (different for Fajr in the Sunnah)
- Option: User-provided URL (BYOA — bring your own Adhan)

Separate `web_accessible_resources` entries per audio file.

### 4.3 — Adhan volume control

Add a volume slider to the options page. Store in `chrome.storage.local`. Apply via `audio.volume` in `AdhanPlayer.ts`.

### 4.4 — "Do not disturb" schedule

Allow users to configure time windows when the extension should not interrupt:

- Example: 23:00–05:30 — sleep mode (Fajr may still be wanted separately)
- Stored as `{ enabled: boolean; from: string; to: string }` in storage

### 4.5 — Visual qibla direction or Hijri date in overlay

Minor visual touch — show today's Hijri date or a compass direction.
Low priority, high-effort — defer to v2+.

---

## Phase 5 — Platform Expansion

### 5.1 — Firefox support

The codebase is MV3-first but was designed to be portable. Firefox supports MV3 since Firefox 109.

Steps:
- Add `browser_specific_settings` to manifest for Firefox (AMO)
- Replace `chrome.*` API calls with `browser.*` via a thin shim or `webextension-polyfill`
- Test on Firefox Nightly
- Submit to [addons.mozilla.org](https://addons.mozilla.org)

### 5.2 — More video platforms

The architecture isolates YouTube-specific logic in `content/youtube/`. Adding a new platform means:

1. Create `content/<platform>/PlayerController.ts` implementing the same interface
2. Add a new content script match pattern in `manifest.json`
3. Add the new entry point to `vite.config.ts`

Priority order (by Muslim user traffic estimates):

1. **Twitch** — livestreaming, harder to pause gracefully
2. **Twitter / X** — autoplay videos in feed
3. **Instagram** — Reels
4. **Generic fallback** — `<video>` on any page (requires `<all_urls>` permission — discuss carefully)

### 5.3 — Chrome Web Store publication

Checklist for submission:

- [ ] Privacy policy page (required — even if no data is collected)
- [ ] Extension description (English + Arabic minimum)
- [ ] Screenshots — at least 3 (overlay on YouTube, options page, popup)
- [ ] 128×128 store icon
- [ ] Category: Productivity / Lifestyle
- [ ] `manifest.json` version bumped to `1.0.0`
- [ ] Production build tested: `npm run build`
- [ ] No console errors in production build
- [ ] `web_accessible_resources` locked to extension origin only

---

## Phase 6 — Long-Term Vision

These are ideas beyond v1. Document here to avoid scope creep now.

| Idea | Effort | Notes |
|------|--------|-------|
| Sync settings across devices | High | Requires `chrome.storage.sync` — 8 KB limit |
| Community reciter library | High | Backend needed |
| Ramadan mode (Suhoor/Iftar times) | Medium | Extend `PrayerName` type |
| Full dua overlay after Adhan | Medium | Audio + text per prayer |
| Reading Quran integration | Very High | Out of scope for this extension |
| Mobile app companion | Very High | Different project entirely |

---

## Immediate Next Actions

In priority order:

1. **Build + reload extension in Chrome** — verify it works end-to-end with real alarm timing
2. **Complete E8-2 (options page)** — users cannot configure prayer times without this
3. **Set real prayer times via options** — test with times 2-3 minutes from now
4. **Complete manual test checklist** — all ⚠️ items
5. **Set up Vitest (E7-1)** — enables confident refactoring going forward
6. **Integrate `adhan-js`** — replaces hardcoded placeholder times (Phase 3.1)
7. **Design proper icon** — required for Chrome Web Store
8. **Prepare store listing** — privacy policy, screenshots, description
