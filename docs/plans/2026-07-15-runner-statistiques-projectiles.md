# runner-statistiques-projectiles

Objective:
Ajouter cinq améliorations runner fonctionnelles pour le déplacement latéral, la portée, le multishot, le guidage et la vitesse des projectiles.

Goal plan:
docs/plans/2026-07-15-runner-statistiques-projectiles.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A: no tracker ticket requested
- title: Ajouter les statistiques avancées du runner
- acceptance criteria: vitesse latérale, portée principale, multishot, homing et vitesse projectile existent et affectent réellement le gameplay; la cadence principale existante est conservée.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no duration requested
- initial confidence score: 88/100
- improvement loop: TDD des formules et comportements, intégration état/tir/déplacement, shop, tests complets et preuve navigateur
- final score / loop closure: 96/100; cinq mécaniques testées, shop et course prouvés dans le navigateur, suite complète verte

Completion threshold:
- Cinq nouveaux `RunnerUpgradeId` sont achetables dans le shop interne du runner avec coûts et niveaux maximums.
- La vitesse latérale transforme la position souris en cible et limite la vitesse réelle du héros; elle augmente par niveau.
- La portée limite physiquement la distance maximale parcourue par chaque projectile et atteint la zone de spawn au niveau maximum.
- Le multishot ajoute un projectile par niveau, au maximum cinq, sans retirer les flux de base liés aux unités.
- Le homing est nul au niveau 0 et rapproche latéralement les tirs de l'ennemi valide le plus proche à partir du niveau 1.
- La vitesse de projectile remplace la constante fixe dans la simulation et augmente par niveau.
- La cadence existante `baseFireRate` reste la seule amélioration de cadence.
- Tests ciblés, suite complète, typecheck, build, diff check et preuve navigateur passent.

Verification surface:
- `tests/runnerRules.test.ts`: formules, vitesse latérale bornée, portée/despawn, multishot, homing et vitesse projectile.
- Tests runner existants et suite `npm test`.
- `npm run typecheck`, `npm run build`, `git diff --check`.
- In-app Browser: nouvelles entrées visibles dans le shop, déblocage debug, déplacement progressif et tirs supplémentaires/guidés visibles sans erreur console.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `runnerRules.ts` pour les formules, `RunnerRunState` pour les stats actives, `actions.ts` pour la simulation, `hud.ts` pour le shop.
- Allowed edit scope: modules runner, tests runner, styles uniquement si le shop l'exige, et ce plan.
- Browser surface: `http://127.0.0.1:5173/`, Galerie des Cibles, hub avant/après course et piste active.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: seconde cadence, nouveaux skins/assets, nouvelles monnaies, stats propres aux skins, refonte des monstres ou des portails.

Current verdict:
- verdict: valid feature request
- confidence: 88/100
- next owner: task
- reason: les upgrades, l'état de course, les projectiles et le shop ont déjà des frontières explicites adaptées.

Pre-solution issue challenge:
- reporter claim: besoin de cinq statistiques de mouvement et de tir supplémentaires.
- suggested diagnosis or fix: upgrades permanents seedant de vraies stats actives de course.
- repro ladder:
  - tests / source-level repro: TDD des formules et effets de simulation.
  - repo-owned automated browser or integration proof: suite runner et build.
  - Browser plugin: shop et course réelle.
  - screenshot / visual proof: nouvelles entrées et projectiles visibles.
- reproduction verdict: N/A: feature request, not a bug.
- validity verdict: valid.
- best long-term fix boundary: formules pures dans runnerRules, valeurs actives dans RunnerRunState et simulation dans actions.
- harsh honest feedback: afficher des lignes de shop sans modifier la trajectoire réelle serait une fausse implémentation; chaque stat doit être observable en simulation.
- hard-stop decision: proceed; stop only if a new mechanic cannot be made deterministic enough for regression tests after three designs.

