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
