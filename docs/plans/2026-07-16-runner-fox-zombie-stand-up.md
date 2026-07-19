# runner fox zombie stand up

Objective:
Integrer Zombie Stand Up.fbx comme animation FoxSitToStand complete avant la course du Fox, avec export Blender reproductible, tests, build et preuve navigateur.

Goal plan:
docs/plans/2026-07-16-runner-fox-zombie-stand-up.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: Utiliser Zombie Stand Up pour le standing up du Fox
- acceptance criteria: le Fox joue le clip fourni en quittant la buche; la course ne commence qu'apres la derniere frame; les autres clips, le rig et les trois materiaux restent intacts.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 91/100
- improvement loop: verifier le rig, tester le contrat, exporter, mesurer la duree GLB, verifier la chronologie dans le navigateur
- final score / loop closure: 99/100; rig 33/33, clip 2.4667 s, suite complete, typecheck, build et chronologie navigateur valides

Completion threshold:
- `public/assets/runner/heroes/boy.glb` contient `FoxSitToStand` en plus des quatre clips existants.
- La source est conservee dans `exports/runner-fox/stand-up-source.fbx` et l'exporteur fonctionne sans le fichier Downloads.
- Le hub joue le clip complet pendant environ 2.47 s avant `standardRun`.
- Tests cibles, suite complete, typecheck, build et preuve navigateur passent sans erreur.

Verification surface:
- `tests/runnerFoxHubAnimation.test.ts`, `tests/runnerHeroSkin.test.ts`, `npm test`, `npm run typecheck`, `npm run build`.
- Rapport `exports/runner-fox/export-report.json` et regeneration Blender depuis les sources preservees.
- Browser sur `http://127.0.0.1:5173/`: `sitting`, `sitToStand`, puis `standardRun`, captures visuelles et console vide.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `scripts/export-runner-fox.py`, les FBX preserves sous `exports/runner-fox/` et le contrat de clips Fox.
- Allowed edit scope: pipeline/export Fox, asset `boy.glb`, lecture des clips du Runner et tests Fox associes.
- Browser surface: hub et lancement du mini-jeu Runner sur `http://127.0.0.1:5173/`.
- Tracker sync: N/A, aucune issue demandee.
- Non-goals: changer la fille, les monstres, les statistiques, le gameplay, les materiaux ou les autres animations Fox.

Current verdict:
- verdict: valid
- confidence: 99/100
- next owner: task
- reason: le donneur est un clip Mixamo compatible avec les 33 os du Fox et le resultat runtime est prouve.

Pre-solution issue challenge:
- reporter claim: utiliser le FBX fourni comme animation de relevage du Fox.
- suggested diagnosis or fix: importer le clip dans le pipeline Fox et remplacer le fondu assis/debout pour cette transition.
- repro ladder:
  - tests / source-level repro: test cible initialement rouge car `FoxSitToStand` et la source preservee etaient absents.
  - repo-owned automated browser or integration proof: tests Runner existants utilises; aucun E2E automatise dedie disponible.
  - Browser plugin: chronologie reelle observee, `sitToStand` jusqu'a 2.0 s puis `standardRun` vers 2.4 s.
  - screenshot / visual proof: Fox assis au hub puis releve sur la route; aucun rendu vide ou T-pose.
- reproduction verdict: valid, le clip n'etait pas present avant l'intervention.
- validity verdict: valid.
- best long-term fix boundary: pipeline Blender Fox reproductible et selection de clip par nom dans `runnerThreeLane.ts`.
- harsh honest feedback: un simple delai CSS aurait menti; la duree doit venir du clip Three.js reel.
- hard-stop decision: continuer, aucun blocage de rig ou d'asset.

