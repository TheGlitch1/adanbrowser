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

  // Shared completion logic for both natural end and early dismiss
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
    // User dismissed early (close button or Escape key)
    complete(true);
  });

  // Play audio with natural completion handler
  adhan.play(() => {
    // Audio finished naturally
    complete(false);
  });
});

// ============================================================================
// DEV-ONLY TEST HELPERS
// These will not be included in production builds
// ============================================================================
if (import.meta.env.VITE_ENABLE_TEST_HELPERS === 'true') {
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

  // Test audio playback only
  // @ts-ignore - Expose for console testing
  window.__testAudio = () => {
    console.log('🎵 Testing Adhan audio playback...');
    const adhan = createAdhanPlayer();
    
    adhan.play(() => {
      console.log('✅ Audio playback completed');
    });
    console.log('ℹ️  Audio should be playing now. Check your volume!');
  };

  // Complete interruption flow with audio (simulates ADHAN_TRIGGER message)
  // @ts-ignore - Expose for console testing
  window.__testCompleteFlow = () => {
    console.log('🧪 Testing COMPLETE interruption flow (pause → overlay → audio → resume)...');
    
    const player = createYouTubePlayerController();
    const overlay = createAdhanOverlay();
    const adhan = createAdhanPlayer();

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

    // Play Adhan audio (this is the real 3+ minute Adhan)
    console.log('🎵 Playing Adhan audio... (this will take ~3 minutes)');
    adhan.play(() => {
      // This callback fires when audio ends
      console.log('🎵 Adhan playback completed');
      
      // Hide overlay
      overlay.hide();
      console.log('✅ Overlay hidden');

      // Resume video if it was playing
      if (wasPlaying) {
        console.log('▶️  Attempting to resume video...');
        player.resume();
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

      console.log('🎉 COMPLETE FLOW TEST FINISHED!');
    });
  };

  // Test dismiss/skip functionality (close button and Escape key)
  // @ts-ignore - Expose for console testing
  window.__testDismiss = () => {
    console.log('🧪 Testing dismiss/skip functionality...');
    console.log('ℹ️  Click the close button (×) or press Escape to test dismiss');
    
    const player = createYouTubePlayerController();
    const overlay = createAdhanOverlay();
    const adhan = createAdhanPlayer();

    if (!player) {
      console.error('❌ No YouTube player found. Are you on a watch page?');
      return;
    }

    const wasPlaying = player.isPlaying();
    console.log(`📹 Video was ${wasPlaying ? 'playing' : 'paused'}`);
    player.pause();
    console.log('⏸️  Video paused');

    // Show overlay with dismiss callback
    overlay.show('Dhuhr', () => {
      console.log('❌ User dismissed (close button or Escape pressed)');
      overlay.hide();
      adhan.stop();
      console.log('🔇 Audio stopped');
      
      if (wasPlaying) {
        player.resume();
        console.log('▶️  Video resumed');
      }
      console.log('✅ Dismiss test complete!');
    });

    // Start audio
    adhan.play(() => {
      console.log('🎵 Audio ended naturally (user did not dismiss)');
    });
    console.log('🎵 Audio playing... Click × or press Escape to dismiss');
  };

  console.log('🛠️ Dev mode: Test helpers available - window.__testAdhanOverlay(), window.__testFullFlow(), window.__testAudio(), window.__testCompleteFlow(), window.__testDismiss()');
}