# td raster background animated overlays

Objective:
Reduce occasional TD FPS drops by optimizing Tiled tile rendering.

Goal plan:
docs/plans/2026-06-26-td-raster-background-animated-overlays.md

Task source:
- type: user request
- id / link: chat
- title: Polish TD lag spikes from 70 fps to 50 fps
- acceptance criteria:
  - Static Tiled terrain no longer renders hundreds of DOM tiles/images.
  - Animated background tiles still animate.
  - The Tiled map remains visually faithful.
  - Browser proof shows stable frame timing.
  - Typecheck, build, and diff check pass.

Completion threshold:
Done when tile DOM/image count drops sharply, animations still run, visual proof is acceptable, and browser FPS proof improves or remains stable.

Verification surface:
- Chrome measurement of FPS, worst frame, DOM nodes, Tiled tile/image/frame counts, and animation progress.
- Screenshot proof of Bastion Arcanique panel.
- `npm run typecheck`
- `npm run build`
- `git diff --check`

Constraints:
- Preserve the user's Tiled map as the visual source of truth.
- Do not remove background animation.
- Do not rewrite unrelated mini-games.
- Ignore unrelated dirty workspace diffs.

Boundaries:
- Source of truth: TD Tiled renderer and TD Tiled CSS.
- Allowed edit scope: `src/game/content/tdTiledMap.ts`, `src/style.css`, this plan file.
- Browser surface: Bastion Arcanique panel.
- Tracker sync: none requested.

Blocked condition:
Blocked only if the TD panel cannot load in the local browser, the Tiled raster file cannot be served, or animation proof cannot be observed after three consecutive attempts.

Current verdict:
- verdict: complete
- confidence: 95/100
- next owner: task
- reason: Tiled render cost dropped from 890 tile elements and 1030 image elements to 28 animated tile elements and 0 tile images.

Pre-solution issue challenge:
- reporter claim: TD has occasional lag spikes, often dropping from 70 to 50 fps.
- suggested diagnosis or fix: client-side rendering cost is still too high because Tiled terrain creates too many tile/image nodes.
- repro ladder:
  - source-level repro: inspected `tdTiledMap.ts` and `.defense-tiled-*` CSS.
  - browser proof: measured Bastion Arcanique in Chrome.
  - screenshot proof: `/tmp/library-magic-td-final-optimized.png`.
- reproduction verdict: valid risk; headless Chrome did not reproduce 50 fps drops, but baseline DOM cost was objectively too high.
- best long-term fix boundary: rasterize static Tiled terrain and overlay only animated tiles.
- hard-stop decision: proceed.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-td-raster-background-animated-overlays.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | polish occasional TD FPS drops |
| Active goal checked or created | yes | goal created |
| Source of truth read before edits | yes | `tdTiledMap.ts`, `.defense-tiled-*` CSS |
| Acceptance criteria captured | yes | see task source |
| Pre-solution issue challenge required | yes | perf regression report |
| Repro escalation ladder selected | yes | Chrome measurement plus visual proof |
| TDD decision before behavior change or bug fix | yes | browser perf/visual proof is the meaningful regression loop |
| Browser proof decision for browser surface | yes | required and completed |

Work Checklist:
- [x] Prompt requirements captured.
- [x] Baseline browser metrics captured.
- [x] Static Tiled terrain moved to one raster background.
- [x] Static tile DOM rendering removed.
- [x] Animated tiles preserved as overlays.
- [x] Animated overlays reduced to one element per animated tile.
- [x] Browser proof captured after final optimization.
- [x] Visual screenshot reviewed.
- [x] Verification commands run.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run browser measurement and checks | passed |
| Pre-solution issue challenge verdict | yes | Record verdict | valid perf risk |
| Targeted behavior verification | yes | Browser proof | final metrics captured |
| TypeScript or typed config changed | yes | Run typecheck | passed |
| Build-sensitive behavior changed | yes | Run build | passed |
| Browser surface changed | yes | Capture screenshot proof | `/tmp/library-magic-td-final-optimized.png` |
| Final lint/format | yes | Run diff check | passed |
| Goal plan complete | yes | Run checker | first run identified plan wording gaps; final run passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | TD renderer/CSS inspected | implementation |
| Implementation | complete | raster background plus animated overlays | verification |
| Verification | complete | commands and browser proof passed | closeout |
| Closeout | complete | checker wording gaps fixed and final checker passed | final response |

Findings:
- Baseline before this optimization: `totalNodes: 2070`, `tiledTiles: 890`, `tiledImages: 1030`, `tiledFrames: 1030`, `animatedTiles: 28`, `fps: 119.8`, `worstFrameMs: 17.6`, `framesOver20ms: 0`.
- First per-tile CSS background attempt reduced image nodes but broke the map visually. It was discarded.
- Final approach uses `/assets/td/tiled/reference/bastion.png` as the static map background.
- Only animated Tiled cells are kept as DOM overlays.
- Animated overlays now use one spritesheet element per animated tile instead of one element per animation frame.

Decisions and tradeoffs:
- Prefer one faithful raster of the Tiled map over hundreds of individual static tile nodes.
- Preserve animated objects by overlaying only animated tiles above the raster.
- Animate spritesheet position on a single element instead of toggling opacity across multiple frame elements.

Verification evidence:
- Intermediate raster overlay proof: `totalNodes: 348`, `tiledTiles: 28`, `tiledImages: 0`, `tiledFrames: 168`, `animatedTiles: 28`, `backgroundAnimationAdvanced: true`, `fps: 120`, `worstFrameMs: 9.3`.
- Final Chrome proof: `totalNodes: 207`, `tiledTiles: 28`, `tiledImages: 0`, `tiledFrames: 28`, `animatedTiles: 28`, `backgroundAnimationAdvanced: true`, `fps: 120.1`, `worstFrameMs: 9.4`, `framesOver16_8ms: 0`, `framesOver20ms: 0`.
- Screenshot: `/tmp/library-magic-td-final-optimized.png`.
- `npm run typecheck` passed.
- `npm run build` passed with only the existing large-chunk Vite warning.
- `git diff --check` passed.
- `npm test -- --run tests/defenseRules.test.ts` could not run because this repo has no `test` script.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-td-raster-background-animated-overlays.md` passed after plan wording cleanup.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run autogoal checker and final response |
| What is the goal? | Reduce TD lag spikes caused by tile rendering cost |
| What have I learned? | Static tile DOM/images were the remaining heavy render surface |
| What have I done? | Replaced static tile DOM with a raster background and kept only animated overlays |

Open risks:
- Headless Chrome stayed at 120 fps before and after, so it did not reproduce the user's 50 fps drops directly.
- The local visible browser should still feel smoother because the terrain now renders 0 tile images and only 28 animated frame elements.
