# Phase 1 — Build System & Tooling Modernization (Execution)

## Goals covered
- Replace Browserify/Uglify/Tape/Smokestack pipeline with modern tooling.
- Establish reproducible build outputs and tooling configs.
- Add lint/format baselines.

## Changes delivered
### Build
- Added Vite library build config (`vite.config.js`) targeting ESM + CJS outputs.
- Updated `package.json` build scripts to use Vite.

### Tests
- Added Vitest config (`vitest.config.js`) and scripts for unit tests.
- Added Playwright config (`playwright.config.js`) and script for browser tests.
- Legacy tape/smokestack scripts removed in favor of the modern toolchain.

### Lint/format
- Added ESLint v9 flat config (`eslint.config.js`).
- Added Prettier configuration (`.prettierrc.json`).

### CI
- Added GitHub Actions workflow (`.github/workflows/ci.yml`) for lint, format, unit tests, and build.

### Dependencies
- Added: `vite`, `vitest`, `@playwright/test`, `eslint`, `eslint-config-prettier`, `prettier`, `@eslint/js`.
- Removed: `browserify`, `uglify-js`, `tape`, `smokestack`, `tap-*` packages, legacy eslint.

## Follow-ups needed
- Migrate existing Tape specs to Vitest (module-by-module).
- Stand up Playwright/Vitest browser tests for DOM/WebGL suites.
