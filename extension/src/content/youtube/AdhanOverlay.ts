// Injects a visible overlay on top of the YouTube video player.
// Shows a prayer-time reminder in the browser UI language via i18n.
//
// Styling is applied inline to avoid conflicts with YouTube's stylesheets.
// Only one overlay instance can be active at a time (guarded by element ID check).
//
// Depends on: @lib/i18n for localised strings.

import { getMessage } from '@lib/i18n';

const OVERLAY_ID = 'adanbrowser-adhan-overlay';

export interface AdhanOverlay {
  /** Inject the overlay into the page. No-op if already visible. */
  show(prayerName: string): void;
  /** Remove the overlay from the page. */
  hide(): void;
}

export function createAdhanOverlay(): AdhanOverlay {
  return {
    show(prayerName) {
      if (document.getElementById(OVERLAY_ID)) return; // guard: already active

      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;

      // TODO: refine styles (background, typography, animation)
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '999999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        fontSize: '2rem',
        fontFamily: 'sans-serif',
      });

      overlay.textContent = getMessage('prayer_reminder', [prayerName]);
      document.body.appendChild(overlay);
    },

    hide() {
      document.getElementById(OVERLAY_ID)?.remove();
    },
  };
}
