# Phase 0 — Discovery & Baseline (Execution)

## Environment baseline
- Node.js: v22.21.1
- Repo root: `/workspace/engine`

## Current build/test status (spot check)
- `npm run test-core` (uses `scripts/test.js` against core specs)
  - Result: **pass** (3431 assertions, 0 failures)
  - Warnings: `npm warn Unknown env config "http-proxy"`

> Note: Legacy test scripts depend on Browserify/Smokestack and browser harnesses for non-core modules. Those were not executed as part of this spot check and will be addressed during Phase 1 test modernization.

## Public API surface (current)
### Top-level exports (`index.js`)
The package exports the following namespaces:
- `components`
- `core`
- `renderLoops`
- `domRenderables`
- `domRenderers`
- `math`
- `physics`
- `renderers`
- `transitions`
- `utilities`
- `webglRenderables`
- `webglRenderers`
- `webglGeometries`
- `webglMaterials`
- `webglShaders`
- `polyfills`

### Documented usage (README)
- `famous/core/FamousEngine`
- `famous/dom-renderables/DOMElement`

These indicate consumers rely on deep import paths; compatibility considerations will be required when introducing export maps.

## Browser globals usage (sample inventory)
The following modules access browser globals or DOM APIs and will require careful handling during modernization:
- `polyfills/animationFrame.js` uses `window` and vendor-prefixed rAF/cAF.
- `core/FamousEngine.js` requires `window` for initialization.
- `renderers/Compositor.js`, `renderers/Context.js`, `renderers/inject-css.js` interact with `window`/`document` and attach DOM nodes.
- `dom-renderers/DOMRenderer.js` uses `document`, `document.body`, and event path handling.
- `webgl-renderers/Debug.js`, `webgl-renderers/createCheckerboard.js` create DOM elements.
- Tests in `renderers/`, `dom-renderers/`, and `webgl-renderers/` use DOM globals.

## Compatibility matrix (initial draft)
| Area | Current state | Modern target | Notes |
| --- | --- | --- | --- |
| Node/tooling | Node 0.x-era deps (browserify/uglify/tape) | Node 20+ | Tooling upgrade required. |
| Browsers | Legacy rAF and vendor prefixes | Evergreen browsers (current - 2) | Remove obsolete prefixes, add modern APIs. |
| Module formats | CommonJS only | ESM + CJS | Export map + compatibility for deep imports. |
| Types | None | Typed JSDoc | Add tsconfig + JSDoc. |

## Risk register (initial)
1. **Legacy browser harnesses**: Smokestack/Firefox flow may not run on modern CI.
2. **Deep import consumers**: README shows `famous/<module>` usage; export map must preserve or alias.
3. **DOM/WebGL globals**: direct `window/document` usage may complicate SSR or non-browser environments.
4. **Vendor-prefixed paths**: rAF/DOM vendor prefixes may need cleanup without breaking behavior.

## Phase 0 completion criteria
- [x] API surface inventory
- [x] Test baseline (core)
- [x] Browser globals inventory (sample)
- [x] Risks identified
- [ ] Demo validation (target for Phase 1 once Vite dev server is introduced)
