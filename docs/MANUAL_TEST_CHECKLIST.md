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

### E3-1: Alarm Adapter

- [ ] Alarm is created on extension install
- [ ] Alarm fires at scheduled time
- [ ] `onAlarm` listener is triggered

### E3-2: Messaging Adapter

- [ ] Background can send messages to YouTube tabs
- [ ] Content script receives `ADHAN_TRIGGER` message
- [ ] Background receives `ADHAN_COMPLETE` message from content

### E3-3: Storage Adapter

- [ ] Data can be saved to `chrome.storage.local`
- [ ] Data persists after extension reload
- [ ] Data can be retrieved correctly

---

## Epic 5: Localisation

### E5-1: English Locale

- [ ] Chrome language set to English
- [ ] Overlay shows: "It is time for [prayer] prayer."
- [ ] Prayer name is displayed correctly

### E5-2: Arabic Locale

- [ ] Chrome language set to Arabic (العربية)
- [ ] Overlay shows: "حان وقت صلاة [prayer]."
- [ ] Text direction is RTL (if needed)

---

## Epic 6: Overlay UX

### E6-1: Overlay Visuals

- [ ] Overlay background is respectful (not aggressive)
- [ ] Typography is readable
- [ ] Animation is smooth (if added)

### E6-2: SPA Navigation

- [ ] Trigger overlay on video page
- [ ] Navigate to another YouTube page (SPA route change)
- [ ] Overlay auto-cleans up (no orphaned overlay)

### E6-3: Duplicate Prevention

- [ ] Trigger overlay multiple times rapidly
- [ ] Only one overlay instance appears
- [ ] No visual glitches or stacking

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
