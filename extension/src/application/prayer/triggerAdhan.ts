// Use case: send ADHAN_TRIGGER to all open YouTube watch tabs.
// Called by the background service worker when a prayer time alarm fires.
//
// Depends on: MessagingAdapter (infrastructure) — no direct chrome.* calls here.

import type { MessagingAdapter } from '@infrastructure/messaging/messagingAdapter';
import type { ExtensionMessage } from '@shared/messages';

export async function triggerAdhan(
  messagingAdapter: MessagingAdapter,
  prayerName: string,
): Promise<void> {
  const message: ExtensionMessage = {
    type: 'ADHAN_TRIGGER',
    payload: { prayerName },
  };
  await messagingAdapter.sendToYouTubeTabs(message);
}