Blocked condition:
- Les nouvelles trajectoires cassent les collisions balayées ou la boucle runner après trois corrections indépendantes sans solution compatible.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-statistiques-projectiles.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Five requested stats and existing cadence constraint recorded. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created before implementation. |
| Source of truth read before edits | yes | Runner rules, state, firing, bullets, movement, tests and shop inspected. |
| Acceptance criteria captured | yes | Listed above with observable mechanics. |
| Pre-solution issue challenge required | N/A | Feature request. |
| Reproduction verdict before implementation | N/A | Feature request. |
| Repro escalation ladder selected | yes | TDD, suite/build, browser proof. |
| Suggested fix reviewed against durable boundary | yes | Pure formulas seed simulation-owned active stats. |
| TDD decision before behavior change or bug fix | yes | Required before simulation edits. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Browser pack materialized. |
| Browser route / app surface identified | yes | Galerie des Cibles at localhost. |
| Browser tool decision recorded | yes | Use repo-approved in-app Browser plugin. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | passed | Run the named proof or record blocker | Five upgrades functional; focused and complete tests, typecheck, build, diff check and browser proof pass. |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Feature request, not a bug claim; durable boundaries recorded before implementation. |
| Repro escalation ladder | N/A | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Feature request; TDD and browser proof still executed. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature request; RED proof was missing `runnerAttackRange` export before implementation. |
| Targeted behavior verification | passed | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/runnerRules.test.ts`: `runnerRules ok`. |
| TypeScript or typed config changed | passed | Run relevant typecheck | `npm run typecheck` exits 0. |
| Build-sensitive behavior changed | passed | Run relevant build/check | `npm run build` exits 0; only existing Vite chunk-size warning. |
| Browser surface changed | passed | Capture browser proof | Real runner hub shows all five level-zero and maximum values; course screenshot shows ten streams and hero moved to the right edge. |
| Final lint/format | passed | Run relevant lint/format command or record N/A | No lint script exists; `git diff --check` exits 0. |
| Autoreview | passed | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Re-read rules/state/simulation/tests; corrected stale multishot comments and added upgrade-to-run seeding assertions. |
| Timed checkpoint | N/A | No duration requested | N/A. |
| Goal plan complete | passed | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-statistiques-projectiles.md` | Checker reports `[autogoal] complete`. |
| Browser interaction proof | passed | Exercise target route/interaction or record blocker | Opened runner, used debug maximum, started a run and moved the pointer to the right; hero followed with bounded motion. |
| Browser console/network check | passed | Record console/network state or N/A | Fresh reload logs after `2026-07-15T20:30:47.900Z`: 3 normal Vite/Phaser entries, 0 errors/warnings. Network panel is unavailable in this Browser API; asset rendering and screenshots prove required hero/scene resources loaded. |
| Browser final proof artifact | passed | Record screenshot/trace/route proof or exact caveat | Screenshots captured for maximum shop and active course at `http://127.0.0.1:5173/`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Runner rules, state, simulation, shop and tests inspected; requirements materialized. | implementation |
| Implementation | completed | Five upgrades, active run stats, bounded movement, range, multishot, homing, projectile speed and compact shop implemented. | verification |
| Verification | completed | Focused/full tests, typecheck, build, diff check and browser proof passed. | closeout |
| Closeout | completed | Final diff autoreviewed and plan evidence recorded. | final response |

Findings:
- Current movement teleports `playerX` directly to the cursor target.
- Current bullets use fixed speed 34, unlimited effective range until world culling, no homing and at most five base streams.
- Final movement advances toward `playerTargetX` by `lateralSpeed * dt`; all projectile stats are snapshotted or read from the active run state.
- Debug `I` also maximizes unrelated auto-skills and causes repeated HUD/WebGL reconstruction; a clean reload after reset has no console error and normal FPS. This is outside the requested runner-stat scope.

Decisions and tradeoffs:
- Lateral speed is units/second and advances toward `playerTargetX` every tick.
- Attack range is stored as bullet `maxZ` at firing time, so later player movement cannot extend an existing shot.
- Multishot adds full stream-damage projectiles; max five keeps the mesh count bounded.
- Homing steers only toward enemies, while gates may still intercept a guided bullet.

Timeline:
- 2026-07-15T20:07:42.976Z: plan created.
- 2026-07-15T20:18:00Z: RED runner test confirmed the new range API was absent; implementation completed across rules, state, simulation, shop and tests.
- 2026-07-15T20:29:00Z: browser verified level-zero and maximum shop values, ten projectile streams and bounded rightward hero movement.
- 2026-07-15T20:38:48Z: full suite, focused test, typecheck, production build and diff check passed; final autoreview completed.

Verification evidence:
- `npm test`: all 35 test files pass, including runner rules/editor/assets/skins.
- `npx tsx tests/runnerRules.test.ts`: passes movement target clamping, speed-limited motion, range, multishot, homing, projectile speed and swept collision assertions.
- `npm run typecheck`: exits 0.
- `npm run build`: exits 0; Vite emits only its pre-existing large-chunk advisory.
- `git diff --check`: exits 0.
- Browser DOM: level 0 values are 4.8 u/s, 14 m, +0 tir, OFF and 34 u/s; maximum values are 10.05 u/s, 44 m, +5 tir, 7.3 u/s and 64 u/s.
- Browser screenshots: canvas is nonblank, hero and projectile streams render, and the hero moves from center to the right edge after pointer movement.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Ship five functional runner movement/projectile upgrades without duplicating cadence. |
| What have I learned? | See Findings |
| What have I done? | Implemented all five stats and passed every verification gate. |

Open risks:
- No known functional blocker. Existing production bundle-size warning remains outside this feature.
