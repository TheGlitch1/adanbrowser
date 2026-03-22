# Manifest V3 Architecture

## Component Map

| Component | Source | Output | Role |
|---|---|---|---|
| Service Worker | `src/background/index.ts` | `dist/background/index.js` | Event-driven background logic |
| Content Script | `src/content/index.ts` | `dist/content/index.js` | Injected into web pages |
| Popup | `src/popup/popup.ts` | `dist/popup/index.html` | Toolbar UI |
| Options Page | `src/options/options.ts` | `dist/options/index.html` | Settings UI |

## Key MV3 Constraints

- Background **pages** are replaced by **service workers** — no persistent in-memory state
- `XMLHttpRequest` is not available in service workers — use `fetch`
- Remote code execution is **prohibited**
- `webRequestBlocking` replaced by Declarative Net Request API

## Architecture Layers

```
domain/          ← Pure business logic, zero browser API imports
application/     ← Use cases; orchestrates domain + infrastructure
infrastructure/  ← chrome.* API wrappers (storage, messaging, tabs…)
lib/             ← Shared chrome utility helpers
shared/          ← Cross-layer types, interfaces, message contracts
```

## Dependency Rule

```
popup / content / background
        ↓
   application/
        ↓
     domain/        ← no dependencies on outer layers
        ↑
 infrastructure/    ← depends on domain interfaces, never on application
```
