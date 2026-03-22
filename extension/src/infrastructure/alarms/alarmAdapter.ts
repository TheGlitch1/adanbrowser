// Infrastructure adapter for chrome.alarms API.
// All interaction with chrome.alarms must go through this adapter.
// Callers in application/ depend on the AlarmAdapter interface, not on chrome directly.

export interface AlarmAdapter {
  /** Schedule a named alarm to fire at the given epoch timestamp (ms). */
  create(name: string, scheduledTimeMs: number): void;
  /** Register a callback that runs whenever any alarm fires. */
  onAlarm(callback: (name: string) => void): void;
}

export function createAlarmAdapter(): AlarmAdapter {
  return {
    create(name, scheduledTimeMs) {
      chrome.alarms.create(name, { when: scheduledTimeMs });
    },
    onAlarm(callback) {
      chrome.alarms.onAlarm.addListener((alarm) => callback(alarm.name));
    },
  };
}
