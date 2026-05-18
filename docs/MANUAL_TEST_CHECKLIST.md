# Manual Test Checklist — AdanBrowser

> Run this checklist before each release or after major changes.
> Check off each item as you verify it works.

---

## Pre-Test Setup

- [ ] Run `npm run build` — build completes without errors
- [ ] Run `npm run type-check` — zero TypeScript errors
- [ ] Load unpacked extension from `dist/` in Chrome
- [ ] Extension appears in `chrome://extensions` with no errors

---

## Epic 1: Dev Environment

- [ ] Extension icon appears in Chrome toolbar
- [ ] Clicking icon shows popup (white box is expected for now)
- [ ] No console errors on extension load

---

## Epic 2: Core Interruption Flow (YouTube MVP)

### E2-1: YouTubePlayerController

- [ ] Open YouTube video watch page
- [ ] Video can be paused via `window.__testFullFlow()` in console
- [ ] Video resumes correctly after test completes

### E2-2: AdhanOverlay

- [ ] Run `window.__testAdhanOverlay()` in console
- [ ] Dark overlay appears with prayer message
- [ ] Overlay disappears after 5 seconds
- [ ] Running command again works (no duplicate overlay)

### E2-3: AdhanPlayer (Pending)

- [ ] Audio file `adhan.mp3` exists in `dist/`
- [ ] Audio plays when triggered
- [ ] Audio callback fires when playback ends

### E2-4: Full Interruption Flow (Pending)

- [ ] Start playing a YouTube video
- [ ] Trigger adhan (via background alarm or manual trigger)
- [ ] Video pauses immediately
- [ ] Overlay shows with prayer name
- [ ] Adhan audio plays
- [ ] After audio ends: overlay hides, video resumes
- [ ] If video was already paused, it stays paused

---

## Epic 3: Infrastructure Adapters

> **How to inspect:** Open `chrome://extensions` → AdanBrowser → "Service Worker" → Inspect (opens DevTools for the background script)

### E3-1: Alarm Adapter — ⚠️ NEEDS TESTING

