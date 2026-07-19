# export-runner-demongirl-mixamo

Objective:
Exporter la Demongirl du Runner en FBX statique propre pour l'autorigger dans Mixamo.

Goal plan:
docs/plans/2026-07-16-export-runner-demongirl-mixamo.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: direct user request
- id / link: N/A
- title: Exporter le nouveau modele fille pour Mixamo
- acceptance criteria: FBX sans animation, 7 materiaux, ZIP, apercu et rapport de reimport; sources inchangees.

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
- initial confidence score: 82/100
- improvement loop: nettoyer le blend traite, exporter, reimporter, rendre et verifier l'archive
- final score / loop closure: 91/100; FBX, ZIP, apercu, manifeste et reimport valides. La seule incertitude restante appartient a l'autorigger externe Mixamo face a une silhouette sans bras visibles.

Completion threshold:
- `demongirl-mixamo.fbx` contient un mesh statique centre et au sol, 7 materiaux et aucune animation.
- Blender reimporte le FBX sans erreur et confirme les comptes attendus.
- ZIP, apercu et manifeste sont produits; source FBX, blend traite et GLB runtime restent inchanges.

Verification surface:
- Audit de `scripts/export-runner-demongirl.py`, son rapport et `tests/runnerHeroSkin.test.ts`.
- Export/reimport Blender 5.1.2, `file`, rendu PNG, empreintes SHA-256 et `unzip -t`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `exports/runner-demongirl/demongirl.blend`, source FBX et contrat runtime Demongirl.
- Allowed edit scope: nouveau script, `exports/runner-mixamo/demongirl/`, ce plan.
- Browser surface: N/A.
- Tracker sync: N/A.
- Non-goals: inventer des bras, rigger manuellement, televerser sur Mixamo, modifier le runtime ou ses animations.

Current verdict:
- verdict: partially valid
- confidence: 82/100
- next owner: task
- reason: l'export est faisable, mais la silhouette sans bras/mains distincts peut bloquer l'autorig Mixamo

Pre-solution issue challenge:
- reporter claim: le nouveau modele fille doit etre exporte comme le Fox pour Mixamo.
- suggested diagnosis or fix: exporter le mesh traite sans animations ni root runtime.
- repro ladder:
  - tests / source-level repro: N/A, demande de production d'asset et non bug.
  - repo-owned automated browser or integration proof: N/A, aucune surface navigateur modifiee.
  - Browser plugin: N/A, aucune surface navigateur modifiee.
  - screenshot / visual proof: rendu Blender 512x512 inspecte; personnage entier, centre et non coupe.
- reproduction verdict: N/A, demande d'asset.
- validity verdict: partiellement valid; le FBX peut etre prepare, mais il n'est pas un humanoide T-pose complet comme le Fox.
- best long-term fix boundary: livrer le mesh fidele et documenter la limite d'autorig; ne pas modifier silencieusement sa geometrie.
- harsh honest feedback: un export techniquement valide ne garantit pas Mixamo quand les poignets et coudes ne sont pas visibles.
- hard-stop decision: continuer avec un paquet d'autorig propre et un avertissement explicite.

Blocked condition:
- Le blend traite ne peut pas etre exporte/reimporte avec son mesh et ses 7 materiaux.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-export-runner-demongirl-mixamo.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Demongirl uniquement, livrables et limites captures |
| Timed checkpoint parsed | N/A | Aucun temps demande |
| Active goal checked or created | yes | Goal actif cree |
| Source of truth read before edits | yes | Script, rapport, blend et test runtime lus |
| Acceptance criteria captured | yes | FBX/ZIP/apercu, reimport et sources inchangees |
| Pre-solution issue challenge required | N/A | Demande d'asset |
| Reproduction verdict before implementation | N/A | Pas un bug |
| Repro escalation ladder selected | N/A | Pas un bug |
| Suggested fix reviewed against durable boundary | yes | Export depuis le blend traite, sans retoucher la geometrie |
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
| Named verification threshold | yes | Run the named proof or record blocker | Blender reimport: 1 mesh, 7 materiaux, 0 armature, 0 animation, min Z 0; ZIP valide |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Demande d'asset; limite Mixamo documentee avant export |
| Repro escalation ladder | N/A | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Aucun bug ni changement navigateur; rendu Blender inspecte |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Aucun bug affirme |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | FBX reimporte par Blender 5.1.2 et manifeste produit |
| TypeScript or typed config changed | N/A | Run relevant typecheck | Aucun TypeScript ou config typee modifie |
| Build-sensitive behavior changed | N/A | Run relevant build/check | Aucun asset runtime modifie; SHA-256 source/runtime inchanges |
| Browser surface changed | N/A | Capture browser proof | Aucun changement navigateur |
| Final lint/format | yes | Run relevant lint/format command or record N/A | Blender a execute le script Python avec code 0 |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Script, manifeste, archive et apercu revus; livrables conformes |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | Aucun temps demande |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-export-runner-demongirl-mixamo.md` | A executer apres cette mise a jour |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Demongirl statique identifiee; blend traite et limites Mixamo audites | implementation |
| Implementation | completed | `scripts/export-runner-demongirl-mixamo.py`; FBX statique, README, manifeste, apercu et ZIP produits | verification |
| Verification | completed | Reimport Blender, `file`, `unzip -t`, hashes proteges et inspection visuelle valides | closeout |
| Closeout | completed | Livrables localises et limite Mixamo documentee | final response |

Findings:
- La nouvelle fille est `Demongirl`, exportee dans `girl.glb` sans skin.
- Le blend traite contient un mesh de 42 999 sommets, 7 materiaux et trois animations de root seulement.
- La source n'a aucune armature et ne presente pas de bras/mains clairement separes pour les marqueurs Mixamo.

Decisions and tradeoffs:
- Exporter le mesh traite de 84 064 polygones plutot que la source de plus de 850 000 polygones.
- Retirer le root et ses clips, conserver les 7 materiaux et ne pas inventer de geometrie.

Timeline:
- 2026-07-16T13:21:54.528Z: plan created.

Verification evidence:
- Blender 5.1.2 exporte puis reimporte `demongirl-mixamo.fbx` avec code 0.
- Reimport: 1 mesh, 42 999 sommets, 84 064 polygones, 7 materiaux, 0 armature, 0 animation, min Z = 0.
- `file` reconnait un Kaydara FBX 7400 binaire et un PNG RGBA 512x512.
- `unzip -t exports/runner-mixamo/demongirl-mixamo.zip`: aucune erreur, 4 fichiers.
- SHA-256 du FBX source, du blend traite et du GLB runtime identiques avant/apres export.
- Apercu inspecte: silhouette entiere, centree et non coupee; absence de bras visibles confirmee.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout termine |
| Where am I going? | Reponse finale avec FBX et ZIP |
| What is the goal? | Exporter Demongirl en paquet propre pour l'autorig Mixamo |
| What have I learned? | Modele statique sans rig; 7 materiaux; silhouette potentiellement limitee pour Mixamo |
| What have I done? | Export, reimport, rendu, manifeste, archive et controles d'integrite termines |

Open risks:
- Mixamo peut refuser l'autorig a cause de l'absence de poignets/coudes distincts; seule une modification de geometrie resoudrait ce point.
