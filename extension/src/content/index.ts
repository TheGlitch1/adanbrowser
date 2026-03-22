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
