// Use case: register the next prayer time alarm via chrome.alarms.
// Called on extension install, on startup, and after each Adhan cycle completes.
//
// Depends on: AlarmAdapter (infrastructure) — never calls chrome.* directly.
//
// TODO: accept a computed list of PrayerTime objects and find the next one relative to now.
// MVP stub: schedules a test alarm 10 seconds from now for development / manual testing.

import type { AlarmAdapter } from '@infrastructure/alarms/alarmAdapter';

export function scheduleNextAdhan(alarmAdapter: AlarmAdapter): void {
  // TODO: replace with real prayer time calculation
  const tenSecondsFromNow = Date.now() + 10_000;
  alarmAdapter.create('fajr', tenSecondsFromNow);
}
