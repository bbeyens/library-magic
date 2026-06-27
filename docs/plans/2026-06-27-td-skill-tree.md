# TD Skill Tree

Objective:
Add requested TD attack/defense/money skills; done when formulas, purchasing, TD combat, UI, tests, typecheck, build, and browser proof pass.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-td-skill-tree.md

Primary template:
N/A: focused feature plan

Applied packs:
- browser

Completion threshold:
- TD has the requested attack skills: damage, attack speed, range, damage per meter, critical chance, critical multiplier, ricochet count, ricochet chance, super critical chance, super critical multiplier.
- TD has the requested defense skills: life, life regen, resistance.
- TD has the requested money skills: money per enemy, money per wave.
- The skills can be bought, are visible in the upgrade panel, and affect TD gameplay.
- Tests, typecheck, build, and browser proof pass.

Verification surface:
- Focused tests for TD formulas and buying behavior.
- Source audit of combat integration.
- Browser proof of upgrade panel rendering.
- `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`.

Constraints:
- Keep one unique tower; no tower placement.
- Do not change TD map art or Tiled layer ordering.
- Preserve existing dirty workspace changes unless directly touched.

Boundaries:
- `src/game/simulation/state.ts`
- `src/game/simulation/actions.ts`
- `src/game/simulation/defenseRules.ts`
- `src/ui/hud.ts`
- `tests/defenseRules.test.ts`
- optional CSS only if the existing upgrade layout needs it

Output budget strategy:
- Use targeted reads and diffs only.
- Avoid broad generated asset scans.

Blocked condition:
- Stop only if current dirty workspace changes make the TD state/action owner impossible to edit safely.

Start Gates:
| Gate | Applies | Evidence |
| --- | --- | --- |
| Source task captured | yes | User listed requested TD skills by attack, defense, and money categories |
| Context read | yes | `CONTEXT.md` read in this thread |
| TDD skill read | yes | Repo `tdd` skill read |

Work Checklist:
- [x] Add red test for TD formulas.
- [x] Implement TD skill ids, state, formulas, and purchase action.
- [x] Wire combat: damage, speed, range, damage per meter, crits, ricochets, super crits, health, regen, resistance, enemy/wave money.
- [x] Render requested TD upgrade categories in the upgrade panel.
- [x] Verify browser rendering.
- [x] Run required checks.

Completion Gates:
| Gate | Applies | Required action | Evidence |
| --- | --- | --- | --- |
| Tests | yes | Run checks | `./node_modules/.bin/tsx tests/defenseRules.test.ts`, `npm run typecheck`, `npm test`, `npm run build`, `git diff --check` passed |
| Browser | yes | Inspect TD upgrade panel | Chrome opened `http://127.0.0.1:5173`, unlocked books, opened Bastion Arcanique, showed Attaque/Defense/Monnaie and 15 `buyDefenseSkill` buttons |
| Goal plan complete | yes | Update checklist and evidence | This plan records completed checklist and verification evidence |

Phase / pass table:
| Phase | Status | Evidence | Next |
| --- | --- | --- | --- |
| TDD formulas | complete | `tests/defenseRules.test.ts` covers all TD skill ids, purchase, damage, speed, range, money, crit, and super crit formulas | Done |
| Gameplay wiring | complete | TD combat uses skill formulas for tower damage/range/speed, damage per meter, crits, ricochets, health, regen, resistance, enemy money, and wave money | Done |
| UI | complete | Bastion upgrade panel renders Attack/Defense/Money categories and 15 skill tracks | Done |
| Verification | complete | Tests, typecheck, build, diff check, and browser proof passed | Done |

Findings:
- The TD upgrade surface now mirrors the Blackjack upgrade layout while keeping Bastion as a single-tower mini-game.

Timeline:
- Plan created.
- Added TD skill state, formulas, purchase action, combat integration, upgrade UI, focused tests, and browser proof.

Decisions and tradeoffs:
- Currency request maps to existing TD `Sceaux`: money per enemy increases kill reward, money per wave grants a wave-clear bonus.
- Critical and super-critical rolls are deterministic under injected test rolls and random during normal combat.
- Ricochet chance is checked once per shot and then applies to the nearest extra enemies in range.

Review fixes:
- Removed unused TypeScript parameters/imports after the first typecheck pass.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
| --- | --- | --- | --- |

Verification evidence:
- `./node_modules/.bin/tsx tests/defenseRules.test.ts` passed.
- `npm run typecheck` passed.
- `npm test` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Browser proof via system Chrome: `/tmp/library-magic-td-skills-open.png`; DOM showed categories `Attaque`, `Defense`, `Monnaie` and all 15 `buyDefenseSkill` controls.

Reboot status:
| Where am I? | Where am I going? | What is the goal? | What learned? | What done? |
| --- | --- | --- | --- | --- |
| Completed TD skill tree | Done | Requested TD skills are real upgrades | Bastion panel opens in browser and renders all categories/skills | Implementation and verification complete |

Open risks:
- Current dirty workspace includes unrelated changes in shared files; final diff should not be treated as only this TD skill tree.
