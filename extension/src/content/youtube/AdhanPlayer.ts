// Plays the bundled Adhan audio file and fires a callback when playback ends.
//
// The audio asset is loaded via chrome.runtime.getURL so the browser can resolve
// the extension-internal URL. It must be declared in manifest.json under
// web_accessible_resources with matches: ["*://*.youtube.com/*"].
//
// IMPORTANT: Place the audio file at extension/public/adhan.mp3 before building.

export interface AdhanPlayer {
  /** Start Adhan playback. Calls onEnded when the audio finishes naturally. */
  play(onEnded: () => void): void;
  /** Stop and discard the current audio element (e.g. if the tab is closed early). */
  stop(): void;
}

export function createAdhanPlayer(): AdhanPlayer {
  let audioEl: HTMLAudioElement | null = null;

  return {
    play(onEnded) {
      audioEl = new Audio(chrome.runtime.getURL('adhan.mp3'));
      audioEl.addEventListener('ended', onEnded, { once: true });
      audioEl.play().catch(() => {
        // TODO: handle autoplay policy rejection — consider a user-gesture fallback
      });
    },

    stop() {
      if (!audioEl) return;
      audioEl.pause();
      audioEl.src = '';
      audioEl = null;
    },
  };
}
