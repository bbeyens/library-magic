# runner-menu-campfire-3d

Objective:
Créer un menu runner 3D intégré au terrain avec ciel Clouds 3, héros assis et sélectionnables, choix Run/Skill, puis lever du héros et transition caméra vers la course.

Goal plan:
docs/plans/2026-07-15-runner-menu-campfire-3d.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request with visual layout reference and local art pack
- id / link: N/A: no tracker ticket requested
- title: Menu runner 3D avec héros assis et transition vers la course
- acceptance criteria: titre `Runner`; seulement `Run` et `Skill`; ciel composé avec les quatre calques `Clouds 3`; deux héros 3D assis côte à côte sur une bûche et sélectionnables par clic avec état visible; `Run` fait se lever le héros choisi et lance la partie; le même sol reste visible pendant la transition; caméra recalibrée entre cadrage menu et cadrage course; `Skill` ouvre les améliorations sans démarrer; aucune différence de statistiques entre skins.

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
- improvement loop: intégrer le ciel, construire le camp, charger les deux héros, implémenter sélection/menu/transition, puis ajuster cadrage et interactions sur navigateur réel
- final score / loop closure: 97/100; loop closed after two-character interaction proof, launch-transition captures, full suite and clean fresh console.

Completion threshold:
- Le hub HTML actuel est remplacé visuellement par une scène-menu dans le canvas Three.js avec le titre `Runner` et deux commandes seulement: `Run` et `Skill`.
- Les quatre images de `Clouds 3` sont copiées sous les assets runner et composées en arrière-plan du menu sans flou ni filtrage lisse.
- Les modèles garçon et fille existants sont instanciés simultanément, placés assis côte à côte sur une bûche et chacun possède une zone de clic distincte et un contour/halo de sélection visible.
- Le bouton `Skill` affiche/masque les compétences du runner sans lancer la course; les achats et coûts existants restent fonctionnels.
- Le bouton `Run` déclenche une transition d'au moins 500 ms dans laquelle le héros choisi passe de la pose assise à debout, l'autre héros et le camp disparaissent, puis la caméra rejoint le cadrage de course et l'état `running` démarre.
- Le sol 3D du canyon est visible dans le menu et reste la continuité spatiale de la course; aucun écran vide ou saut incohérent de caméra.
- Les règles et statistiques restent inchangées et les tests ciblés, suite complète, typecheck, build, diff check et preuve navigateur passent.

Verification surface:
- Test statique ciblé du menu runner: assets Clouds 3, deux héros, sélection, commandes Run/Skill et transition caméra.
- `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`.
- In-app Browser sur `http://127.0.0.1:5173/`: ouvrir runner, voir le menu complet, sélectionner les deux héros, ouvrir/fermer Skill, démarrer, observer le lever et l'arrivée au cadrage de course; vérifier console, réseau, pixels canvas et largeur réelle du panneau.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/runnerThreeLane.ts` pour la scène/caméra/sélection, `src/ui/hud.ts` pour les commandes et `src/style.css` pour le texte interactif; assets sous `public/assets/runner/`.
- Allowed edit scope: renderer et HUD runner, styles runner, assets Clouds 3, éventuel modèle Blender de bûche/camp, tests runner et ce plan.
- Browser surface: livre runner à `http://127.0.0.1:5173/`, état menu, panneau Skill et transition Run.
- Tracker sync: N/A: no tracker, PR, commit or push requested.
- Non-goals: modifier les statistiques, règles de combat, économie, modèles de monstres, terrain de course existant, autres mini-jeux ou créer un écran marketing séparé.

Current verdict:
- verdict: valid and sufficiently specified feature
- confidence: 88/100
- next owner: task
- reason: la référence et le texte définissent clairement la composition, les commandes, les modèles, la sélection et la transition attendue.

