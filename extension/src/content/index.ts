// Content script entry point — injected into YouTube watch pages only.
//
// Responsibilities:
//   - Listen for ADHAN_TRIGGER from the background service worker
//   - Orchestrate the interruption flow: pause → show overlay → play Adhan → resume
//   - Report ADHAN_COMPLETE back to background when the flow ends
//
// Rules:
//   - Must be lightweight and non-blocking
//   - `wasPlaying` state is held in a closure — no chrome.storage needed here
//     (content script lifetime equals tab lifetime, so state is safe)
//   - All YouTube DOM logic is delegated to the youtube/ sub-modules

import { createYouTubePlayerController } from './youtube/YouTubePlayerController';
import { createAdhanOverlay } from './youtube/AdhanOverlay';
import { createAdhanPlayer } from './youtube/AdhanPlayer';
import type { ExtensionMessage } from '@shared/messages';

chrome.runtime.onMessage.addListener((message) => {
  const msg = message as ExtensionMessage;
  if (msg.type !== 'ADHAN_TRIGGER') return;

  const { prayerName } = msg.payload;
  const player = createYouTubePlayerController();
  const overlay = createAdhanOverlay();
  const adhan = createAdhanPlayer();

  const wasPlaying = player?.isPlaying() ?? false;
  player?.pause();
  overlay.show(prayerName);

  adhan.play(() => {
    overlay.hide();
    if (wasPlaying) player?.resume();

    chrome.runtime.sendMessage({
      type: 'ADHAN_COMPLETE',
      payload: { prayerName, resumed: wasPlaying },
    } satisfies ExtensionMessage);
  });
});

// ============================================================================
// DEV-ONLY TEST HELPERS
// These will not be included in production builds (when VITE runs with --mode production)
// ============================================================================
if (import.meta.env.DEV) {
  // Manual testing helper for overlay only
  // @ts-ignore - Expose for console testing
  window.__testAdhanOverlay = () => {
    const overlay = createAdhanOverlay();
    overlay.show('Dhuhr');
    console.log('✅ Overlay shown. It will hide in 5 seconds...');
    setTimeout(() => {
      overlay.hide();
      console.log('✅ Overlay hidden.');
    }, 5000);
  };

  // Full interruption flow test (pause → overlay → resume)
  // @ts-ignore - Expose for console testing
  window.__testFullFlow = () => {
    console.log('🧪 Testing full interruption flow...');

    const player = createYouTubePlayerController();
    const overlay = createAdhanOverlay();

    if (!player) {
      console.error('❌ No YouTube player found. Are you on a watch page?');
      return;
    }

    const wasPlaying = player.isPlaying();
    console.log(`📹 Video was ${wasPlaying ? 'playing' : 'paused'}`);

    // Pause the video
    player.pause();
    console.log('⏸️  Video paused');

    // Show overlay
    overlay.show('Dhuhr');
    console.log('✅ Overlay shown');

    // After 5 seconds: hide overlay and resume if it was playing
    setTimeout(() => {
      overlay.hide();
      console.log('✅ Overlay hidden');

      if (wasPlaying) {
        console.log('▶️  Attempting to resume video...');
        player.resume();
        // Give it a moment to check if it actually resumed
        setTimeout(() => {
          if (player.isPlaying()) {
            console.log('✅ Video successfully resumed');
          } else {
            console.error('❌ Video did not resume (possibly autoplay blocked)');
          }
        }, 500);
      } else {
        console.log('ℹ️  Video was not playing, so not resuming');
      }

      console.log('🎉 Full flow test complete!');
    }, 5000);
  };

  console.log('🛠️ Dev mode: Test helpers available - window.__testAdhanOverlay() and window.__testFullFlow()');
}
