---
mode: agent
description: Scaffold a new feature following the AdanBrowser clean architecture
---

# New Feature Scaffold

I want to add a new feature to the AdanBrowser extension.

**Feature name:** ${input:featureName:e.g. bookmarkSync}
**Description:** ${input:description:Brief description of what the feature does}
**Entry points affected:** ${input:entryPoints:background / content / popup / options}

## Instructions

Please scaffold the following structure, following clean architecture:

1. `extension/src/domain/${featureName}/` — domain types, interfaces, pure logic (no browser APIs)
2. `extension/src/application/${featureName}/` — use case(s) coordinating domain + infrastructure
3. `extension/src/infrastructure/${featureName}/` — chrome.* integration (only if needed)
4. Wire up the entry point(s) listed above with a call to the use case

## Rules

- TypeScript strict mode — no `any`
- Placeholder files only — add `// TODO:` comments where logic is expected
- Each file must have a single clear responsibility
- If new `chrome` permissions are needed, note them in a comment and update `docs/PERMISSIONS_MATRIX.md`
- If new message types are needed, add them to `extension/src/shared/messages.ts`
