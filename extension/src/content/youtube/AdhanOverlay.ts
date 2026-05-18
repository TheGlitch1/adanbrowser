// Injects a visible overlay on top of the YouTube video player.
// Shows a prayer-time reminder in the browser UI language via i18n.
//
// Styling is applied inline to avoid conflicts with YouTube's stylesheets.
// Only one overlay instance can be active at a time (guarded by element ID check).
//
// Depends on: @lib/i18n for localised strings.

import { getMessage } from '@lib/i18n';

const OVERLAY_ID = 'adanbrowser-adhan-overlay';
const STYLES_ID  = 'adanbrowser-styles';

export interface AdhanOverlay {
  /** Inject the overlay into the page. No-op if already visible. */
  show(prayerName: string, onDismiss?: () => void): void;
  /** Remove the overlay from the page. */
  hide(): void;
}

/** Inject the fade-in keyframe animation once per page load. */
function ensureStyles(): void {
  if (document.getElementById(STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = STYLES_ID;
  style.textContent = `
    @keyframes adanbrowser-fadein {
      from { opacity: 0; transform: scale(0.96); }
      to   { opacity: 1; transform: scale(1);    }
    }
  `;
  document.head.appendChild(style);
}

export function createAdhanOverlay(): AdhanOverlay {
  let dismissCallback: (() => void) | null = null;
  let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

  return {
    show(prayerName, onDismiss) {
      if (document.getElementById(OVERLAY_ID)) return; // guard: already active

      ensureStyles();
      dismissCallback = onDismiss || null;

      // E5-3: translate prayer name via i18n; fall back to raw value if key missing
      const localizedName = getMessage(`prayer_${prayerName}`) || prayerName;
      const messageText   = getMessage('prayer_reminder', [localizedName]);

      // ── Backdrop ──────────────────────────────────────────────────────────
      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      Object.assign(overlay.style, {
        position:       'fixed',
        inset:          '0',
        zIndex:         '2147483647',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(4px)',
        fontFamily:     "'Segoe UI', system-ui, -apple-system, sans-serif",
      });

      // ── Card ──────────────────────────────────────────────────────────────
      const card = document.createElement('div');
      Object.assign(card.style, {
        position:     'relative',
        background:   'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        color:        '#fff',
        borderRadius: '16px',
        padding:      '48px 52px 40px',
        maxWidth:     '420px',
        width:        '90vw',
        textAlign:    'center',
        boxShadow:    '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
        animation:    'adanbrowser-fadein 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      });

      // ── Close button ──────────────────────────────────────────────────────
      if (onDismiss) {
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.setAttribute('aria-label', 'Close');
        Object.assign(closeBtn.style, {
          position:   'absolute',
          top:        '12px',
          right:      '16px',
          background: 'transparent',
          border:     'none',
          color:      'rgba(255,255,255,0.45)',
          fontSize:   '2rem',
          cursor:     'pointer',
          lineHeight: '1',
          padding:    '4px 8px',
          borderRadius: '4px',
          transition: 'color 0.15s',
        });
        closeBtn.onmouseover = () => { closeBtn.style.color = '#fff'; };
        closeBtn.onmouseout  = () => { closeBtn.style.color = 'rgba(255,255,255,0.45)'; };
        closeBtn.onclick     = () => { if (dismissCallback) dismissCallback(); };
        card.appendChild(closeBtn);
      }

      // ── Icon ──────────────────────────────────────────────────────────────
      const icon = document.createElement('div');
      icon.textContent = '🕌';
      Object.assign(icon.style, {
        fontSize:     '3rem',
        marginBottom: '16px',
        lineHeight:   '1',
      });
      card.appendChild(icon);

      // ── Message ───────────────────────────────────────────────────────────
      const msg = document.createElement('p');
      msg.textContent = messageText;
      msg.setAttribute('dir', 'auto'); // E5-2: respects Arabic RTL automatically
      Object.assign(msg.style, {
        margin:        '0',
        fontSize:      '1.35rem',
        lineHeight:    '1.65',
        fontWeight:    '500',
        letterSpacing: '0.01em',
        color:         'rgba(255, 255, 255, 0.92)',
      });
      card.appendChild(msg);

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      // ── Escape key handler ────────────────────────────────────────────────
      if (onDismiss) {
        escapeHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && dismissCallback) dismissCallback();
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

