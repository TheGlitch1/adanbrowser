// Use case: register the next prayer time alarm via chrome.alarms.
// Called on extension install, on startup, and after each Adhan cycle completes.
//
// Depends on: AlarmAdapter + StorageAdapter (infrastructure) — never calls chrome.* directly.
//
// Data source: reads PrayerTime[] from chrome.storage.local.
// Falls back to DEFAULT_PRAYER_TIMES if nothing is stored yet.
// Users can override by writing their own schedule to PRAYER_TIMES_STORAGE_KEY.

import type { AlarmAdapter } from '@infrastructure/alarms/alarmAdapter';
import type { StorageAdapter } from '@infrastructure/storage/storageAdapter';
import type { PrayerTime } from '@domain/prayer/PrayerTime';
import { findNextPrayer, nextPrayerDate, DEFAULT_PRAYER_TIMES } from '@domain/prayer/PrayerTime';

/** chrome.storage.local key for the user's prayer time schedule */
export const PRAYER_TIMES_STORAGE_KEY = 'prayerTimes';

/**
 * Reads the prayer schedule from storage (falling back to hardcoded defaults),
 * computes the next prayer after now, and registers a chrome alarm for it.
 *
 * Called on install, startup, and after each completed Adhan cycle (E4-4).
 */
export async function scheduleNextAdhan(
  alarmAdapter: AlarmAdapter,
  storageAdapter: StorageAdapter,
): Promise<void> {
  const stored = await storageAdapter.get<PrayerTime[]>(PRAYER_TIMES_STORAGE_KEY);
  const prayers = stored ?? DEFAULT_PRAYER_TIMES;

  const now = new Date();
  const next = findNextPrayer(prayers, now);

  if (!next) {
    console.warn('[AdanBrowser] No prayer times available — schedule skipped');
    return;
  }

  const scheduledAt = nextPrayerDate(next, now);
  alarmAdapter.create(next.name, scheduledAt.getTime());
  console.log(`[AdanBrowser] Scheduled ${next.name} at ${scheduledAt.toLocaleTimeString()}`);
}
