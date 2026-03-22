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
      // Clean up any existing audio element
      if (audioEl) {
        audioEl.pause();
        audioEl.src = '';
      }

      audioEl = new Audio(chrome.runtime.getURL('adhan.mp3'));
      
      // Handle successful playback end
      audioEl.addEventListener('ended', () => {
        if (import.meta.env.VITE_ENABLE_TEST_HELPERS === 'true') {
          console.log('🎵 Adhan playback completed');
        }
        onEnded();
      }, { once: true });

      // Handle playback errors (missing file, corrupt audio, etc.)
      audioEl.addEventListener('error', (e) => {
        console.error('❌ Adhan playback error:', e);
        // Still call onEnded so the flow continues
        onEnded();
      }, { once: true });

      // Start playback
      audioEl.play().catch((err) => {
        console.warn('⚠️ Autoplay blocked or play() failed:', err.message);
        // Note: If autoplay is blocked, the overlay will remain visible
        // User can click anywhere on the page to trigger playback
        // TODO: Add user-facing prompt for manual playback start
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
