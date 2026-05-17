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
  show(prayerName: string, onDismiss?: () => void): void;
  /** Remove the overlay from the page. */
  hide(): void;
}

export function createAdhanOverlay(): AdhanOverlay {
  let dismissCallback: (() => void) | null = null;
  let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

  return {
    show(prayerName, onDismiss) {
      if (document.getElementById(OVERLAY_ID)) return; // guard: already active

      dismissCallback = onDismiss || null;

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

      // Create close button (×)
      if (onDismiss) {
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
          lineHeight: '1',
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
      }

      // Create message container
      const message = document.createElement('div');
      message.textContent = getMessage('prayer_reminder', [prayerName]);
      overlay.appendChild(message);

      document.body.appendChild(overlay);

      // Add Escape key handler
      if (onDismiss) {
        escapeHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && dismissCallback) {
            dismissCallback();
          }
        };
        document.addEventListener('keydown', escapeHandler);
      }
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
