adanbrowser/
├── .github/
│   ├── agents/scaffold.agent.md
│   ├── copilot-instructions.md
│   ├── plan_initial.md
│   └── prompts/feature.prompt.md
├── docs/
│   ├── MESSAGE_FLOW.md
│   ├── MV3_ARCHITECTURE.md
│   ├── PERMISSIONS_MATRIX.md
│   ├── PRODUCT_SCOPE.md
│   └── PROJECT_ROADMAP.md
├── extension/
│   ├── public/manifest.json          ← MV3 skeleton
│   └── src/
│       ├── background/index.ts
│       ├── content/index.ts
│       ├── popup/{index.html,popup.ts}
│       ├── options/{index.html,options.ts}
│       ├── lib/.gitkeep
│       ├── shared/.gitkeep
│       ├── domain/.gitkeep
│       ├── application/.gitkeep
│       └── infrastructure/.gitkeep
├── scripts/{dev,build,test}          ← chmod +x ✓
├── .gitignore
├── eslint.config.js
├── package.json
├── prettier.config.js
├── tsconfig.json
└── vite.config.ts