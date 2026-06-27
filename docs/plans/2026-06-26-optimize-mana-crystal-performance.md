# optimize mana crystal performance

Objective:
Optimize mana crystal performance; done when browser perf proof shows lower frame cost with wands and checks pass; plan docs/plans/2026-06-26-optimize-mana-crystal-performance.md.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-26-optimize-mana-crystal-performance.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: chat, 2026-06-27
- title: Peaufiner le jeu du cristal qui perd environ 20 FPS, surtout avec les baguettes.
- acceptance criteria: Opening/using the Grimoire de Mana keeps the crystal interaction responsive; the baguette-heavy case has reduced frame cost; no unrelated mini-game behavior changes.

Completion threshold:
- A browser-run perf harness records the mana panel with max mana skills/10 baguettes before and after the fix, and the after sample has lower average frame time than the before sample.
- `npm run typecheck`, `npm run test`, and `npm run build` pass.

Verification surface:
- Browser proof on the local Vite app: open the Grimoire de Mana, max mana skills, sample `requestAnimationFrame` timing while the crystal and baguettes are visible/active.
- Source audit around `src/ui/hud.ts`, `src/style.css`, and mana simulation helpers in `src/game/simulation/actions.ts`.
- Commands: `npm run typecheck`, `npm run test`, `npm run build`, `git diff --check`.

Constraints:
- Preserve behavior outside scope.
- Preserve mana economy and upgrade behavior.
- Do not create PRs, commits, pushes, or external comments unless requested.
- Do not revert unrelated dirty workspace changes.

Boundaries:
- Source of truth: `CONTEXT.md`, `src/ui/hud.ts`, `src/style.css`, mana helpers in `src/game/simulation/actions.ts`.
- Allowed edit scope: mana crystal rendering/effects, wand transient effect scheduling, focused perf proof, and this plan.
- Browser surface: local Vite app on the Grimoire de Mana book page.
- Tracker sync: N/A: user asked for local implementation, not issue/PR sync.
- Non-goals: no whole-game redesign, no new crystal assets, no gameplay economy changes.

Output budget strategy:
- Use focused `rg`/`sed` reads only.
- Avoid printing generated asset trees and large diffs.
- Record browser metrics as compact JSON summaries.

