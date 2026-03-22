// Infrastructure adapter for chrome.runtime and chrome.tabs messaging APIs.
// All cross-component messaging must go through this adapter.
// Callers in application/ depend on the MessagingAdapter interface, not on chrome directly.

import type { ExtensionMessage } from '@shared/messages';

export interface MessagingAdapter {
  /** Send a message to a specific tab by ID. */
  sendToTab(tabId: number, message: ExtensionMessage): Promise<void>;
  /** Query all open YouTube watch tabs and send a message to each. */
  sendToYouTubeTabs(message: ExtensionMessage): Promise<void>;
  /** Register a listener for messages arriving at this extension context. */
  onMessage(callback: (message: ExtensionMessage) => void): void;
}

export function createMessagingAdapter(): MessagingAdapter {
  return {
    async sendToTab(tabId, message) {
      await chrome.tabs.sendMessage(tabId, message);
    },

    async sendToYouTubeTabs(message) {
      const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/watch*' });
      await Promise.allSettled(
        tabs
          .filter((tab): tab is chrome.tabs.Tab & { id: number } => typeof tab.id === 'number')
          .map((tab) => chrome.tabs.sendMessage(tab.id, message)),
      );
    },

    onMessage(callback) {
      chrome.runtime.onMessage.addListener((message) => {
        callback(message as ExtensionMessage);
      });
    },
  };
}
