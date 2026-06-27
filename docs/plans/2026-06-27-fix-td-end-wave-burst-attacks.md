# fix td end wave burst attacks

Objective:
Fix TD end-wave burst attacks; done when tests and browser proof show no invisible multi-kills or near-simultaneous attacks; plan docs/plans/2026-06-27-fix-td-end-wave-burst-attacks.md.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-fix-td-end-wave-burst-attacks.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser

Completion threshold:
- A focused simulation test reproduces the current invisible multi-kill / burst path.
- Fix makes ricochet/extra hits visible and paced instead of applying several enemy kills in one tick.
- Browser proof on TD x4 shows no page errors and active play with visible paced shots.
- `./node_modules/.bin/tsx tests/defenseRules.test.ts`, `npm run typecheck`, `npm run build`, and `git diff --check` pass.

Verification surface:
- Focused TD rules test.
- Browser proof at `http://127.0.0.1:5173/`.
- Source audit of TD attack/ricochet path.

Constraints:
- Preserve TD gameplay and existing skills.
- Do not remove ricochet as a skill; make it readable.
- Ignore unrelated dirty workspace files.

Boundaries:
- Allowed: `src/game/simulation/actions.ts`, `src/game/simulation/state.ts`, `src/ui/hud.ts`, `tests/defenseRules.test.ts`, this plan.
- Non-goal: rebalance all TD economy or redesign waves.

Output budget strategy:
- Focused reads around TD simulation, state, and rendering; focused test output only.

Blocked condition:
- Stop only if a deterministic reproduction cannot be made from public `tickState` and TD state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User reports end-wave attack bursts and enemies disappearing without visible attack. |
| Active goal checked or created | yes | Active goal created for this plan. |
| Source of truth read before edits | yes | Read TD state, `fireDefenseTower`, `fireDefenseRicochets`, defeat path, tests. |
| TDD decision | yes | Focused regression test before fix. |
| Browser proof decision | yes | Required because the bug is visible animation/readability. |

Work Checklist:
- [x] First checkpoint complete with prompt requirements.
- [x] Objective, threshold, verification, constraints, boundaries, blocked condition are concrete.
- [x] Build tight red/green loop for burst/disappearing enemy path.
- [x] Implement paced visible ricochet/extra hits at the simulation owner.
- [x] Verify tests and browser proof.
- [x] Close plan.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run commands and browser proof | Focused test, typecheck, build, diff check, and browser sample all passed; browser sample showed no near-simultaneous visible shot burst. |
| Bug reproduced before fix | yes | Record failing test | Red test forced ricochet and failed with `3 !== 1` damage popups in a single tick. |
| Targeted behavior verification | yes | Run focused TD rules test | `./node_modules/.bin/tsx tests/defenseRules.test.ts` passed. |
| TypeScript changed | yes | Run `npm run typecheck` | Passed. |
| Build-sensitive behavior changed | yes | Run `npm run build` | Passed, with existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | TD browser sample captured 10 shots, min sampled shot interval 435 ms, no page errors, screenshot `/tmp/library-magic-td-burst-cadence-sampled.png`. |
| Final lint/format | yes | Run `git diff --check` | Passed. |
| Autoreview | yes | Review final diff against newest prompt | Reviewed TD attack path: queued ricochets now require a visible shot before applying damage. |
| Goal plan complete | yes | Run checker | Ready to run after this update. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source reads completed | Repro test |
| Repro test | complete | Red test failed with instant 3-popup ricochet burst | Implementation |
| Implementation | complete | Ricochets are queued as `DefenseQueuedShot` and fired one visible shot at a time | Verification |
| Verification | complete | Focused test, typecheck, build, diff check, browser sample passed | Closeout |
| Closeout | complete | Plan updated with evidence | Final response |

Findings:
- `fireDefenseRicochets` currently applies all ricochet hits immediately in the same tick as the primary shot.
- Only one visible `defense.shot` exists, so ricochet kills can look like enemies disappearing without attack animation.
- This explains why the symptom is worse near wave end, when several enemies are clustered in range and a ricochet can clear multiple survivors.
- The forced-ricochet regression test reproduced the bug: one tick created three damage popups before the fix.
- After the fix, the same setup produces one popup per visible shot, with queued ricochets processed only after the active shot clears.

Hypotheses:
1. Ricochet instant multi-hit causes invisible multi-kills. Prediction: forcing ricochet in one tick makes several enemies lose health/die while only one shot exists.
2. Wave completion advances while death animations are still active. Prediction: waiting for dying timers prevents perceived disappearance.
3. Cooldown x4 still has another bypass. Prediction: shotPulse increments while shot/cooldown should block.

Timeline:
- 2026-06-27: plan created, source read, hypotheses recorded.
- 2026-06-27: red test reproduced instant ricochet burst; fix queued ricochets; verification passed.

Decisions and tradeoffs:
- Preserve ricochet but pace it visibly rather than deleting the skill.
- Queued ricochet shots do not use the normal tower cooldown, but they still wait for the visible shot animation to finish. This preserves the skill's extra-hit feel without invisible multi-kills.

Review fixes:
- Pending.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None | 0 | N/A | N/A |

Verification evidence:
- `./node_modules/.bin/tsx tests/defenseRules.test.ts` -> passed (`defenseRules ok`).
- `npm run typecheck` -> passed.
- `npm run build` -> passed, with Vite chunk-size warning only.
- `git diff --check` -> passed.
- Browser sample on `http://127.0.0.1:5173/` with TD open: 10 sampled shots, first intervals `[1176,675,633,1262,4743,435,975,978,512]`, min interval 435 ms, no page errors, screenshot `/tmp/library-magic-td-burst-cadence-sampled.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Building red/green repro |
| Where am I going? | Closing after verification |
| What is the goal? | No invisible TD multi-kills or near-simultaneous end-wave attacks |
| What have I learned? | Ricochet path was instant and not separately animated |
| What have I done? | Added queued visible ricochet shots, regression test, and browser proof |

Open risks:
- Browser proof validates visible play/no errors; deterministic cadence proof is in the simulation test.
