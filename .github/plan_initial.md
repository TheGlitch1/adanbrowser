You are a senior software architect specialized in browser extensions (Manifest V3) and TypeScript.

Your goal is NOT to implement features.

Your goal is to SETUP the foundation of a professional browser extension project.

---

## CONTEXT

We are building a browser extension:
- Target: Chrome (Chromium) first
- Future: Firefox compatibility
- Stack: TypeScript + Vite
- Architecture: clean, modular, scalable
- Development style: AI-assisted (Copilot + structured prompts)

This project will be used for learning and collaboration between two developers (junior + senior).

---

## IMPORTANT RULES

- DO NOT implement business logic
- DO NOT add unnecessary dependencies
- DO NOT invent features
- DO NOT over-engineer
- ONLY create structure, folders, and placeholder files

---

## TASK

Create the INITIAL PROJECT STRUCTURE for a browser extension.

---

## REQUIRED STRUCTURE

You must create:

### 1. Core extension structure

- extension/public/manifest.json
- extension/src/background/
- extension/src/content/
- extension/src/popup/
- extension/src/options/
- extension/src/lib/
- extension/src/shared/

---

### 2. Architecture layers

- extension/src/domain/
- extension/src/application/
- extension/src/infrastructure/

---

### 3. Documentation

- docs/PRODUCT_SCOPE.md
- docs/PROJECT_ROADMAP.md
- docs/MV3_ARCHITECTURE.md
- docs/PERMISSIONS_MATRIX.md
- docs/MESSAGE_FLOW.md

---

### 4. AI collaboration system

- .github/copilot-instructions.md
- .github/prompts/
- .github/agents/

---

### 5. Dev environment

- package.json
- tsconfig.json
- vite.config.ts
- eslint.config.js
- prettier.config.js

---

### 6. Dev scripts folder

- scripts/dev
- scripts/build
- scripts/test

---

## OUTPUT FORMAT

- Show full folder tree
- Show minimal placeholder content ONLY when necessary
- Keep everything clean and minimal

---

## FINAL GOAL

We want a clean, scalable, production-ready foundation
for a browser extension project.

No implementation. Only structure.