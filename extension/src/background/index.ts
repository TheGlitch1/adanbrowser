// Background service worker entry point (Manifest V3)
//
// Responsibilities:
//   1. Register chrome.alarms.onAlarm → call triggerAdhan use case
//   2. On install / startup → call scheduleNextAdhan use case
//   3. Listen for ADHAN_COMPLETE from content script → re-schedule next prayer (E4-4)
//
// Rules:
//   - No DOM access
//   - No persistent module-level state — all state must live in chrome.storage
//   - Listeners must be registered synchronously so they survive service worker wake-ups

import { createAlarmAdapter } from '@infrastructure/alarms/alarmAdapter';
import { createMessagingAdapter } from '@infrastructure/messaging/messagingAdapter';
import { createStorageAdapter } from '@infrastructure/storage/storageAdapter';
import { scheduleNextAdhan } from '@application/prayer/scheduleAdhan';
import { triggerAdhan } from '@application/prayer/triggerAdhan';
import type { ExtensionMessage } from '@shared/messages';

const alarmAdapter = createAlarmAdapter();
const messagingAdapter = createMessagingAdapter();
const storageAdapter = createStorageAdapter();

// Must be registered synchronously — runs every time the service worker is woken by an alarm
alarmAdapter.onAlarm((name) => {
  triggerAdhan(messagingAdapter, name);
});

chrome.runtime.onInstalled.addListener(() => {
  scheduleNextAdhan(alarmAdapter, storageAdapter).catch(console.error);
});

chrome.runtime.onStartup.addListener(() => {
  scheduleNextAdhan(alarmAdapter, storageAdapter).catch(console.error);
});

chrome.runtime.onMessage.addListener((message) => {
  const msg = message as ExtensionMessage;
  if (msg.type === 'ADHAN_COMPLETE') {
    console.log('[AdanBrowser] Adhan complete', msg.payload);
    // E4-4: re-schedule the next prayer after each completed cycle
    scheduleNextAdhan(alarmAdapter, storageAdapter).catch(console.error);
  }
});
