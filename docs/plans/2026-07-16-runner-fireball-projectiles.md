# Runner fireball projectiles

Objective:
Créer un projectile boule de feu Blender léger et le rendre par instancing GPU afin que le coût de rendu reste constant quand le nombre de tirs augmente.

Goal plan:
docs/plans/2026-07-16-runner-fireball-projectiles.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: Améliorer les projectiles du Runner avec des boules de feu Blender performantes
- acceptance criteria: asset `.blend` et `.glb`; petite boule de feu visible; géométrie/matériaux chargés une fois; rendu instancié sans allocation par projectile; tests, typecheck, build et preuve navigateur réussis.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: aucune durée demandée
- initial confidence score: 88/100
- improvement loop: asset -> intégration instanciée -> test de budget -> preuve visuelle/runtime
- final score / loop closure: 99/100; asset, instancing, stress proof and full verification complete

Completion threshold:
- `public/assets/runner/projectiles/fireball.glb` et sa source Blender existent et sont inspectables.
- Le renderer Runner utilise un ou plusieurs `InstancedMesh` partagés, jamais un Mesh/Material créé par projectile.
- 1 et 100 projectiles gardent un nombre constant d'objets de rendu/draw calls pour la boule de feu.
- Le projectile est visible comme une petite boule de feu orange/jaune dans la vraie scène Runner.
- Les tests ciblés, `npm run typecheck`, `npm run build` et la preuve navigateur passent.

Verification surface:
- Inspection Blender/GLB: objet mesh unique, faible nombre de triangles, matériaux bornés, dimensions/pivot documentés.
- Test statique Runner projectile: asset GLB, InstancedMesh, capacité bornée, absence de BoxGeometry/pool Mesh par balle.
- Test de calcul d'instances: 0/1/100 projectiles et transformations déterministes sans allocation persistante par balle.
- `npm run test`, `npm run typecheck`, `npm run build`.
- Browser Runner: capture avec plusieurs boules de feu, console sans erreur et `renderer.info.render.calls` contrôlé.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/runnerThreeLane.ts`, état `runner.bullets`, et asset Blender exporté.
- Allowed edit scope: renderer Runner, script/asset projectile, tests ciblés, ce plan.
- Browser surface: panneau Runner 3D sur le serveur Vite local.
- Tracker sync: N/A, aucune issue demandée.
- Non-goals: ne pas modifier les dégâts, collisions, cadence, homing, autres mini-jeux ou progression.

Current verdict:
- verdict: complete
- confidence: 99/100
- next owner: user validation
- reason: Blender asset integrated through 2 constant draw calls; 100-instance browser proof and all repository checks pass.

Pre-solution issue challenge:
- reporter claim: le projectile doit être visuellement amélioré sans risque de lag quand il y en a beaucoup.
- suggested diagnosis or fix: asset Blender low-poly et rendu instancié.
- repro ladder:
  - tests / source-level repro: source confirme un `Mesh + BoxGeometry + Material` ajouté au pool par balle.
  - repo-owned automated browser or integration proof: `runnerFireballRenderer.test.ts` passes for asset, instancing and 128 capacity.
  - Browser plugin: real Runner panel proved 100 instances and 2 draw calls.
  - screenshot / visual proof: 100 orange/yellow fireballs visible at 106 FPS.
- reproduction verdict: valid; le visuel actuel est un pavé bleu et son pool augmente le nombre de Mesh.
- validity verdict: valid feature/performance improvement.
- best long-term fix boundary: un asset Blender unique et un rendu `InstancedMesh` propriétaire du renderer Runner.
- harsh honest feedback: remplacer seulement la BoxGeometry par un GLB cloné améliorerait le visuel mais empirerait le coût; l'instancing est obligatoire.
- hard-stop decision: aucun blocage; Blender 5.1.2 et le CLI sont disponibles localement. Les outils BlenderMCP ne sont pas exposés dans cette session, donc l'asset est produit et inspecté par le vrai binaire Blender headless.

Blocked condition:
- Bloqué uniquement si Blender ne peut pas exporter un GLB valide ou si la scène Runner ne peut pas charger l'asset; dans ce cas conserver l'ancien projectile et rapporter l'erreur exacte.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-fireball-projectiles.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Blender fireball + many-projectile performance captured above |
| Timed checkpoint parsed | N/A | no duration requested |
| Active goal checked or created | yes | active goal created for this thread |
| Source of truth read before edits | yes | `syncBullets`, RunnerLane and asset loaders inspected |
| Acceptance criteria captured | yes | Task source and completion threshold |
| Pre-solution issue challenge required | yes | valid feature/performance claim recorded |
| Reproduction verdict before implementation | yes | current per-bullet Mesh pool confirmed |
| Repro escalation ladder selected | yes | source test -> Browser proof -> screenshot |
| Suggested fix reviewed against durable boundary | yes | renderer-owned instancing selected |
| TDD decision before behavior change or bug fix | yes | targeted structural/budget tests before integration completion |
| Browser proof decision for browser surface | yes | required |
| Browser pack selected | yes | browser pack materialized |
| Browser route / app surface identified | yes | local Runner panel |
| Browser tool decision recorded | yes | in-app Browser plugin |

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
| Named verification threshold | yes | Run the named proof or record blocker | 100 instances, 2 draw calls, 106 FPS; all commands pass |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | valid; renderer-owned instancing implemented |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source, focused test, Browser and screenshot completed |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | old `bulletPool` created one blue box Mesh per projectile |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerFireballRenderer.test.ts` passes |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passes |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passes |
| Browser surface changed | yes | Capture browser proof | real Runner scene captured with 100 fireballs |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script; `git diff --check` passes |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | scoped audit complete; no gameplay/economy behavior changed |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run global autogoal checker for this plan | `[autogoal] complete` |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | `/?runnerFireballProof=1` used temporarily, then removed |
| Browser console/network check | yes | Record console/network state or N/A | clean final tab: Vite + Phaser logs only, no warnings/errors |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | screenshot emitted in task with 100 visible fireballs |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | old per-bullet Mesh pool and Blender availability audited | implementation |
| Implementation | complete | Blender GLB + two InstancedMesh parts | verification |
| Verification | complete | tests/typecheck/build + 100-instance Browser proof | closeout |
| Closeout | complete | temporary proof removed; diff audit clean | final response |

