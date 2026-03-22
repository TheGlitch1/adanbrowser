// Value object representing the state of a single Adhan interruption cycle.
// Created at the start of the interruption; used to decide whether to resume playback.
// Lives in the content script closure for the duration of one session.

export interface AdhanSession {
  readonly prayerName: string;
  /** True if the YouTube video was playing when the interruption started */
  readonly wasPlaying: boolean;
}
