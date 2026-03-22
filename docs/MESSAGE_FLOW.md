# Message Flow

> Describes how extension components communicate with each other.

## Adhan Interruption Flow

```
[chrome.alarms.onAlarm]
        │
        ▼
background/index.ts
        │  calls triggerAdhan(messagingAdapter, prayerName)
        ▼
application/prayer/triggerAdhan.ts
        │  calls messagingAdapter.sendToYouTubeTabs(ADHAN_TRIGGER)
        ▼
infrastructure/messaging/messagingAdapter.ts
        │  chrome.tabs.query({ url: '*://*.youtube.com/watch*' })
        │  chrome.tabs.sendMessage(tabId, ADHAN_TRIGGER)
        ▼
content/index.ts  (YouTube watch tab)
        ├─ YouTubePlayerController.isPlaying() → wasPlaying
        ├─ YouTubePlayerController.pause()
        ├─ AdhanOverlay.show(prayerName)
        └─ AdhanPlayer.play(onEnded)
                    │
             [audio ended]
                    │
        ├─ AdhanOverlay.hide()
        ├─ if wasPlaying → YouTubePlayerController.resume()
        └─ chrome.runtime.sendMessage(ADHAN_COMPLETE)
                    │
                    ▼
background/index.ts
        └─ log result / TODO: schedule next alarm
```

## Message Contract (`src/shared/messages.ts`)

```ts
export type ExtensionMessage =
  | { type: 'ADHAN_TRIGGER'; payload: { prayerName: string } }
  | { type: 'ADHAN_COMPLETE'; payload: { prayerName: string; resumed: boolean } };
```

## APIs Used

| Direction | API | Notes |
|---|---|---|
| Background → Content | `chrome.tabs.sendMessage` | Targets each YouTube watch tab by ID |
| Content → Background | `chrome.runtime.sendMessage` | Reports `ADHAN_COMPLETE` after flow ends |

## Conventions

- Listeners must be registered synchronously in the service worker (top of `background/index.ts`)
- Use `Promise.allSettled` when sending to multiple tabs — a closed tab must not abort the others
- Log unrecognised message types in every listener for debuggability