Findings:
- Blender 5.1.2 exported the fireball as two glTF primitives, so Three.js correctly owns two shared InstancedMesh parts.
- The final asset is 8.8 KB, 54 vertices, 92 triangles and two emissive materials.
- The stress scene rendered 100 instances with a constant two-draw-call projectile budget at 106 FPS.

Decisions and tradeoffs:
- Chose two material parts instead of merging colors into a texture: this keeps the asset tiny and draw calls constant without a texture fetch.
- Capped renderer capacity at 128; current gameplay stays far below this while pathological state cannot allocate unbounded GPU instances.
- Disabled per-projectile shadows/lights/particles; emissive Blender materials provide the fire effect without multiplicative runtime cost.

Timeline:
- 2026-07-16T02:14:36.153Z: plan created.
- 2026-07-16: Blender source, GLB and proof render generated.
- 2026-07-16: per-bullet mesh pool replaced by GPU instancing.
- 2026-07-16: 100-instance stress proof, full tests, typecheck and build passed.

Verification evidence:
- Blender output: `RUNNER_FIREBALL_READY ... vertices=54 triangles=92 materials=2`.
- Files: `fireball.glb` 8.8 KB; `fireball.blend` 94 KB; proof PNG 214 KB.
- Focused test: `runnerFireballRenderer ok`, including 0/1/100/999 count cases.
- Full suite: 40 test files pass.
- Browser dataset: ready=true, instances=100, drawCalls=2, fps=106.
- Browser console: no warning or error in final clean tab.
- Typecheck and production build pass; only the existing Vite large-chunk warning remains.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Blender fireball with constant-cost instanced rendering |
| What have I learned? | GLB uses two primitives; 2 draw calls remain constant at 100 instances |
| What have I done? | Asset, integration, tests and browser stress proof complete |

Open risks:
- The 128-instance visual cap intentionally hides excess pathological bullets; gameplay generation remains below the cap.