Blocked condition:
- Arreter uniquement si le FBX donneur ne partage pas exactement le rig Fox, si Blender ne peut pas exporter les cinq clips, ou si le clip provoque une T-pose/rendu vide.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-fox-zombie-stand-up.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | FBX precis et role `standing up` du Fox captures |
| Timed checkpoint parsed | N/A | aucune duree demandee |
| Active goal checked or created | yes | objectif actif correspondant a la demande |
| Source of truth read before edits | yes | exporteur, runtime, tests et rapport Fox lus |
| Acceptance criteria captured | yes | clip complet avant run, preservation du rig, clips et materiaux |
| Pre-solution issue challenge required | N/A | demande de fonctionnalite, pas un rapport public |
| Reproduction verdict before implementation | yes | test cible rouge sur absence du clip |
| Repro escalation ladder selected | yes | test, export Blender, Browser et capture |
| Suggested fix reviewed against durable boundary | yes | integration dans l'exporteur et selection par nom de clip |
| TDD decision before behavior change or bug fix | yes | assertion `FoxSitToStand` ajoutee puis observee rouge |
| Browser proof decision for browser surface | yes | hub et lancement Runner verifies dans le vrai canvas |
| Browser pack selected | yes | pack browser materialise |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, livre Runner |
| Browser tool decision recorded | yes | Browser integre impose par le depot |

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
| Named verification threshold | yes | Executer tous les controles nommes | 5 clips, export local, tests, typecheck, build et Browser valides |
| Pre-solution issue challenge verdict | N/A | Fonctionnalite directe | Validite du donneur verifiee avant integration |
| Repro escalation ladder | yes | Test, Blender, Browser, capture | Toutes les marches applicables executees |
| Bug reproduced before fix | N/A | Fonctionnalite absente prouvee par test rouge | `FoxSitToStand` manquait dans le GLB |
| Targeted behavior verification | yes | Executer les tests Fox | `runnerFoxHubAnimation` et `runnerHeroSkin` passent |
| TypeScript or typed config changed | yes | Executer typecheck | `npm run typecheck` passe |
| Build-sensitive behavior changed | yes | Executer build | `npm run build` passe, avertissement de taille existant uniquement |
| Browser surface changed | yes | Capturer la transition | `sitting`, `sitToStand`, `standardRun` observes |
| Final lint/format | N/A | Aucun script lint dans package.json | Typecheck, tests et execution Blender couvrent les fichiers touches |
| Autoreview | yes | Relire le diff cible et les rapports | Aucun changement fille/monstre/stats; clips et materiaux preserves |
| Timed checkpoint | N/A | Aucune duree demandee | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-fox-zombie-stand-up.md` | audit final execute; rerun de fermeture fait foi |
| Browser interaction proof | yes | Ouvrir Runner et cliquer Run | Hub puis camera de lancement et course observes |
| Browser console/network check | yes | Lire les erreurs navigateur | aucune erreur ni alerte; reseau hors scope, GLB visiblement charge |
| Browser final proof artifact | yes | Capture du rendu reel | Fox assis au hub et Fox releve sur la route captures |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | rig donneur 33/33 et bind delta 0.0000311 | implementation |
| Implementation | completed | exporteur, clip runtime et attente de duree reelle integres | verification |
| Verification | completed | tests, typecheck, build, Blender et Browser valides | closeout |
| Closeout | completed | suite finale passee; checker relance apres fermeture du statut | final response |

Findings:
- `Zombie Stand Up.fbx` contient un unique clip Mixamo de 74 frames a 30 fps.
- Le rig partage les 33 os du Fox; le mouvement vertical de 0.2942 est intentionnel et ne doit pas etre rejete comme une boucle.
- Le GLB exporte expose une duree runtime de 2.4667 s et 102 canaux.

Decisions and tradeoffs:
- Conserver le mouvement de racine pour le clip non boucle, tout en gardant le controle strict des boucles Run et Idle.
- Deriver le delai de lancement de `AnimationClip.duration` plutot que du constant historique de 2300 ms.
- Ne pas modifier les travaux paralleles sur la fille.

Timeline:
- 2026-07-16T15:10:55.911Z: plan created.
- 2026-07-16: donneur inspecte dans Blender, test cible rendu rouge puis implementation effectuee.
- 2026-07-16: source preservee et GLB regenere depuis les seuls fichiers du projet.
- 2026-07-16: suite complete, typecheck, build et preuve Browser passes.

Verification evidence:
- Blender 5.1.2: 1 mesh, 1 skin, 3 materiaux, 33 os, 5 clips, 13 562 polygones.
- `FoxSitToStand`: frames 1-74, 2.4667 s runtime, 102 canaux, bind delta 0.0000229 dans l'export final.
- `npm test`, `npm run typecheck`, `npm run build`: exit 0.
- Browser: `menuAnimation=sitting`, cinq lectures a 400 ms en `sitToStand`, puis `heroAnimation=standardRun`; logs warning/error vides.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Checker puis reponse finale |
| What is the goal? | Integrer le vrai relevage Fox avant la course |
| What have I learned? | Clip Mixamo compatible de 2.4667 s avec mouvement vertical intentionnel |
| What have I done? | Export, runtime, tests et preuve navigateur termines |

Open risks:
- Le build conserve l'avertissement Vite existant sur la taille du bundle; il n'est pas cause par cet asset.
