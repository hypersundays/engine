# Phase 2 — Packaging & Module System (Execution)

## Goals covered
- Provide ESM + CJS entry points via export maps.
- Preserve compatibility for deep import paths used by existing consumers.
- Publish a baseline types entry to be expanded during typed JSDoc work.

## Changes delivered
### Package entry points
- Added `exports` map with ESM (`dist/famous.mjs`) and CJS (`dist/famous.cjs`) entries for the root export.
- Added explicit deep import paths for existing module folders (e.g. `./core/*`, `./dom-renderables/*`).
- Updated `main` and `module` fields to reference the new dist outputs.

### Types
- Added a baseline `types/index.d.ts` for the top-level namespace exports.
- Added `types` and `typesVersions` in `package.json` to publish the baseline type entry.

## Follow-ups needed
- Replace the `any` placeholders in `types/index.d.ts` with typed JSDoc output in Phase 3.
- Decide on a `sideEffects` map once module side effects are audited.
- Confirm the Vite build output matches the export map before publishing.
