# MVP YouTube Adhan Interruption

## Product summary

Build a browser extension focused on YouTube as the first MVP.

The extension must detect when it is time for prayer, temporarily interrupt the currently playing YouTube video, display a visible overlay message on top of the player, play the Adhan audio, and then resume the video if it was playing before the interruption.

This MVP is intentionally limited to YouTube only.
It is not intended yet to support every website or every browser media source.

## Primary goal

Deliver a reliable and simple first version that proves the interruption flow works correctly on YouTube.

## Functional requirements

1. The extension targets Chrome/Chromium first using Manifest V3.
2. The extension only supports YouTube for the MVP.
3. When prayer time is reached:
   - if a YouTube video is currently playing, the extension pauses it
   - the extension displays an overlay on top of the video player
   - the overlay shows a prayer-time reminder message
   - the extension plays the Adhan audio
   - once the Adhan finishes, the extension resumes the video only if it was playing before interruption
4. If no YouTube video is currently playing:
   - the extension should not try to resume anything
   - the extension may still display a lightweight reminder behavior depending on implementation decisions
5. The overlay message must adapt to the browser UI language when possible.
6. The MVP must be structured so that future support for more sites can be added later.

## Non-functional requirements

1. Keep the architecture modular and easy to extend.
2. Avoid hard-coding site-specific logic outside dedicated YouTube-related modules.
3. Keep permissions minimal.
4. Do not introduce unnecessary dependencies.
5. Do not implement multi-site support yet.
6. Do not implement full prayer-time calculation yet unless needed for the MVP path.
7. The codebase must remain readable for collaborative work and learning.

## MVP scope boundaries

### Included
- Chrome / Chromium support
- Manifest V3
- YouTube only
- Pause / overlay / Adhan / resume flow
- Basic localization-ready structure
- Clean internal architecture

### Excluded for now
- Firefox compatibility work
- Support for all websites
- Support for all audio/video players on the web
- Advanced settings UI
- Complex prayer time settings
- Account system
- Sync across devices

## UX expectations

1. The interruption should feel intentional and respectful.
2. The overlay should be clearly visible and not visually aggressive.
3. The extension should not break the YouTube page.
4. The resume behavior must be safe and predictable.

## Technical expectations

The project should distinguish responsibilities between:
- extension runtime logic
- YouTube page interaction
- media interruption flow
- localization support
- future prayer scheduling logic

## Future evolution

This MVP should prepare the project for future expansion toward:
- generic media handling
- support for multiple websites
- better settings
- richer prayer scheduling logic
- Firefox support