- [ ] Reload the extension — check background DevTools console for: `[AdanBrowser] Scheduled <prayer> at <time>`
- [ ] Verify the alarm is registered: in background DevTools console run `chrome.alarms.getAll(console.log)` — should list the next prayer alarm
- [ ] Wait for the alarm to fire (or temporarily set a prayer time 1 minute from now via storage) — `onAlarm` listener triggers and `[AdanBrowser] Adhan complete` should NOT appear yet (that's after content script responds)
- [ ] Confirm alarm name matches the expected prayer name

### E3-2: Messaging Adapter — ⚠️ NEEDS TESTING

- [ ] Open a YouTube watch page (`/watch?v=...`)
- [ ] In background DevTools console, manually trigger: `chrome.tabs.query({url:'*://*.youtube.com/watch*'}, tabs => chrome.tabs.sendMessage(tabs[0].id, {type:'ADHAN_TRIGGER', payload:{prayerName:'dhuhr'}}))`
- [ ] Verify content script receives the message: overlay should appear on the YouTube tab
- [ ] After Adhan completes, verify background receives `ADHAN_COMPLETE`: background console should log `[AdanBrowser] Adhan complete {prayerName: 'dhuhr', ...}`

### E3-3: Storage Adapter — ⚠️ NEEDS TESTING

- [ ] In background DevTools console run: `chrome.storage.local.get(null, console.log)` — should show `{}` on first install (no stored prayer times yet, defaults are used)
- [ ] Write a custom schedule: `chrome.storage.local.set({prayerTimes: [{name:'fajr',hour:5,minute:0},{name:'dhuhr',hour:13,minute:0},{name:'asr',hour:16,minute:30},{name:'maghrib',hour:19,minute:30},{name:'isha',hour:21,minute:0}]})`
- [ ] Reload the extension — check background console: schedule should still log the correct prayer times (confirms persistence survived restart)
- [ ] Clear the override: `chrome.storage.local.remove('prayerTimes')` — reload again — defaults should be used

---

## Epic 5: Localisation

### E5-1: English Locale — ⚠️ NEEDS TESTING

- [ ] Chrome language set to English (`chrome://settings/languages`)
- [ ] Build and reload extension
- [ ] Trigger overlay via `window.__testAdhanOverlay()` (dev build) or wait for alarm
- [ ] Overlay shows: **"It is time for Dhuhr prayer."** (not raw `"dhuhr"`)
- [ ] Prayer name is properly capitalised: `Fajr`, `Dhuhr`, `Asr`, `Maghrib`, `Isha`

### E5-2: Arabic Locale — ⚠️ NEEDS TESTING

- [ ] Chrome language set to Arabic: `chrome://settings/languages` → Add `العربية` → move to top → relaunch Chrome
- [ ] Build and reload extension
- [ ] Trigger overlay
- [ ] Overlay shows: **"حان وقت صلاة الظهر."** (Arabic prayer name, not raw `"dhuhr"`)
- [ ] Text renders right-to-left (Arabic text direction auto-detected via `dir="auto"`)

---

## Epic 6: Overlay UX

### E6-1: Overlay Visuals — ⚠️ NEEDS TESTING

- [ ] Trigger overlay — a **dark card** appears centered on screen (not just floating text)
- [ ] Card has rounded corners, dark blue gradient background, mosque icon (🕌) at top
- [ ] Prayer reminder text is white, readable, properly sized
- [ ] Overlay fades in with a subtle scale animation
- [ ] Dark semi-transparent backdrop blurs the page behind it
- [ ] Design feels respectful and non-aggressive

### E6-2: SPA Navigation — ⚠️ NEEDS TESTING

- [ ] Trigger overlay on a YouTube watch page
- [ ] While overlay is visible and audio is playing, click a YouTube video link (SPA navigation)
- [ ] Overlay disappears immediately on navigation (no orphaned overlay on the new page)
- [ ] Audio stops immediately on navigation
- [ ] No JS errors in console
- [ ] Test also with browser back button while overlay is active

### E6-3: Duplicate Prevention — ⚠️ NEEDS TESTING

> Guard is implemented via element ID check in `AdhanOverlay.ts` — needs explicit verification.

- [ ] In DevTools console, run `window.__testAdhanOverlay()` twice in rapid succession
- [ ] Only **one** overlay appears (second call is a no-op)
- [ ] No duplicate `adanbrowser-adhan-overlay` elements in the DOM (verify via Elements panel)
- [ ] No visual stacking or flicker

### E6-4: Skip / Dismiss — ⚠️ NEEDS TESTING

> **Test helper:** `window.__testDismiss()` in the DevTools console (dev build only)
>
> This feature was merged without manual verification. Run these checks before release.

**Setup:**

- [ ] Run `npm run build:dev` and reload extension in Chrome
- [ ] Navigate to a YouTube watch page (`/watch?v=...`)
- [ ] Open DevTools console

**Close button:**

- [ ] Run `window.__testDismiss()` — overlay appears with a close button (×) in top-right corner
- [ ] Click close button (×) — audio stops, overlay disappears, video resumes
- [ ] Console logs show: `User dismissed` and `Dismiss test complete!`

**Escape key:**

- [ ] Run `window.__testDismiss()` again
- [ ] Press `Escape` — audio stops, overlay disappears, video resumes
- [ ] Console logs same success messages

**Video was already paused:**

- [ ] Pause the video manually before running `window.__testDismiss()`
- [ ] Dismiss via close button or Escape
- [ ] Video stays paused (not resumed) after dismiss

**Audio completes naturally (no dismiss):**

- [ ] Run `window.__testDismiss()` and do nothing
- [ ] Adhan plays to completion
- [ ] Console logs: `Audio ended naturally (user did not dismiss)` — overlay hides and video resumes

**Double-dismiss guard:**

- [ ] Click close button AND press Escape in rapid succession
- [ ] No duplicate `complete` calls, no JS errors in console

---

## Cross-Browser (Future)

- [ ] Works on Chrome
- [ ] Works on Edge (Chromium)
- [ ] Works on Brave
- [ ] Firefox (when MV3 support added)

---

## Performance

- [ ] Content script loads quickly (< 100ms)
- [ ] No janky animations
- [ ] YouTube page remains responsive

---

## Security & Permissions

- [ ] Only required permissions are declared
- [ ] No remote code execution
- [ ] No sensitive data logged to console

---

## Edge Cases

- [ ] Extension works on short videos (< 5 seconds)
- [ ] Extension works on live streams
- [ ] Extension works with ad-blocked YouTube
- [ ] Extension works if user navigates away mid-adhan
- [ ] Extension works if audio file is missing/corrupted

---

## Clean-Up Before Release

- [ ] Remove all `window.__test*` helpers from production code
- [ ] Remove all `console.log` debug statements
- [ ] Remove all `TODO` comments (or address them)
- [ ] Update version in `manifest.json` and `package.json`

---

## Notes

Add any observations or issues encountered during testing:

```
[Date] - [Your Name]
- Issue: ...
- Fix: ...
```
