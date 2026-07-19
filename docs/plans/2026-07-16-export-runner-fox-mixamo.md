# export-runner-fox-mixamo

Objective:
Exporter le Fox du Runner en FBX T-pose sans animation, texture et verifie pour Mixamo.

Goal plan:
docs/plans/2026-07-16-export-runner-fox-mixamo.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: direct user request
- id / link: N/A
- title: Exporter Fox pour Mixamo
- acceptance criteria: FBX, texture(s), ZIP et apercu produits; reimport Blender valide; sources inchangees.

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
- initial confidence score: 92/100
- improvement loop: inspecter la source, exporter, reimporter, rendre un apercu, tester le ZIP
- final score / loop closure: 99/100; export, reimport, materiaux, apercu et ZIP verifies

Completion threshold:
- `fox-mixamo.fbx` contient le Fox en T-pose avec skin/squelette et aucune animation.
- Le FBX est reimporte par Blender sans erreur, avec geometrie, os et trois materiaux preserves.
- Un ZIP autonome et un apercu sont produits; les empreintes des sources et du GLB runtime restent identiques.

Verification surface:
- Audit de `scripts/export-runner-fox.py`, `tests/runnerHeroSkin.test.ts` et `exports/runner-fox/fox-source.fbx`.
- Export/reimport Blender 5.1.2, rapport JSON, apercu PNG, `file` et `unzip -t`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `exports/runner-fox/fox-source.fbx` et le contrat runtime Fox dans `tests/runnerHeroSkin.test.ts`.
- Allowed edit scope: nouveau script d'export, `exports/runner-mixamo/fox/`, ce plan.
- Browser surface: N/A.
- Tracker sync: N/A.
- Non-goals: televerser sur Mixamo, choisir des clips, modifier le Fox runtime, boy/girl ou les monstres.

Current verdict:
- verdict: valid
- confidence: 92/100
- next owner: task
- reason: la source Fox FBX est presente et Blender local est disponible

Pre-solution issue challenge:
- reporter claim: le Fox utilise dans Runner doit etre exporte pour Mixamo.
- suggested diagnosis or fix: nettoyer le FBX source en T-pose et retirer ses sept actions.
- repro ladder:
  - tests / source-level repro: N/A, pas un bug
  - repo-owned automated browser or integration proof: N/A, aucun comportement runtime modifie
  - Browser plugin: N/A, televersement Mixamo hors scope
  - screenshot / visual proof: apercu Blender rendu depuis le FBX reimporte
- reproduction verdict: N/A, demande d'asset.
- validity verdict: valid; le Fox est le skin boy actuel et sa source est conservee.
- best long-term fix boundary: script reproductible separe de l'export runtime.
- harsh honest feedback: reutiliser le paquet boy precedent remplacerait les materiaux Fox par la texture du Tiny Hero; il faut un export specifique.
- hard-stop decision: continuer.

Blocked condition:
- Le FBX source ne peut pas etre importe ou le FBX nettoye ne peut pas etre reimporte avec son skin et ses materiaux.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-export-runner-fox-mixamo.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Fox uniquement, livrables et preservation captures |
| Timed checkpoint parsed | N/A | Aucun temps demande |
| Active goal checked or created | yes | Goal actif cree |
| Source of truth read before edits | yes | Export Fox existant, test runtime et fichiers audites |
| Acceptance criteria captured | yes | FBX/ZIP/apercu, reimport et sources inchangees |
| Pre-solution issue challenge required | N/A | Demande d'asset |
| Reproduction verdict before implementation | N/A | Pas un bug |
| Repro escalation ladder selected | N/A | Pas un bug |
| Suggested fix reviewed against durable boundary | yes | Export Fox specifique requis pour preserver ses materiaux |
| TDD decision before behavior change or bug fix | N/A | Aucun comportement runtime modifie |
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
| Named verification threshold | yes | Run the named proof or record blocker | Fox FBX, ZIP et apercu produits; sources inchangees |
| Pre-solution issue challenge verdict | N/A | Demande d'asset | Verdict valid et limite d'export enregistres |
| Repro escalation ladder | N/A | Pas de bug | Toutes les marches N/A avec raison |
| Bug reproduced before fix | N/A | Pas de bug | N/A |
| Targeted behavior verification | yes | Reimporter le FBX nettoye | Blender: 1 mesh, 33 os, 3 materiaux, 0 animation, pose REST separee |
| TypeScript or typed config changed | N/A | Aucun fichier TypeScript change | N/A |
| Build-sensitive behavior changed | N/A | Aucun code runtime change | Source FBX, blend et boy.glb ont les memes SHA-256 avant/apres |
| Browser surface changed | N/A | Aucun changement navigateur | N/A |
| Final lint/format | N/A | Script execute par Blender sans erreur | Exit 0 |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Export Fox specifique; aucun materiau invente; sources preservees |
| Timed checkpoint | N/A | Aucun temps demande | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-export-runner-fox-mixamo.md` | Checker execute apres toutes les autres portes; rerun final fait foi |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Fox identifie comme skin boy; source FBX et pipeline runtime lus | implementation |
| Implementation | completed | Script Fox Mixamo et paquet final produits | verification |
| Verification | completed | Reimport Blender, rendu, SHA-256 et `unzip -t` valides | closeout |
| Closeout | completed | Liens directs prepares | final response |

Findings:
- Le Fox est le skin `boy` actuel du Runner.
- `exports/runner-fox/fox-source.fbx` est la source preservee; elle contient un squelette Mixamo et les clips run/death/idle.
- Un export Fox specifique est necessaire pour conserver ses trois materiaux.

Decisions and tradeoffs:
- Partir du FBX source preserve plutot que du GLB runtime pour eviter une conversion supplementaire.
- Conserver le skin et le squelette Mixamo, supprimer tous les clips et forcer la pose REST.

Timeline:
- 2026-07-16T11:35:28.719Z: plan created.
- 2026-07-16: Fox confirme comme skin boy actuel; source FBX preservee localisee.
- 2026-07-16: FBX nettoye genere en pose REST avec 33 os, 3 materiaux et 0 clip.
- 2026-07-16: reimport Blender, apercu, ZIP et empreintes verifies.

Verification evidence:
- `exports/runner-mixamo/fox/manifest.json`: 1 mesh, 13 452 sommets, 33 os, 3 materiaux, 0 animation.
- `file`: Kaydara FBX version 7400.
- `unzip -t`: aucune erreur; manifeste archive confirme `protectedAssetsUnchanged=true`.
- `fox-mixamo-preview.png`: Fox centre, couleurs preservees et membres separes.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, closeout |
| What is the goal? | Exporter Fox en paquet Mixamo canonique sans animation |
| What have I learned? | Source Mixamo de 33 os, trois parties/materiaux et sept actions a retirer |
| What have I done? | FBX, ZIP, apercu et manifeste generes puis verifies |

Open risks:
- Mixamo est externe; l'acceptation finale ne sera pas testee sur le compte utilisateur dans cette tache.
