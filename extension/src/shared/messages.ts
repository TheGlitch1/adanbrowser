// All message type contracts for the AdanBrowser extension.
// Every message exchanged between background, content scripts, and popup must be
// defined here using a discriminated union on `type`.
//
// Rule: always handle unknown message types defensively in every listener.

export type ExtensionMessage =
  | {
      type: 'ADHAN_TRIGGER';
      payload: { prayerName: string };
    }
  | {
      type: 'ADHAN_COMPLETE';
      payload: { prayerName: string; resumed: boolean };
    };
