# Testing Strategy — AdanBrowser

> Defines the testing approach for quality assurance and preventing regressions.

## Testing Pyramid

```
         /\
        /  \     E2E / Manual Tests (Smoke)
       /----\
      /      \   Integration Tests
     /--------\
    /          \ Unit Tests (Majority)
   /__________\
```

---

## 1. Unit Tests (Automated)

**Goal:** Test individual modules in isolation without browser APIs.

**Framework:** Vitest (planned in E7-1)

**Coverage:**

- `YouTubePlayerController` - DOM queries, pause/resume logic
- `AdhanOverlay` - DOM injection, duplicate prevention
- `AdhanPlayer` - Audio playback callbacks
- `scheduleAdhan` - Alarm time calculation
- `triggerAdhan` - Message dispatch logic

**Location:** `tests/unit/`

**Example:**

```typescript
// tests/unit/YouTubePlayerController.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createYouTubePlayerController } from '@/content/youtube/YouTubePlayerController';

describe('YouTubePlayerController', () => {
  beforeEach(() => {
    // Mock DOM with JSDOM
    document.body.innerHTML = '<div id="movie_player"><video></video></div>';
  });

  it('should detect playing state', () => {
    const controller = createYouTubePlayerController();
    expect(controller.isPlaying()).toBe(false);
  });
});
```

---

## 2. Integration Tests (Automated)

**Goal:** Test how modules work together (e.g., full interruption flow).

**Framework:** Vitest + Chrome Extension Test Utils

**Coverage:**

- Background → Content message flow
- Content script orchestration (pause → overlay → audio → resume)
- Alarm → trigger flow

**Location:** `tests/integration/`

---

## 3. Manual Tests (Developer-run)

**Goal:** Test browser-specific behavior that can't be automated.

**When:** Before each release, after major changes.

**Documented in:** `docs/MANUAL_TEST_CHECKLIST.md` (to be created)

**Key scenarios:**

- Extension loads without manifest errors
- Overlay appears on YouTube watch page
- Audio plays when triggered
- Video resumes after interruption
- Localization works (en/ar)
- Permissions are minimal

---

## 4. Development Test Helpers (Dev-only)

**Current problem:** Test code mixed with production code (`window.__testAdhanOverlay`).

**Solution:** Conditional test helpers or separate dev manifest.

### Option A: Conditional Helpers (Simple)

```typescript
// Only expose in development builds
if (import.meta.env.DEV) {
  window.__testAdhanOverlay = () => {
    /* ... */
  };
}
```

### Option B: Separate Test Script (Better)

- Create `extension/src/dev/testHelpers.ts`
- Add to manifest only in dev builds
- Load via separate content script entry

**Decision:** Use Option A for MVP speed; migrate to Option B later.

---

## 5. Regression Prevention

**Git Hooks (Future):**

- Pre-commit: Run type-check + unit tests
- Pre-push: Run full test suite

**CI/CD (Future):**

- GitHub Actions on PR: Run tests + build
- Block merge if tests fail

---

## Current State (March 22, 2026)

| Test Type        | Status      | Notes                                               |
| ---------------- | ----------- | --------------------------------------------------- |
| Unit Tests       | `TODO`      | E7-1 (Vitest setup) not started                     |
| Integration      | `TODO`      | Requires Vitest + chrome-extension-testing-utils    |
| Manual Checklist | `TODO`      | Need to document steps                              |
| Dev Helpers      | `TEMPORARY` | Currently polluting production code - needs cleanup |

---

## Immediate Action Items

1. ✅ Create this strategy doc
2. ⏳ Move test helpers to conditional dev-only code
3. ⏳ Create `MANUAL_TEST_CHECKLIST.md`
4. ⏳ Set up Vitest (E7-1) after Epic 2 completes
5. ⏳ Write unit tests for E2-1, E2-2, E2-3

---

## Best Practices

- **Don't pollute production** - Test code should not ship to users
- **Test behavior, not implementation** - Tests should survive refactors
- **Keep tests fast** - Unit tests should run in milliseconds
- **Test edge cases** - What happens when player is null? When audio fails?
- **Mock chrome APIs** - Use `@types/chrome` and mocking libraries

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Chrome Extensions](https://developer.chrome.com/docs/extensions/mv3/tut_testing/)
- [JSDOM for DOM testing](https://github.com/jsdom/jsdom)
