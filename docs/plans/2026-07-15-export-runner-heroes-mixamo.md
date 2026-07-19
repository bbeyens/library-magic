# export-runner-heroes-mixamo

Objective:
Exporter les deux heros bipedes du Runner en paquets FBX propres et acceptables par Mixamo, sans modifier les GLB runtime.

Goal plan:
docs/plans/2026-07-15-export-runner-heroes-mixamo.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: direct user request
- id / link: N/A
- title: Exporter les personnages Runner pour animation dans Mixamo
- acceptance criteria: boy et girl sont chacun livres en FBX non anime, avec texture, ZIP individuel et rapport de validation.

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
- initial confidence score: 88/100
- improvement loop: inspecter les GLB, exporter via Blender, reimporter et auditer les sorties
- final score / loop closure: 98/100; export, reimport, texture et ZIP verifies

Completion threshold:
- Les deux seuls skins jouables references par le Runner (`boy`, `girl`) ont chacun un FBX sans animation, une texture PNG et un ZIP individuel.
- Chaque FBX est reimporte par Blender sans erreur, contient un seul personnage visible et aucune animation embarquee.
- Les sources GLB et PNG runtime conservent leurs empreintes avant/apres.

Verification surface:
- Audit source de `RUNNER_HERO_ASSETS` et `tests/runnerHeroSkin.test.ts`.
- Rapport Blender de reimport avec nombre de meshes, armatures, animations, dimensions et fichiers.
- SHA-256 avant/apres des assets runtime.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/runnerThreeLane.ts`, `tests/runnerHeroSkin.test.ts`, `public/assets/runner/heroes/{boy,girl}.glb`.
- Allowed edit scope: nouveau dossier d'export sous `exports/runner-mixamo/`, script reproductible sous `scripts/`, ce plan.
- Browser surface: N/A, aucun comportement web ne change.
- Tracker sync: N/A.
- Non-goals: monstres Runner, envoi automatique sur Mixamo, choix ou telechargement d'animations Mixamo, modification des GLB runtime.

Current verdict:
- verdict: valid
- confidence: 98/100
- next owner: user pour televersement et choix des animations Mixamo
- reason: les deux paquets sont produits et verifies hors ligne; le televersement Mixamo reste volontairement manuel

Pre-solution issue challenge:
- reporter claim: les personnages utilises dans Runner doivent etre exportes pour Mixamo.
- suggested diagnosis or fix: convertir les deux GLB de heros en FBX non anime avec texture.
- repro ladder:
  - tests / source-level repro: N/A, pas un bug
  - repo-owned automated browser or integration proof: N/A, pas de comportement web modifie
  - Browser plugin: N/A, televersement Mixamo hors scope
  - screenshot / visual proof: apercus Blender rendus depuis chaque FBX reimporte
- reproduction verdict: N/A, demande d'asset et non bug.
- validity verdict: valid; le runtime reference exactement deux heros bipedes.
- best long-term fix boundary: export reproductible a partir des GLB runtime, sorties separees des assets du jeu.
- harsh honest feedback: exporter les monstres avec ce lot serait trompeur car Mixamo cible les humanoides bipedes.
- hard-stop decision: continuer; Blender local est disponible.

Blocked condition:
- Blender ne peut pas importer les GLB ou exporter/reimporter un FBX valide; sinon aucun blocage attendu.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-export-runner-heroes-mixamo.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Scope, deliverables et non-goals ci-dessus |
| Timed checkpoint parsed | N/A | Aucun temps demande |
| Active goal checked or created | yes | Goal actif cree avant export |
| Source of truth read before edits | yes | Renderer, test et script Unreal lus |
| Acceptance criteria captured | yes | Deux paquets Mixamo et audit de reimport |
| Pre-solution issue challenge required | N/A | Demande d'asset, pas un bug |
| Reproduction verdict before implementation | N/A | Demande d'asset |
| Repro escalation ladder selected | N/A | Pas de bug |
| Suggested fix reviewed against durable boundary | yes | Nouveau script et dossier d'export, sources preservees |
| TDD decision before behavior change or bug fix | N/A | Aucun comportement de jeu modifie |
| Browser proof decision for browser surface | N/A | Aucun changement navigateur |

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

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | 2/2 heros exportes; rapport `characterCount=expectedCharacterCount=2`; runtime inchange |
| Pre-solution issue challenge verdict | N/A | Demande d'asset, pas un bug | Verdict valid et limite humanoide enregistres |
| Repro escalation ladder | N/A | Pas de bug a reproduire | Toutes les marches marquees N/A avec raison |
| Bug reproduced before fix | N/A | Demande d'asset | N/A |
| Targeted behavior verification | yes | Exporter puis reimporter chaque FBX | Blender 5.1.2: 1 mesh, 43 os, 0 animation, texture presente pour boy et girl |
| TypeScript or typed config changed | N/A | Aucun fichier TypeScript change | N/A |
| Build-sensitive behavior changed | N/A | Assets runtime preserves et aucun code runtime change | SHA-256 avant/apres identiques |
| Browser surface changed | N/A | Aucun changement navigateur | N/A |
| Final lint/format | N/A | Script execute integralement par Blender sans erreur | Exit 0 |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Exports limites a boy/girl, originaux preserves, ZIP complets |
| Timed checkpoint | N/A | Aucun temps demande | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-export-runner-heroes-mixamo.md` | Checker executed after all other gates; final rerun is the closure proof |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Runner references exactly boy.glb and girl.glb; Blender 5.1.2 available | implementation |
| Implementation | completed | Script reproductible et deux paquets FBX/PNG/ZIP produits | verification |
| Verification | completed | Reimport Blender, apercus, empreintes et `unzip -t` valides | closeout |
| Closeout | completed | Dossier final et liens directs prepares | final response |

