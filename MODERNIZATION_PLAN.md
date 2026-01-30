# Famous Engine Modernization Plan (2026)

## Goals

- Deliver a modern, maintainable build and test toolchain.
- Preserve public API behavior where feasible.
- Improve browser compatibility for modern platforms (evergreen browsers).
- Establish a type-safe, documented API surface (typed JSDoc or full TypeScript).
- Enable long-term sustainability with modern dependencies and CI.

## Assumptions

- Target browsers: Chrome/Edge/Firefox/Safari current - 2.
- Node.js LTS: 20+ for tooling and CI.
- Library output: ESM + CJS packages with tree-shaking support.
- Minimal breaking changes unless explicitly approved.

## Phase 0 — Discovery & Baseline (1–2 weeks)

### Deliverables

- Verified current build/test status on modern Node.
- Catalog of public API surface (exports + usage in README/examples).
- Compatibility matrix (browser/runtime support).
- Risk register (legacy APIs, deprecated usage, security concerns).

### Tasks

- Inventory entry points and exports in `index.js` and package metadata.
- Identify browser globals usage in core/renderer modules.
- Run existing tests and document failures, especially smokestack/Firefox flow.
- Sample a subset of real-world demos (if any) to confirm runtime behavior.
- Create a Vite demo scaffold (physics + animation) as the baseline regression target.

### Risks

- Tests rely on old browser harnesses and may not run on modern CI.
- Legacy bundle pipeline may fail on modern Node without patches.

---

## Phase 1 — Build System & Tooling Modernization (2–4 weeks)

### Goals

- Replace Browserify/Uglify/Tape/Smokestack pipeline.
- Establish reproducible build outputs and CI workflows.

### Tasks

- Replace bundler with `vite` (library mode for ESM/CJS builds and dev server for demos/examples).
- Migrate test runner:
  - Unit tests to `vitest`.
  - DOM/WebGL tests to `playwright` or `@vitest/browser`.
- Add lint/format:
  - `eslint@^9`, `prettier`, `eslint-config-prettier`.
- Establish CI workflows (GitHub Actions):
  - Lint, test, build, typecheck.

### Packages to Replace

- Remove: `browserify`, `uglify-js`, `tape`, `smokestack`, `tap-closer`, `tap-spec`.
- Add: `vite`, `vitest`, `playwright`, `eslint`, `prettier`.

### Risks & Mitigations

- Test API differences: migrate to `vitest` incrementally by module.
- DOM/WebGL tests need headless browser or browser-runner.

---

## Phase 2 — Packaging & Module System (2–3 weeks)

### Goals

- Produce ESM + CJS builds with export maps.
- Maintain backwards compatibility for old CJS consumers.

### Tasks

- Add `exports` map in `package.json` with `import` and `require`.
- Publish `types` and `typesVersions` entries.
- Ensure tree-shaking: mark `sideEffects` accurately.
- Add build outputs to `dist/` as ESM + CJS.

### Risks & Mitigations

- Consumers that rely on deep import paths may break; add compatibility alias map if needed.

---

## Phase 3 — Type Strategy (3–6 weeks, parallelizable)

### Option A — Typed JSDoc First (recommended baseline)

- Add `tsconfig.json` with `allowJs`, `checkJs`, `declaration`.
- Add `// @ts-check` for public-facing modules.
- Add JSDoc types for public API entry points.

### Option B — Full TypeScript Migration

- Convert in order: math/utilities → physics → core → renderers → components.
- Add `.d.ts` outputs and replace runtime `require` with `import`.

### Type Coverage Milestone Targets

- 25%: core + math + utilities.
- 50%: add physics + transitions.
- 75%: add core renderers + DOM renderers.
- 100%: all modules + public API types.

---

## Phase 4 — DOM Rendering & Events (2–5 weeks)

### Goals

- Modernize event handling and DOM mutation safety.
- Remove legacy vendor-prefix logic.

### Tasks

- Replace `ev.path` usage with `event.composedPath()` fallback.
- Implement Pointer Events with unified mouse/touch code paths.
- Introduce safe content APIs (avoid `innerHTML` where possible).
- Evaluate CSS transform path; remove vendor prefixes.

### Risks

- Behavioral changes to event handling; requires integration tests.

---

## Phase 5 — WebGL Modernization (3–6 weeks)

### Goals

- Add WebGL2 support and degrade gracefully to WebGL1.
- Modernize shader pipeline.

### Tasks

- Add WebGL2 context path with capability detection.
- Upgrade shader pipeline:
  - Use `vite-plugin-glsl` (or equivalent) for GLSL imports.
  - If keeping `glslify`, update to a modern version and wire via Vite plugin hooks.
- Consolidate GL state changes and reduce redundant binds.

### Risks

- Rendering regressions, texture/attribute binding differences.

---

## Phase 6 — Core Engine Loop & Architecture (2–4 weeks)

### Goals

- Improve scheduling reliability and clarity.
- Reduce global state and hidden coupling.

### Tasks

- Isolate render loop in a single scheduler module.
- Add page visibility handling (`visibilitychange`).
- Refactor command queue structures into typed objects.

---

## Phase 7 — Utilities & Polyfills Cleanup (1–2 weeks)

### Tasks

- Replace XHR with `fetch` and add abort support.
- Remove obsolete polyfills (e.g., vendor-prefixed rAF).
- Standardize URL handling and asset loading.

---

## Phase 8 — Optional Physics & Math Refactor (3–6+ weeks)

### Options

- Upgrade internal physics math to typed arrays.
- Replace with maintained physics library (if acceptable).

### Risks

- High risk of regressions; depends on compatibility requirements.

---

## Dependency Upgrade Checklist (Concrete)

### Build & Dev

- `browserify` → `vite` (library mode builds)
- `uglify-js` → `esbuild` or `terser`
- `eslint@0.x` → `eslint@^9`
- Add `prettier`
- Add `typescript`

### Testing

- `tape` → `vitest`
- `smokestack` → `playwright` or `@vitest/browser`
- `tap-*` packages → removed

### WebGL

- `glslify@^2` → update or replace with `vite-plugin-glsl`

---

## Milestone Timeline Summary

| Phase | Duration | Core Outputs |
|------|----------|--------------|
| 0 | 1–2 weeks | Baseline tests + API inventory |
| 1 | 2–4 weeks | Modern build/test/CI |
| 2 | 2–3 weeks | ESM/CJS packaging |
| 3 | 3–6 weeks | Typed JSDoc or TS migration |
| 4 | 2–5 weeks | DOM/events modernization |
| 5 | 3–6 weeks | WebGL2 support + shader updates |
| 6 | 2–4 weeks | Engine loop refactor |
| 7 | 1–2 weeks | Utilities + polyfill cleanup |
| 8 | 3–6+ weeks | Physics/math improvements |

---

## Acceptance Criteria

- Builds succeed on Node 20+ with ESM/CJS outputs.
- Tests pass on modern CI in headless browser.
- Public API has generated types.
- Rendering and input behavior match legacy output within agreed tolerances.

---

## Validation Demos To Create

- Expand demo with draggable physics object (Pointer Events) to validate input + physics integration.
- Add a simple WebGL mesh scene to validate WebGL pipeline during upgrades.
- Add a scene graph stress test (multiple nodes + transitions) for performance baseline.

## Optional Follow-ups

- Add examples gallery with modern bundler.
- Write migration guide for downstream users.
- Benchmark performance before/after modernization.