Pre-solution issue challenge:
- reporter claim: le hub runner doit devenir une scène-menu 3D intégrée au terrain, avec ciel Clouds 3 et sélection directe des deux héros assis.
- suggested diagnosis or fix: faire du menu un mode du renderer Three.js plutôt qu'un overlay HTML opaque séparé.
- repro ladder:
  - tests / source-level repro: audit du hub actuel, du chargement des héros et de la transition `startRunnerRun`.
  - repo-owned automated browser or integration proof: test statique ciblé puis suite/build.
  - Browser plugin: interactions réelles menu, sélection, Skill et Run.
  - screenshot / visual proof: captures menu et course après transition, avec contrôle de pixels non vides.
- reproduction verdict: N/A: feature request, not a bug.
- validity verdict: valid.
- best long-term fix boundary: état visuel menu/transition/course dans le renderer; état économique et règles restent dans la simulation/HUD.
- harsh honest feedback: conserver l'ancien gros panneau par-dessus la 3D raterait la demande; les personnages et le sol doivent réellement habiter la scène.
- hard-stop decision: proceed; stop only if hero GLBs or Clouds 3 cannot be loaded after three independent corrections.

Blocked condition:
- Les modèles de héros existants, les images Clouds 3 ou le canvas Three.js ne peuvent pas être chargés/rendus après trois corrections indépendantes, empêchant toute preuve honnête de la scène-menu.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-menu-campfire-3d.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | All explicit layout, asset, interaction, pose, ground and camera requirements are recorded. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | New measurable goal created after confirming no active goal. |
| Source of truth read before edits | yes | Read runner renderer, hero loader/rig names, pointer raycast, HUD action routing, structural signature and runner-only styles before implementation. |
| Acceptance criteria captured | yes | Task source and completion threshold contain every requested behavior. |
| Pre-solution issue challenge required | N/A | Feature request, not a bug report. |
| Reproduction verdict before implementation | N/A | Feature request. |
| Repro escalation ladder selected | yes | Targeted source test, full suite/build, Browser interaction and pixel proof. |
| Suggested fix reviewed against durable boundary | yes | One Three.js scene owns menu/transition/course continuity. |
| TDD decision before behavior change or bug fix | yes | Add a targeted static/interaction contract test before or alongside implementation; existing gameplay tests protect stats. |
| Browser proof decision for browser surface | yes | Required because pose, framing and camera transition are visual. |
| Browser pack selected | yes | Browser pack materialized in this plan. |
| Browser route / app surface identified | yes | Runner book at localhost. |
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
| Named verification threshold | passed | Run the named proof or record blocker | Targeted tests, full suite, typecheck, build, diff check and browser proof passed. |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Feature request; validity and same-scene ownership boundary recorded before implementation. |
| Repro escalation ladder | N/A | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | No bug claim; source audit, tests and full visual interaction proof were still completed. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature request, not a regression report. |
| Targeted behavior verification | passed | Run focused test/proof for changed behavior or record N/A | `runnerMenuScene` and updated `runnerHeroSkin` tests passed. |
| TypeScript or typed config changed | passed | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | passed | Run relevant build/check | `npm run build` passed; only the existing Vite large-chunk advisory remains. |
| Browser surface changed | passed | Capture browser proof | Menu, both selections, Skill drawer, rise transition and course camera captured on the real runner panel. |
| Final lint/format | passed | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passed. |
| Autoreview | passed | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed renderer lifecycle, rAF cancellation, pointer ownership, selection persistence, HUD structural rerender and all visible states; no blocking issue found. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-menu-campfire-3d.md` | Run after this evidence update. |
| Browser interaction proof | passed | Exercise target route/interaction or record blocker | Clicked boy and girl 3D hit zones, opened Skill, launched each state, observed stand/rotate/camera blend and active course. |
| Browser console/network check | passed | Record console/network state or N/A | Fresh navigation has no errors or warnings; PageAssets observed four sky layers, two hero GLBs and three terrain GLBs. |
| Browser final proof artifact | passed | Record screenshot/trace/route proof or exact caveat | Menu, Skill, selected-girl, mid-transition and active-course screenshots inspected; pixel crop proof recorded below. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Renderer, HUD, rig, styles, actions and tests audited. | implementation |
| Implementation | completed | Sky composition, 3D camp, dual heroes, raycast selection, Skill drawer and launch camera transition implemented. | verification |
| Verification | completed | Targeted/full tests, typecheck, build, diff check and Browser proof passed. | closeout |
| Closeout | completed | Evidence recorded; checker and goal completion remain mechanical final steps. | final response |

Findings:
- `Clouds 3` contains four 576x324 PNG layers: dark sky/stars, moon, blue cloud bank and dark foreground cloud bank.
- The runner already has two cosmetic hero GLBs and persistent `selectedSkin` state; their statistics are covered as identical by `tests/runnerRules.test.ts`.
- Both hero GLBs expose the same named rig (`pelvis`, thighs, calves, spine and arms) and one in-place running clip, so a shared procedural seated pose can be applied to cloned skeletons.
- The existing hub is a fully opaque scroll panel; it must become a transparent interaction layer or it will continue to hide the requested scene.
- Canvas pointer input already owns editor raycasting, making it the correct place to add distinct hero hit targets while the run is idle.

Decisions and tradeoffs:
- Treat menu, launch transition and course as modes of the same Three.js lane so the ground and camera never jump between unrelated renderers.
- Use the four Clouds 3 layers as pixel-preserving CSS backgrounds behind the transparent canvas; this preserves the supplied pixel art instead of recreating it.
- Compose Clouds 3 as pixel-preserving CSS layers behind the transparent WebGL canvas plus a masked upper cloud bank; this keeps the sky fixed while the 3D camera moves without overlaying the lower gameplay lane.
- Keep `selectedSkin` in simulation state but keep the 900 ms launch transition renderer-local; the simulation starts only after the visible stand-and-camera animation completes.

Timeline:
- 2026-07-15T21:23:26.870Z: plan created.
- 2026-07-15: copied all four 576x324 Clouds 3 layers into runner assets and added a failing-then-passing menu contract test.
- 2026-07-15: replaced the opaque hub with a transparent two-action menu over a real 3D camp and direct hero raycast selection.
- 2026-07-15: implemented seated rig poses, rise/turn animation, camera interpolation and delayed simulation start.
- 2026-07-15: verified both skins, Skill and Run paths in the in-app Browser and passed the complete project gate.

Verification evidence:
- Assets: `public/assets/runner/sky/clouds-3/{1,2,3,4}.png`, each unchanged at 576x324; PageAssets observed all four at runtime.
- Focused tests: `npx tsx tests/runnerMenuScene.test.ts` and `npx tsx tests/runnerHeroSkin.test.ts` passed.
- Regression suite: `npm test` passed, including all runner, mine, crystal-adjacent HUD and other mini-game tests.
- Static/build checks: `npm run typecheck`, `npm run build` and `git diff --check` passed. Vite retained the pre-existing large-chunk advisory.
- Browser menu proof: `Runner`, `Run` and `Skill` remain readable over Clouds 3; both 3D heroes sit on one log and the yellow selection ring moved from boy to girl after direct canvas clicks.
- Browser Skill proof: Skill opens a bounded two-column upgrade drawer and toggles without starting the run.
- Browser Run proof: at 430 ms the selected hero is upright with arms down and turned toward the road while the camera is between menu and play framing; after 900 ms the correct hero model runs in the normal camera.
- Browser lifecycle proof: death returns to the same 3D camp with last-distance/coin result; fresh console contains only Vite connection and Phaser info logs, with zero warning/error entries.
- Runtime asset proof: PageAssets observed both hero GLBs, all three canyon GLBs, the hero texture and every Clouds 3 layer.
- Canvas proof: final 492x685 crop has 1,944 unique sampled colors; RGB standard deviations are 55.91, 46.60 and 42.13, confirming a nonblank varied render.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Checker, goal completion and final response |
| What is the goal? | Ship the integrated 3D runner menu and camera transition described in Objective. |
| What have I learned? | See Findings |
| What have I done? | Built and proved the complete integrated runner menu and launch transition. |

Open risks:
- The seated pose is procedural because the supplied GLBs only contain a running clip; a future authored sit/stand clip can replace the bone offsets without changing menu state or camera logic.
- The sky layers are fixed to this supplied 576x324 set; swapping packs later should preserve the same four-layer naming contract or update the static test.