Findings:
- `RUNNER_HERO_ASSETS` reference exactement `boy.glb` et `girl.glb`.
- Les deux GLB contiennent deja un skin et une animation de course; l'export Mixamo doit retirer l'animation et fournir un FBX propre.
- La texture partagee runtime est `hero-basecolor.png`.

Decisions and tradeoffs:
- Exporter uniquement les deux heros jouables; les monstres non humanoides sont hors scope Mixamo.
- Conserver une armature si elle se reimporte proprement, mais retirer toutes les actions afin que Mixamo puisse recevoir un personnage canonique sans clip parasite.

Timeline:
- 2026-07-15T22:54:25.959Z: plan created.
- 2026-07-16: deux skins Runner identifies dans le renderer et les tests.
- 2026-07-16: script Blender ajoute et paquets boy/girl generes.
- 2026-07-16: chaque FBX reimporte avec 1 mesh, 43 os, 0 animation et texture embarquee.
- 2026-07-16: ZIP testes sans erreur; sources runtime confirmees inchangees.

Verification evidence:
- `exports/runner-mixamo/export-report.json`: 2/2 personnages, `runtimeAssetsUnchanged=true`.
- `file`: FBX Kaydara version 7400 pour boy et girl.
- `unzip -t`: aucune erreur dans les deux archives.
- Apercus: `boy/boy-mixamo-preview.png` et `girl/girl-mixamo-preview.png`, T-pose centree et texturee.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, closeout |
| What is the goal? | Exporter boy et girl en paquets FBX Mixamo valides |
| What have I learned? | Deux heros bipedes, texture partagee, GLB deja skinnes/animes |
| What have I done? | Exports, ZIP, apercus et rapport valides |

Open risks:
- Mixamo reste un service externe: l'acceptation finale du squelette ne peut etre prouvee sans televerser sur le compte utilisateur. Les FBX respectent toutefois le contrat hors ligne: T-pose, 43 os, skin, texture et aucun clip.
