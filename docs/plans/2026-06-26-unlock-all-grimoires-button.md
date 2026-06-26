# Unlock All Grimoires Button

## Contract

- Flow mode: one-shot execution.
- Outcome: a `-` button unlocks every grimoire at once.
- Completion threshold: focused progression test passes, typecheck/build passes, and the HUD dispatches the tested action.
- Constraints: do not spend mana/resources; keep unrelated dirty workspace changes alone.
- Blocked condition: stop only if the existing HUD/state architecture cannot expose the action without changing unrelated systems.

## Checklist

- [x] Add a failing behavior test for unlocking all books without spending resources.
- [x] Implement the simulation action.
- [x] Wire a small `-` HUD button to the action.
- [x] Run focused test and full build/type verification.

## Evidence

- `node -e "import('esbuild').then((esbuild) => esbuild.build({ entryPoints: ['tests/bookProgression.test.ts'], bundle: true, platform: 'node', format: 'esm', outfile: '/tmp/library-magic-bookProgression.mjs' }))" && node /tmp/library-magic-bookProgression.mjs` passed with `bookProgression ok`.
- `npm run build` passed with `tsc && vite build`.
- `curl -I http://127.0.0.1:5179/` returned `HTTP/1.1 200 OK`.
- Automated browser verification was not run because `browser-use` is not exposed in this session and project rules forbid substituting Playwright/Puppeteer.
