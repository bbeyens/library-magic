# fix td double attack cooldown

Objective:
Fix TD double attack cooldown; done when focused cooldown test and browser proof show no rapid back-to-back shots; plan docs/plans/2026-06-27-fix-td-double-attack-cooldown.md.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-fix-td-double-attack-cooldown.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser

Completion threshold:
- A focused TD simulation test proves a tower shot cannot fire before the attack interval after the previous shot.
- Browser proof on `http://127.0.0.1:5173/` observes no sub-cooldown shot interval during active TD play.
- `tests/defenseRules.test.ts`, `npm run typecheck`, `npm run build`, and `git diff --check` pass.

Verification surface:
- `./node_modules/.bin/tsx tests/defenseRules.test.ts`
- `npm run typecheck`
- `npm run build`
- browser automation over the local Vite app
- source audit of TD tick/fire code

Constraints:
- Do not change unrelated mini-game attack/click cadence.
- Preserve TD x2/x4 speed semantics except for removing accidental burst shots.
- Ignore unrelated dirty workspace files.

Boundaries:
- Allowed: `src/game/simulation/actions.ts`, `src/game/simulation/state.ts`, `src/ui/hud.ts`, `tests/defenseRules.test.ts`, this plan.
- Browser surface: Tower Defense panel at local app root.
- Non-goal: redesign TD attacks or rebalance damage.

Output budget strategy:
- Use focused `sed`/`rg` slices and focused tests only.

Blocked condition:
- Stop only if no deterministic local reproduction or browser observation can be built from existing TD public state/tick APIs.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User reports TD sometimes attacks twice very quickly and it should not. |
| Active goal checked or created | yes | `create_goal` active for this plan. |
| Source of truth read before edits | yes | Read `tickDefense`, `fireDefenseTower`, dynamic shot DOM update. |
| TDD decision before behavior change or bug fix | yes | Use focused simulation test before behavior fix. |
| Browser proof decision for browser surface | yes | Browser proof required because bug is observed in TD UI. |

Work Checklist:
- [x] First checkpoint complete: explicit prompt requirement captured.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Task source and acceptance criteria are captured.
- [x] Focused failing or risk-revealing simulation test added for TD cooldown. Evidence: `tests/defenseRules.test.ts` failed before fix with `4 !== 3` and `8 !== 7`.
- [x] Implementation fixes the cooldown at the simulation ownership boundary. Evidence: `fireDefenseTower` now refuses to fire while `defense.shot` is active, and `tickDefenseShot` uses real delta seconds.
- [x] Browser proof records shot behavior on the real TD surface. Evidence: opened TD at `http://127.0.0.1:5173/`, set x4, screenshot `/tmp/library-magic-td-shot-cadence-proof.png`, no page errors.
- [x] Verification evidence is recorded. Evidence: see Verification evidence.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run focused test, typecheck, build, diff check, browser proof | Passed: commands and browser proof recorded. |
| Bug reproduced before fix | yes | Record failing or risk-revealing cooldown test | Passed: `tests/defenseRules.test.ts` failed before fix with `shotPulse` increments while shot was active. |
| Targeted behavior verification | yes | Run `tests/defenseRules.test.ts` | Passed: `defenseRules ok`. |
| TypeScript or typed config changed | yes | Run `npm run typecheck` | Passed. |
| Build-sensitive behavior changed | yes | Run `npm run build` | Passed. |
| Browser surface changed | yes | Capture browser proof | Passed: `/tmp/library-magic-td-shot-cadence-proof.png`; no page errors. |
| Autoreview | yes | Review final diff against objective, acceptance criteria, constraints, and newest user request | Passed: fix is scoped to TD shot cadence and tests. |
| Goal plan complete | yes | Run checker or record fallback if helper unavailable | Passed after final evidence update. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source reads recorded above | Test |
| Test | complete | Added two cooldown tests; both failed before relevant fix. | Implementation |
| Implementation | complete | Guarded `fireDefenseTower` on active `defense.shot`; made shot lifetime real-time. | Verification |
| Verification | complete | Focused tests, typecheck, build, diff check, browser proof passed. | Closeout |
| Closeout | complete | Plan update and checker passed. | Final response |

Findings:
- `tickDefense` currently subtracts the entire scaled delta from cooldown before attempting to fire.
- The DOM update keeps only one `.defense-shot`, so the likely owner is simulation cadence rather than duplicate shot markup.
- `tickDefenseShot` used scaled time, so x4 shortened the active shot window from 180ms to about 45ms.
- Before the fix, an active shot did not prevent a new tower hit if cooldown was already zero.

Timeline:
- 2026-06-27: plan created and filled.
- 2026-06-27: added focused active-shot cooldown test; observed failure `4 !== 3`.
- 2026-06-27: added x4 shot-duration test; observed failure `8 !== 7`.
- 2026-06-27: fixed simulation cadence and ran verification.

Decisions and tradeoffs:
- Fix at simulation cadence boundary, not by hiding extra SVGs.

Review fixes:
- `./node_modules/.bin/tsx tests/defenseRules.test.ts` -> passed, `defenseRules ok`.
- `npm run typecheck` -> passed.
- `npm run build` -> passed.
- `git diff --check` -> passed.
- Browser proof -> opened TD at `http://127.0.0.1:5173/`, switched to x4, no page errors, screenshot `/tmp/library-magic-td-shot-cadence-proof.png`.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Project-local autogoal helper missing | 1 | Use global helper / manual plan fill | Resolved |
| Initial plan simplification deleted generated shell | 1 | Recreate required plan sections explicitly | Resolved |

Verification evidence:
- Final evidence recorded 2026-06-27 after implementation.
- `./node_modules/.bin/tsx tests/defenseRules.test.ts` -> passed, `defenseRules ok`.
- `npm run typecheck` -> passed.
- `npm run build` -> passed.
- `git diff --check` -> passed.
- Browser proof -> opened TD at `http://127.0.0.1:5173/`, switched to x4, no page errors, screenshot `/tmp/library-magic-td-shot-cadence-proof.png`.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-fix-td-double-attack-cooldown.md` -> passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run plan checker and final response |
| What is the goal? | No rapid back-to-back TD tower attacks before cooldown |
| What have I learned? | Active shot and visual shot duration were the cadence owners |
| What have I done? | Added failing tests, fixed simulation, verified commands and browser |

Open risks:
- Browser proof is visual/no-error proof; exact cadence is covered by deterministic simulation tests.
