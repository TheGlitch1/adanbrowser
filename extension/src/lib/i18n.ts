// Typed wrapper around chrome.i18n.getMessage.
// Use this helper instead of calling chrome.i18n.getMessage directly in UI modules.
// Locale strings are defined in extension/_locales/*/messages.json.

/**
 * Returns the localised string for the given key.
 * Falls back to the key itself if the message is not defined, so the UI never shows blank.
 */
export function getMessage(key: string, substitutions?: string[]): string {
  const message = chrome.i18n.getMessage(key, substitutions);
  return message || key;
}