Blocked condition:
- Stop only if the app cannot run locally and no browser/frame-timing measurement can be captured after trying the available repo-approved browser path and fallback.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User asked to polish crystal game perf: opening/using it loses about 20 FPS, worse with baguettes |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` created active goal |
| Source of truth read before edits | yes | Read `CONTEXT.md`; focused reads in `src/ui/hud.ts`, `src/style.css`, and mana simulation matches |
| Acceptance criteria captured | yes | Task source section records perf and no unrelated behavior changes |
| Pre-solution issue challenge required | yes | Bug/perf claim; recorded claim, source hypothesis, and repro ladder |
| Reproduction verdict before implementation | yes | Baseline browser proof: 10 baguettes maxed, idle `48.06 FPS`, `avg 20.808 ms`, `p95 25.8 ms`, `max 276.5 ms` |
| Repro escalation ladder selected | yes | Browser frame-timing harness selected; source tests N/A for compositor FPS |
| Suggested fix reviewed against durable boundary | yes | Fix boundary is mana panel rendering/effects, not economy callers |
| TDD decision before behavior change or bug fix | yes | N/A for CSS/browser compositor perf; use browser timing plus existing tests |
| Browser proof decision for browser surface | yes | Required because affected surface is browser UI |
| Browser pack selected | yes | Applied browser pack |
| Browser route / app surface identified | yes | Local Vite app, Grimoire de Mana panel |
| Browser tool decision recorded | yes | `tool_search browser-use` did not expose a browser-use callable; used Playwright with system Chrome as fallback |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; when no better metric exists, initial and final confidence scores are recorded. N/A: no duration requested.
- [x] Task source and acceptance criteria are captured.
- [x] Reporter claim challenged before implementation with verdict: valid performance bug candidate after browser baseline.
- [x] Repro escalation ladder followed: source tests N/A for compositor FPS, browser-use unavailable, Chrome automation measured the affected browser surface.
- [x] Hard-stop rule followed: issue reproduced before implementation, so code changes were allowed.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary: mana panel effects and wand transient animation restart.
- [x] Review/autoreview target selected from actual diff state: `src/ui/hud.ts`, `src/style.css`, this plan.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Browser before/after proof improved idle from `48.06 FPS` to `59.38 FPS`; typecheck/test/build pass |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid perf claim; source and browser baseline reproduced a low-FPS max-wand mana panel |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source tests N/A for compositor FPS; browser-use unavailable; Chrome automation measured affected surface |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Baseline: 10 baguettes maxed, idle `48.06 FPS`, `avg 20.808 ms`, `max 276.5 ms` |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | After fix: 10 baguettes maxed, idle `59.38 FPS`, clicking `59.63 FPS`, no console/page errors beyond normal Vite/Phaser logs |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; Vite chunk-size warning remains informational |
| Browser surface changed | yes | Capture browser proof | Chrome automation against `http://127.0.0.1:5175/`, Grimoire de Mana, max mana skills |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in `package.json`; `git diff --check` passed for touched files |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed: removes reflow and expensive animated filters; preserves mana gain and wand visuals |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened mana book via canvas coordinate `(193,213)`, pressed debug `I`, measured visible `.mana-orb` with 10 `.magic-wand` nodes |
| Browser console/network check | yes | Record console/network state or N/A | No page errors; console only Vite connection and Phaser banner |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Numeric RAF proof recorded in Verification evidence; screenshot not needed for FPS symptom |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-optimize-mana-crystal-performance.md` | Passed after closeout row update |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read `CONTEXT.md`, `src/ui/hud.ts`, `src/style.css`, and mana helpers | implementation |
| Implementation | complete | Removed forced reflows; replaced filter-heavy animations; reduced spark count | verification |
| Verification | complete | Browser before/after proof plus typecheck/test/build | closeout |
| Closeout | complete | Goal checker first run flagged only closeout status; fixed and rerun | final response |

Findings:
- The mana panel had several permanent expensive effects: animated large-orb transform, spinning conic/blur halo, drop-shadow filters on the large sprite, and filter brightness changes.
- `showCrystalClickEffect` and `showWandCastEffect` forced synchronous layout with `offsetWidth` to restart animations.
- Auto-cast with max skills triggers wand effects every 0.5s over 10 wand nodes, so filter/reflow costs line up with the user's "worse with baguettes" report.
- Browser baseline before fix: idle `48.06 FPS`, `avg 20.808 ms`, `p95 25.8 ms`, `max 276.5 ms`.
- Browser proof after fix: idle `59.38 FPS`, `avg 16.841 ms`, `p95 25.1 ms`, `max 26.7 ms`; clicking sample `59.63 FPS`, `avg 16.771 ms`, `max 26.3 ms`.

Timeline:
- 2026-06-26T23:33:53.567Z: plan created.
- 2026-06-27: active goal created.
- 2026-06-27: baseline browser proof captured on local Vite app with max mana skills and 10 wands.
- 2026-06-27: implemented mana-panel perf patch in `src/ui/hud.ts` and `src/style.css`.
- 2026-06-27: after browser proof captured on the same scenario.
- 2026-06-27: `npm run typecheck`, `npm run test`, `npm run build`, and `git diff --check` passed.
- 2026-06-27: first goal checker run flagged only `Closeout=in_progress`; plan updated; final checker passed.

Decisions and tradeoffs:
- Keep the Spriterrific crystal sprite animation, but slow it and remove costly CSS `drop-shadow` filters around it.
- Keep wand feedback, but restart it with alternating class names instead of forcing layout.
- Reduce click sparks from a max of 42 to 18; the old cap was flashy but expensive.
- Use Chrome automation as browser proof because repo-preferred browser-use was not callable in this session.

Review fixes:
- N/A: no separate reviewer findings.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Broad global `find` for autogoal script was too slow | 1 | Stop broad search; inspect known local skill paths | Resolved by using `/Users/zbeyens/.codex/skills/autogoal/scripts/...` |
| Browser-use tool not exposed | 1 | Use available Chrome automation fallback and record caveat | Resolved with Playwright + system Chrome |
| Playwright bundled Chromium missing | 1 | Launch system Chrome channel | Resolved |

Verification evidence:
- `tool_search browser-use`: no browser-use callable exposed; fallback recorded.
- Browser baseline, Chrome system via Playwright fallback, `http://127.0.0.1:5175/`: idle `48.06 FPS`, `avg 20.808 ms`, `p95 25.8 ms`, `max 276.5 ms`, `wands: 10`.
- Browser after fix, same route/scenario: idle `59.38 FPS`, `avg 16.841 ms`, `p95 25.1 ms`, `max 26.7 ms`, `wands: 10`; clicking `59.63 FPS`, `avg 16.771 ms`, `max 26.3 ms`.
- `npm run typecheck`: passed.
- `npm run test`: passed (`blackjackActions`, `blackjackRules`, `bookProgression`, `defenseRules`, `forbiddenGrimoire`, `hundredRules`, `miningRules`, `slimeTrainerRules`, `snakeRules`, `targetRules`).
- `npm run build`: passed; Vite chunk-size warning remains informational.
- `git diff --check -- src/ui/hud.ts src/style.css docs/plans/2026-06-26-optimize-mana-crystal-performance.md`: passed.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-optimize-mana-crystal-performance.md`: passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run goal checker and final response |
| What is the goal? | Optimize mana crystal performance with browser proof and checks |
| What have I learned? | Perf hit came from permanent filter/halo work plus forced reflow and wand animation restart costs |
| What have I done? | Implemented perf patch and verified before/after browser timing |

Open risks:
- Existing unrelated dirty worktree changes remain in files outside this patch and in some same files; they were not reverted.
- Headless Chrome timing is a proxy for the user's visible browser FPS, but it caught and proved the same affected surface.
