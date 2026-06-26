# fix td tile animations

Objective:
Fix TD tile animations; done when only intended campfire tiles animate continuously and checks/browser proof pass; plan docs/plans/2026-06-26-fix-td-tile-animations.md.

Goal plan:
docs/plans/2026-06-26-fix-td-tile-animations.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser

Completion threshold:
- Only `Campfire A` tiles animate in the Bastion Tiled terrain.
- `Flag A` tiles remain static.
- Campfire animation advances frame over time and uses clock-based negative delay so HUD rerenders do not restart it at frame 0.
- `npm run typecheck`, `npm run build`, `git diff --check`, and browser proof pass.

Verification surface:
- Source audit of Tiled map tilesets and provided screen recording frames.
- `npm run typecheck`.
- `npm run build`.
- `git diff --check`.
- Browser proof on Bastion overlay.

Constraints:
- Preserve gameplay and square Tiled map layout.
- Do not animate tower in this slice.
- Do not touch unrelated mini-games.

Boundaries:
- Source of truth: `Map TD .tmj`, tileset frame sheets, and provided screen recording.
- Allowed edit scope: `src/game/content/tdTiledMap.ts`, `src/style.css`, this plan.
- Browser surface: Bastion Arcanique panel.
- Tracker sync: N/A.
- Non-goals: no gameplay redesign, no tower animation in this slice.

Blocked condition:
- Stop if browser proof cannot distinguish intended campfire animation from wrong flag animation.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User said wrong tiles were selected and animation does not run continuously. |
| Timed checkpoint parsed | yes | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned none; created this goal. |
| Source of truth read before edits | yes | Extracted screen-recording frames and inspected TD tileset sources. |
| Acceptance criteria captured | yes | Campfire-only continuous animation, static flags, checks/proof pass. |
| Pre-solution issue challenge required | yes | User reported a visual bug in previous implementation. |
| Reproduction verdict before implementation | yes | Valid: frames show expected static flags and animated campfire; code animated flags. |
| Repro escalation ladder selected | yes | Source audit plus browser proof. |
| Suggested fix reviewed against durable boundary | yes | Tiled renderer owns tile animation mapping. |
| TDD decision before behavior change or bug fix | yes | N/A: visual animation needs browser proof, not fake unit test. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Applied browser pack. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Bastion overlay. |
| Browser tool decision recorded | yes | Used browser automation fallback. |

Work Checklist:
- [x] First checkpoint complete: explicit requirement is to fix wrong animated tiles and non-continuous animation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Duration recorded as N/A.
- [x] Task source and acceptance criteria are captured.
- [x] Reporter claim challenged and reproduced.
- [x] Repro escalation ladder followed: video frames, source audit, browser proof.
- [x] Hard-stop rule followed: valid bug, code changed.
- [x] Nearby implementation patterns read before edits.
- [x] Implementation fixes the renderer ownership boundary.
- [x] Autoreview target selected from actual diff: `tdTiledMap.ts` and `style.css`.
- [x] Verification evidence recorded beside each gate.
- [x] Browser pack route, interaction path, and expected visible outcome recorded.
- [x] Browser proof used available browser automation.
- [x] Console/network errors checked; no relevant bad responses.
- [x] Browser proof uses real Bastion surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Checks and browser proof passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid: wrong tile animation reproduced from prior implementation. |
| Repro escalation ladder | yes | Record source/browser proof | Screen-recording frames, source audit, browser proof. |
| Bug reproduced before fix | yes | Record failing behavior | Previous code animated `Flag A` broadly and used smoke/fire image alternation. |
| Targeted behavior verification | yes | Run focused proof | Browser proof: 4 campfire animated tiles, 0 animated flags, frame changed `3,3,3,3` to `5,5,5,5`. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed with existing chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-td-campfire-animation-fixed.png`. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `git diff --check` passed; no lint script exists. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed: flags static, campfire horizontal sheet animation, clock-based delay. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed; otherwise N/A | N/A: no duration requested. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened Bastion and checked animated tile selectors. |
| Browser console/network check | yes | Record console/network state or N/A | No relevant bad responses. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-td-campfire-animation-fixed.png`. |
| Goal plan complete | yes | Run checker | `check-complete.mjs` passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | screen recording and tilesets inspected | implementation |
| Implementation | complete | campfire-only animation and clock phase added | verification |
| Verification | complete | checks/build/browser proof passed | closeout |
| Closeout | complete | `check-complete.mjs` passed | final response |

Findings:
- Correct expected behavior from recording: bottom flags are static; campfire flame animates.
- `Campfire A` is a 12-column by 2-row sheet representing six 2x2 campfire frames horizontally.
- Animation reset risk came from HUD rerenders; delay is now computed from wall-clock phase.

Decisions and tradeoffs:
- Removed `Flag A` animation because those are static map tiles in the recording.
- Changed campfire animation from swapping smoke/fire PNGs to stepping horizontally through `Campfire A/2.png`.
- Used clock-based negative animation delay to keep frame phase continuous across DOM rerenders.

Review fixes:
- Replaced broad tileset-name animation with campfire-only frame stepping.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Animated `Flag A` and alternated campfire smoke/fire images | 1 | Use video evidence and actual campfire sheet geometry | Fixed |

Timeline:
- 2026-06-26T08:51:59.281Z: plan created.
- 2026-06-26: extracted video frames and identified expected static flags plus animated campfire.
- 2026-06-26: corrected animation mapping and verified in browser.

Verification evidence:
- `npm run typecheck` passed.
- `git diff --check` passed.
- Browser proof on `http://127.0.0.1:5173/`: 4 campfire animated tiles, 0 animated flags, 16 static flag tiles, campfire visible frames changed from `3,3,3,3` to `5,5,5,5`.
- `npm run build` passed.
- Screenshot: `/tmp/library-magic-td-campfire-animation-fixed.png`.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-fix-td-tile-animations.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final checker and response |
| What is the goal? | Fix wrong TD tile animations |
| What have I learned? | Only campfire should animate; flags stay static |
| What have I done? | Corrected renderer, verified checks/browser |

Open risks:
- Other future animated tiles will need explicit mapping if Tiled export still omits `<animation>` metadata.
