Use the repository context and read these files first:

- .github/copilot-instructions.md
- docs/MVP_YOUTUBE_ADHAN.md
- docs/MV3_ARCHITECTURE.md
- docs/PERMISSIONS_MATRIX.md
- docs/MESSAGE_FLOW.md

Task:
Analyze the documented MVP and prepare the implementation plan for the first working version of the YouTube-only Adhan interruption extension.

What I want from you:
1. Identify the modules and files that should be created or updated.
2. Propose the cleanest architecture for this MVP only.
3. Explain how responsibilities should be split between background logic, content script logic, shared utilities, localization, and media interruption flow.
4. List the minimum browser permissions and why each is needed.
5. Explain the expected message flow between extension parts.
6. Do not implement business logic yet.
7. Do not generate full code yet.
8. Keep the proposal focused on MVP scope only.

Constraints:
- Chrome / Chromium first
- Manifest V3
- YouTube only
- Pause current YouTube video
- Show overlay on top of the player
- Play Adhan audio
- Resume playback only if video was previously playing
- Prepare localization-ready structure based on browser language
- Minimal dependencies
- Clean modular architecture

Output format:
- MVP architecture summary
- impacted files
- responsibilities by module
- permissions list
- message flow
- technical risks
- assumptions