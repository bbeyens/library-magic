# runner-terrain-canyon-blender

Objective:
Créer dans Blender un canyon low-poly modulaire et remplacer le terrain abstrait du runner sans gêner le gameplay.

Goal plan:
docs/plans/2026-07-15-runner-terrain-canyon-blender.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request with visual reference
- id / link: N/A: no tracker ticket requested
- title: Remplacer le terrain du runner par un canyon low-poly Blender
- acceptance criteria: chemin ocre, rochers, herbe, falaises et arbres visibles; modèles produits dans Blender; terrain défile en boucle; héros, monstres, portails, projectiles et éditeur restent lisibles et fonctionnels.

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
- initial confidence score: 90/100
- improvement loop: générer trois modules Blender, intégrer, inspecter desktop/mobile, ajuster cadrage/lisibilité/performance, vérifier tests et build
- final score / loop closure: 96/100; boucle fermée après génération Blender, intégration, tests complets et preuve visuelle réelle.

Completion threshold:
- Trois modules de canyon low-poly sont générés par un script Blender reproductible et exportés en GLB sous `public/assets/runner/environment/`.
- Chaque module contient un chemin ocre, des bandes d'herbe, des rochers de bordure, des falaises et au moins un arbre; les variantes évitent une répétition trop évidente.
- Le runner charge ces GLB une seule fois, clone un nombre borné de segments et les recycle selon `run.distance` pour donner un terrain continu.
- L'ancien terrain sombre et ses lignes bleues/pointillés sont masqués visuellement, mais le plan de raycast invisible reste utilisable par l'éditeur.
- Le décor ne masque pas le couloir jouable ni les entités; scène non vide et correctement cadrée sur desktop et mobile.
- Test statique d'assets, suite complète, typecheck, build, diff check et preuve navigateur passent.

Verification surface:
- Blender headless: génération sans erreur et inspection des trois GLB.
- `tests/runnerEnvironmentAsset.test.ts`: assets présents/non vides et intégration référencée.
- `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`.
- In-app Browser sur `http://127.0.0.1:5173/`: hub, course active, déplacement, vue desktop/mobile, pixels canvas non vides, console sans erreur.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `scripts/generate-runner-environment.py` pour les modèles Blender et `src/ui/runnerThreeLane.ts` pour chargement/recyclage/rendu.
- Allowed edit scope: assets et scripts runner, renderer Three.js runner, test d'asset et ce plan.
- Browser surface: `http://127.0.0.1:5173/`, livre Galerie des Cibles / runner, hub et course.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: changement des règles, statistiques, monstres, personnages, éditeur, caméra de gameplay ou autres mini-jeux.

Current verdict:
- verdict: valid and sufficiently specified visual feature
- confidence: 90/100
- next owner: task
- reason: la référence fixe clairement le style, les éléments attendus et la perspective; le renderer possède déjà une frontière terrain isolée.

Pre-solution issue challenge:
- reporter claim: remplacer le terrain runner par le style canyon low-poly montré et utiliser Blender.
- suggested diagnosis or fix: kit modulaire Blender recyclé en boucle dans le renderer existant.
- repro ladder:
  - tests / source-level repro: test d'assets et lecture du renderer.
  - repo-owned automated browser or integration proof: suite, typecheck et build.
  - Browser plugin: course réelle desktop/mobile.
  - screenshot / visual proof: captures canvas et contrôle de pixels non vides.
- reproduction verdict: N/A: feature request, not a bug.
- validity verdict: valid.
- best long-term fix boundary: Blender owns reusable geometry; Three.js owns bounded segment recycling.
- harsh honest feedback: une simple image de fond serait incorrecte, car elle ne suivrait ni la perspective ni le défilement et casserait l'effet 3D.
- hard-stop decision: proceed; stop only if Blender export or GLB loading fails after three independent corrections.

