# Permissions Matrix

> Document every Chrome permission used and the justification.
> Prefer the least-privilege approach — request permissions only when needed.
> Prefer **optional permissions** over required permissions where possible.

## Required Permissions

| Permission | Justification | Status |
|---|---|---|
| `alarms` | Schedule prayer time triggers; `chrome.alarms` reliably wakes the service worker at the right time | ✅ MVP |
| `storage` | Persist extension settings and (future) prayer schedule config via `chrome.storage.local` | ✅ MVP |

## Optional Permissions

| Permission | Justification | Status |
|---|---|---|
| *(none for MVP)* | | |

## Host Permissions

| Pattern | Justification | Status |
|---|---|---|
| `*://*.youtube.com/*` | Required to (1) inject the content script into YouTube watch pages, and (2) call `chrome.tabs.query` with a URL filter without needing the broad `tabs` permission | ✅ MVP |

## Explicitly Not Requested

| Permission | Why not needed |
|---|---|
| `tabs` | Covered by the YouTube host permission for URL-filtered tab queries |
| `activeTab` | We must target YouTube tabs even when they are in the background |
| `scripting` | Content script is declared statically in `manifest.json` — no dynamic injection |
| `webRequest` / `declarativeNetRequest` | Not intercepting any network traffic |

## References

- [Chrome Permissions Reference](https://developer.chrome.com/docs/extensions/reference/permissions-list/)
- [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
