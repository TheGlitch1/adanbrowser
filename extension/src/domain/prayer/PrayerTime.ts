// Value object representing a single scheduled prayer time.
// Pure data type — no browser APIs, no side effects.
// Used by the scheduleAdhan use case to compute when the next alarm should fire.

import type { PrayerName } from '@shared/types';

export interface PrayerTime {
  readonly name: PrayerName;
  /** 0–23, local time */
  readonly hour: number;
  /** 0–59, local time */
  readonly minute: number;
}

/**
 * Placeholder default schedule.
 * These are approximate mid-latitude values — each user should configure
 * their own times via chrome.storage.local (key: PRAYER_TIMES_STORAGE_KEY).
 */
export const DEFAULT_PRAYER_TIMES: readonly PrayerTime[] = [
  { name: 'fajr',    hour: 5,  minute: 0  },
  { name: 'dhuhr',   hour: 13, minute: 0  },
  { name: 'asr',     hour: 16, minute: 30 },
  { name: 'maghrib', hour: 19, minute: 30 },
  { name: 'isha',    hour: 21, minute: 0  },
];

/**
 * Returns the next prayer after `now`, wrapping to the first prayer of tomorrow
 * if all of today's prayers have already passed.
 * Returns null only if the prayers array is empty.
 */
export function findNextPrayer(prayers: readonly PrayerTime[], now: Date): PrayerTime | null {
  if (prayers.length === 0) return null;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...prayers].sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));

  // First prayer still ahead of us today
  const next = sorted.find(p => p.hour * 60 + p.minute > nowMinutes);

  // All passed today → wrap to the first prayer (will be dated tomorrow)
  return next ?? sorted[0];
}

/**
 * Compute the absolute Date when `prayer` should fire next, relative to `now`.
 * Pushes to tomorrow if the prayer time has already passed today.
 */
export function nextPrayerDate(prayer: PrayerTime, now: Date): Date {
  const target = new Date(now);
  target.setHours(prayer.hour, prayer.minute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // Prayer already passed today — schedule for tomorrow
    target.setDate(target.getDate() + 1);
  }

  return target;
}