Blocked condition:
- Blender ne peut pas exporter un GLB valide ou le navigateur ne peut pas charger/rendre les modules après trois corrections indépendantes.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-terrain-canyon-blender.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Style reference, Blender requirement, terrain replacement and visual elements captured. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created before implementation. |
| Source of truth read before edits | yes | Existing runner renderer, terrain, loading, raycast and disposal paths inspected. |
| Acceptance criteria captured | yes | Listed in task source and completion threshold. |
| Pre-solution issue challenge required | N/A | Feature request, not a bug. |
| Reproduction verdict before implementation | N/A | Feature request. |
| Repro escalation ladder selected | yes | Assets, suite/build, Browser desktop/mobile and canvas proof. |
| Suggested fix reviewed against durable boundary | yes | Modular GLB generation and bounded renderer recycling selected. |
| TDD decision before behavior change or bug fix | N/A | Pure visual/asset integration; static regression test plus browser proof is more honest than behavioral TDD. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Browser pack materialized. |
| Browser route / app surface identified | yes | Runner at localhost. |
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
| Named verification threshold | passed | Run the named proof or record blocker | Blender exports, focused test, full suite, typecheck, build, diff check and Browser proof passed. |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Feature request; validity and durable Blender/Three.js ownership boundary recorded before implementation. |
| Repro escalation ladder | N/A | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | No bug claim; focused asset proof and real Browser proof still completed. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature request, not a regression report. |
| Targeted behavior verification | passed | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/runnerEnvironmentAsset.test.ts` passed. |
| TypeScript or typed config changed | passed | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | passed | Run relevant build/check | `npm run build` passed; only existing Vite chunk-size warning. |
| Browser surface changed | passed | Capture browser proof | Real runner course checked at its 492 px rendered width, including active run and right-edge movement. |
| Final lint/format | passed | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passed. |
| Autoreview | passed | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed generator, asset loading, bounded recycling, shared disposal and raycast preservation; no objective-breaking issue found. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-terrain-canyon-blender.md` | Run after this evidence update. |
| Browser interaction proof | passed | Exercise target route/interaction or record blocker | Opened runner, started a run, passed 40 m and moved the hero to the right edge without terrain occlusion or segment gap. |
| Browser console/network check | passed | Record console/network state or N/A | Console issues empty; all three canyon GLBs observed loaded through PageAssets. |
| Browser final proof artifact | passed | Record screenshot/trace/route proof or exact caveat | Active-course and right-edge screenshots inspected; canvas crop 492x685, 1,016 sampled colors and non-zero RGB deviation. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Existing renderer, editor raycast and asset patterns read. | implementation |
| Implementation | completed | Blender generator, three GLBs and bounded Three.js recycling integrated. | verification |
| Verification | completed | Focused/full tests, typecheck, build, diff check and Browser proof passed. | closeout |
| Closeout | completed | Evidence recorded; checker and goal close remain mechanical final steps. | final response |

Findings:
- Existing terrain is entirely procedural: one dark road plane, cyan edge strips and 14 center dashes.
- The road mesh is also the editor raycast target, so it must remain as an invisible interaction plane.
- Blender 5.1.2 is installed at `/Applications/Blender.app` and supports headless GLB export.

Decisions and tradeoffs:
- Use three complete 16-unit Blender segment variants instead of separate per-prop loads; this minimizes loader complexity and keeps asset authorship in Blender.
- Keep six recycled clones in the scene; bounded draw calls and enough depth for the camera/fog.
- Use flat-shaded geometry and vertex/material colors, matching the reference without texture dependencies.

Timeline:
- 2026-07-15T20:46:40.475Z: plan created.
- 2026-07-15: generated three deterministic canyon modules with Blender 5.1.2 and exported valid GLB 2.0 assets.
- 2026-07-15: integrated six bounded recycled segment clones, fog, sky, shadows and invisible editor raycast plane in the runner renderer.
- 2026-07-15: full automated and real-browser verification passed.

Verification evidence:
- Blender command: `/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/generate-runner-environment.py`; three exports succeeded despite the harmless BlenderMCP background-server notice.
- GLB inspection: each file is about 76 KB and contains 30 meshes, 15 materials, 31 nodes and one scene.
- Focused test: `npx tsx tests/runnerEnvironmentAsset.test.ts` passed.
- Regression suite: `npm test` passed, including runner, mining, crystal-adjacent HUD and other mini-game tests.
- Static/build checks: `npm run typecheck`, `npm run build` and `git diff --check` passed. Vite retained its existing large-chunk warning.
- Browser: all three GLB URLs loaded; runner stayed visually continuous beyond 40 m; hero remained visible at the right edge; measured FPS was 89-96.
- Canvas proof: rendered crop is 492x685 with 1,016 unique sampled colors and RGB standard deviations of 47.64, 47.22 and 44.83, proving a nonblank varied frame.
- Responsive caveat: the Browser plugin exposes no viewport-resize API. The actual runner panel already renders at the requested narrow 492 px width in the 1280 px browser, and that constrained surface was the one inspected.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Checker, goal completion and final response |
| What is the goal? | Ship a Blender-authored low-poly canyon terrain for the runner without gameplay regressions. |
| What have I learned? | See Findings |
| What have I done? | Generated, integrated and verified the complete modular canyon terrain. |

Open risks:
- The three variants will eventually become visually familiar during long runs; adding more Blender variants later is easy because the generator and loader arrays are explicit.
- Bundle size remains above Vite's warning threshold, but this task adds small external GLBs rather than embedding their bytes in the JavaScript bundle.
