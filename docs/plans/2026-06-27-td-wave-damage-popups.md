# TD Wave Display And Damage Popups

Objective:
Update TD wave display and damage popups; done when wave scroll replaces monster count, hit popups color normal/crit/super crit, tests/build/browser proof pass.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-td-wave-damage-popups.md

Primary template:
focused task

Applied packs:
- browser

Completion threshold:
- TD mini stats no longer show the raw monster count.
- TD shows a scrolling wave rail inspired by the supplied video.
- TD hit popups appear at impact positions with white normal damage, yellow critical damage, and orange super critical damage.
- Focused TD tests, typecheck, full tests, build, diff check, and browser proof pass.

Verification surface:
- Focused TD rule tests.
- Source audit of TD state/actions/UI/CSS.
- Browser proof on local Vite app.
- `npm run typecheck`, `npm test`, `npm run build`, `git diff --check`.

Constraints:
- Keep the square TD panel and current Tiled background.
- Do not rework the tower, enemies, or skills beyond what the UI effect needs.
- Preserve unrelated dirty workspace changes.

Boundaries:
- `src/game/simulation/state.ts`
- `src/game/simulation/actions.ts`
- `src/ui/hud.ts`
- `src/style.css`
- `tests/defenseRules.test.ts`

Output budget strategy:
- Use focused `sed`/`rg` reads and screenshots only.
- Keep video inspection to extracted frames/contact sheets under `/tmp`.

Blocked condition:
- Stop only if the local app cannot be launched or inspected after code checks pass.

Start Gates:
| Gate | Applies | Evidence |
| --- | --- | --- |
| User requirements captured | yes | Wave scrolling display replaces monster count; damage popups white/yellow/orange for normal/critical/super critical |
| Reference inspected | yes | Extracted `/Users/zbeyens/Downloads/WhatsApp Video 2026-06-27 at 01.10.57.mp4` frames to `/tmp/td-wave-video/contact.png` |
| Skills read | yes | `autogoal` and repo `tdd` instructions read |

Work Checklist:
- [x] Add hit result type/test coverage for normal, critical, and super critical damage metadata.
- [x] Record TD damage popups in simulation state with position, amount, and kind.
- [x] Replace enemy count mini stat with scrolling wave rail.
- [x] Render and style damage popups with requested colors.
- [x] Verify locally with tests, build, and browser proof.

Completion Gates:
| Gate | Applies | Required action | Evidence |
| --- | --- | --- | --- |
| Tests | yes | Run focused and full checks | `./node_modules/.bin/tsx tests/defenseRules.test.ts`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed |
| Browser | yes | Inspect TD panel in browser | Chrome proof on `http://127.0.0.1:5173`: rail count 1, enemy counter count 0, popup count 3, normal popup color `rgb(255, 255, 255)`, font size `30.5989px`, critical/super critical CSS rules present |
| Goal plan complete | yes | Update checklist/evidence and pass checker | `check-complete.mjs docs/plans/2026-06-27-td-wave-damage-popups.md` passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
| --- | --- | --- | --- |
| Reference read | complete | Video contact sheet inspected | Implement |
| Implementation | complete | State/action/UI/CSS changes added | Verify |
| Verification | complete | Tests/build/browser proof passed | Close goal |

Findings:
- The reference has a top wave rail with numbered markers and large colored damage text over the battlefield.

Timeline:
- Plan created after goal creation.
- Added TD hit result metadata and damage popup state.
- Replaced enemy count mini stat with a wave rail.
- Removed TD arena floating reward popup so damage popups are not confused with `+1` sceaux.
- Fixed CSS specificity so damage popup colors override the generic `.book-overlay span` rule.

Decisions and tradeoffs:
- Normal/critical/super critical kind is computed in simulation, then rendered by CSS. That keeps hit math and visual feedback synced.
- Damage popups use the enemy lane/distance at impact so they appear on the battlefield, including ricochets.
- The existing top `W` stat remains as a compact current-wave readout; the raw monster count is removed.
- TD reward floating gain was removed from the arena because it visually competed with requested damage popups.

Review fixes:
- Browser proof showed `.book-overlay span` overriding popup font/color; accepted and fixed with `.book-overlay .defense-damage-popup` specificity.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
| --- | --- | --- | --- |

Verification evidence:
- `./node_modules/.bin/tsx tests/defenseRules.test.ts` passed.
- `npm run typecheck` passed.
- `npm test` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Browser proof screenshot: `/tmp/library-magic-td-wave-damage-proof-final.png`.
- Browser DOM proof: `.defense-wave` present, `[data-dynamic-value="defense-enemy-count"]` absent, `.defense-damage-popup` present, normal popup computed color white, crit/super crit CSS rules present.
- `check-complete.mjs docs/plans/2026-06-27-td-wave-damage-popups.md` passed.

Reboot status:
| Where am I? | Where am I going? | What is the goal? | What learned? | What done? |
| --- | --- | --- | --- | --- |
| Completed implementation | Close goal | Match requested TD wave/damage feedback | Browser proof confirms rail/counter/popup behavior | Tests/build/browser proof complete |

Open risks:
- Existing workspace has unrelated dirty files, so repository-wide dirty status is not only this task.
