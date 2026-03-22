# E6-4 Implementation Guide: Skip/Dismiss Adhan Feature

## Problem Statement

**Current Issue:** Users are **forced** to wait for the full 3+ minute Adhan with no way to exit early. This creates a poor user experience if:

- They need to urgently continue watching
- They're in a public place and want to silence it
- They accidentally triggered it

## Requirements

### User Stories

- **As a user**, I want to click a close button to dismiss the Adhan overlay early
- **As a user**, I want to press Escape to quickly exit the interruption
- **As a user**, I expect my video to resume if it was playing before

### Functional Requirements

1. **Close Button (×)** on the overlay in the top-right corner
2. **Escape Key** handler while overlay is visible
3. **Stop audio** immediately when dismissed
4. **Hide overlay** immediately when dismissed
5. **Resume video** if it was playing before interruption
6. **Send `ADHAN_COMPLETE`** message with `skipped: true` flag

---

## Technical Implementation

### 1. Update Message Type Contract

**File:** `extension/src/shared/messages.ts`

```typescript
export type ExtensionMessage =
  | {
      type: 'ADHAN_TRIGGER';
      payload: { prayerName: string };
    }
  | {
      type: 'ADHAN_COMPLETE';
      payload: {
        prayerName: string;
        resumed: boolean;
        skipped?: boolean; // NEW: true if user dismissed early
      };
    };
```

---

### 2. Enhance AdhanOverlay with Close Button

**File:** `extension/src/content/youtube/AdhanOverlay.ts`

**Changes:**

- Add close button (×) with click handler
- Add Escape key listener
- Expose `onDismiss` callback

```typescript
export interface AdhanOverlay {
  show(prayerName: string, onDismiss: () => void): void;
  hide(): void;
}

export function createAdhanOverlay(): AdhanOverlay {
  let dismissCallback: (() => void) | null = null;
  let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

  return {
    show(prayerName, onDismiss) {
      if (document.getElementById(OVERLAY_ID)) return;

      dismissCallback = onDismiss;
      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;

      // ... existing styles ...

      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: '#fff',
        fontSize: '3rem',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '50%',
        transition: 'background 0.2s',
      });

      closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
      };
      closeBtn.onmouseout = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
      };

      closeBtn.onclick = () => {
        if (dismissCallback) dismissCallback();
      };

      overlay.appendChild(closeBtn);

      const message = document.createElement('div');
      message.textContent = getMessage('prayer_reminder', [prayerName]);
      overlay.appendChild(message);

      document.body.appendChild(overlay);

      // Add Escape key handler
      escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dismissCallback) {
          dismissCallback();
        }
      };
      document.addEventListener('keydown', escapeHandler);
    },

    hide() {
      document.getElementById(OVERLAY_ID)?.remove();
      if (escapeHandler) {
        document.removeEventListener('keydown', escapeHandler);
        escapeHandler = null;
      }
      dismissCallback = null;
    },
  };
}
```

---

### 3. Wire Dismiss Handler in Content Script

**File:** `extension/src/content/index.ts`

**Changes:**

- Pass `onDismiss` callback to `overlay.show()`
- Stop audio when dismissed
- Send `ADHAN_COMPLETE` with `skipped: true`

```typescript
chrome.runtime.onMessage.addListener((message) => {
  const msg = message as ExtensionMessage;
  if (msg.type !== 'ADHAN_TRIGGER') return;

  const { prayerName } = msg.payload;
  const player = createYouTubePlayerController();
  const overlay = createAdhanOverlay();
  const adhan = createAdhanPlayer();

  const wasPlaying = player?.isPlaying() ?? false;
  player?.pause();

  // Shared completion logic
  const complete = (skipped: boolean = false) => {
    overlay.hide();
    adhan.stop(); // Stop audio if still playing
    if (wasPlaying) player?.resume();

    chrome.runtime.sendMessage({
      type: 'ADHAN_COMPLETE',
      payload: { prayerName, resumed: wasPlaying, skipped },
    } satisfies ExtensionMessage);
  };

  // Show overlay with dismiss handler
  overlay.show(prayerName, () => {
    // User dismissed early
    complete(true);
  });

  // Play audio with natural completion handler
  adhan.play(() => {
    // Audio finished naturally
    complete(false);
  });
});
```

---

### 4. Update Test Helpers (Dev-only)

**File:** `extension/src/content/index.ts`

Add test for dismiss functionality:

```typescript
if (import.meta.env.VITE_ENABLE_TEST_HELPERS === 'true') {
  // ... existing test helpers ...

  // Test dismiss behavior
  window.__testDismiss = () => {
    console.log('🧪 Testing dismiss/skip functionality...');
    const player = createYouTubePlayerController();
    const overlay = createAdhanOverlay();
    const adhan = createAdhanPlayer();

    if (!player) {
      console.error('❌ No YouTube player found');
      return;
    }

    const wasPlaying = player.isPlaying();
    player.pause();
    console.log('⏸️  Video paused');

    overlay.show('Dhuhr', () => {
      console.log('❌ User dismissed (simulate close button or Escape)');
      overlay.hide();
      adhan.stop();
      if (wasPlaying) player.resume();
      console.log('✅ Dismiss test complete - video should be resumed');
    });

    adhan.play(() => {
      console.log('🎵 Audio ended naturally');
    });

    console.log('ℹ️  Click close button (×) or press Escape to test dismiss');
  };
}
```

---

## Testing Checklist

### Manual Tests

- [ ] Click close button (×) → audio stops, overlay hides, video resumes
- [ ] Press Escape → audio stops, overlay hides, video resumes
- [ ] Let Adhan finish naturally → works as before (no regression)
- [ ] Dismiss while video was already paused → video stays paused
- [ ] Dismiss while video was playing → video resumes
- [ ] Multiple dismiss attempts don't cause errors
- [ ] Background receives `ADHAN_COMPLETE` with `skipped: true`

### Edge Cases

- [ ] Dismiss immediately after trigger (before audio starts)
- [ ] Dismiss during audio playback (mid-Adhan)
- [ ] Navigate away from page mid-Adhan → no memory leaks
- [ ] Close button is keyboard accessible (Tab → Enter)

---

## Considerations

### Accessibility

- Close button has `aria-label="Close"`
- Escape key is a standard dismiss pattern
- Consider adding screen reader announcement

### UX

- Close button is visible and obvious (×)
- Hover effect provides visual feedback
- Position doesn't overlap with message text

### Analytics (Future)

- Track how often users skip vs. listen fully
- Could inform whether Adhan duration should be configurable

---

## Priority

**HIGH** - This is a critical UX feature that should be implemented **before public release**.

Users should always have control to exit an interruption, especially one that lasts 3+ minutes.

---

## Epic 6 Ticket Order Recommendation

After implementing E6-4, the recommended order would be:

1. **E6-4** (Skip/Dismiss) — **IMPLEMENT FIRST** (critical UX)
2. **E6-1** (Visual Design) — Improve appearance with skip button included
3. **E6-2** (SPA Navigation) — Handle YouTube route changes
4. **E6-3** (Duplicate Prevention) — Test and verify existing guard
