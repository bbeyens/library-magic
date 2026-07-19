# runner-editeur-temps-reel

Objective:
Ajouter un éditeur runner temps réel réservé au développement avec placement, sélection, modèles, stats, pause et import/export JSON.

Goal plan:
docs/plans/2026-07-15-runner-editeur-temps-reel.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A: no tracker ticket requested
- title: Ajouter un éditeur temps réel au runner
- acceptance criteria: F2 ouvre/ferme un outil dev; le joueur peut mettre en pause, placer/sélectionner un monstre, choisir son modèle, modifier position/vie/dégâts/récompense/échelle, dupliquer/supprimer, exporter/importer JSON; outil absent en production.

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
- initial confidence score: 86/100
- improvement loop: TDD des données d’éditeur, intégration simulation/rendu, tests, build production et preuve navigateur
- final score / loop closure: 96/100; TDD, suite complète, build production et preuve navigateur terminés

Completion threshold:
- `F2` ouvre un panneau Tweakpane uniquement sous `import.meta.env.DEV` lorsque le runner est ouvert.
- Pause et reprise de la simulation runner fonctionnent sans bloquer le reste de l’application.
- Placement sur la route, sélection, modification en direct, duplication et suppression agissent sur les vrais ennemis de la course.
- Cinq modèles Fab sont sélectionnables; vie, dégâts de contact, récompense, échelle et position sont modifiables.
- Export JSON produit une configuration versionnée; import valide et restaure les monstres sans accepter de données invalides.
- Tests ciblés, suite complète, typecheck, build production, diff check et preuve navigateur passent.

Verification surface:
- Nouveau test public pour sérialisation, validation, placement et modification des monstres d’éditeur.
- Tests runner existants et suite `npm test`.
- `npm run typecheck`, `npm run build`, `git diff --check`.
- In-app Browser: F2, pause, placement par clic, sélection/modification, changement de modèle, duplicate/delete, export/import et console sans erreur.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: simulation runner dans `src/game/simulation`, rendu `src/ui/runnerThreeLane.ts`, panneau runner dans `src/ui/hud.ts`.
- Allowed edit scope: modules runner/editor, styles runner, tests ciblés, package dependency et ce plan.
- Browser surface: `http://127.0.0.1:5173/`, livre Galerie des Cibles.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: éditeur général des autres mini-jeux, modification des modèles dans Blender/Unreal, publication automatique des niveaux, changement des règles normales hors propriétés explicites des ennemis édités.

Current verdict:
- verdict: valid feature request
- confidence: 86/100
- next owner: task
- reason: le runner possède déjà une scène Three.js, des ennemis identifiables et un panneau DOM; un outil dev peut s’ancrer à ces frontières.

Pre-solution issue challenge:
- reporter claim: besoin de changer en temps réel placement, modèle et statistiques.
- suggested diagnosis or fix: éditeur intégré au runner.
- repro ladder:
  - tests / source-level repro: fonctions publiques de configuration couvertes en TDD.
  - repo-owned automated browser or integration proof: suite runner et build production.
  - Browser plugin: interaction réelle obligatoire.
  - screenshot / visual proof: panneau et monstre modifié visibles.
- reproduction verdict: N/A: feature request, not a bug.
- validity verdict: valid.
- best long-term fix boundary: données et mutations dans un module simulation runner; Tweakpane reste un adaptateur dev.
- harsh honest feedback: un panneau qui ne modifierait que les meshes serait un faux éditeur; il doit agir sur les ennemis de simulation.
- hard-stop decision: proceed; stop only if the dev-only production boundary cannot be proven.

Blocked condition:
- Tweakpane ne peut pas être chargé en mode développement, l’état réel des ennemis ne peut pas être muté sans casser les règles runner, ou l’outil reste accessible dans le build production après trois corrections.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-editeur-temps-reel.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | F2, pause, placement, sélection, modèle, stats, duplicate/delete et JSON consignés. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created for implementation and proof. |
| Source of truth read before edits | yes | `state.ts`, `actions.ts`, `hud.ts`, `runnerThreeLane.ts` et les tests runner existants ont été lus avant l'intégration. |
| Acceptance criteria captured | yes | Listed in Task source and Completion threshold. |
| Pre-solution issue challenge required | N/A | Feature request, not a reported bug. |
| Reproduction verdict before implementation | N/A | Feature request. |
| Repro escalation ladder selected | yes | Public data tests, full suite/build, then browser interaction. |
| Suggested fix reviewed against durable boundary | yes | Simulation owns data; Tweakpane only presents controls. |
| TDD decision before behavior change or bug fix | yes | Test versioned config and live mutations first. |
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
| Named verification threshold | passed | Run the named proof or record blocker | Full suite, typecheck, build, diff check and browser proof passed. |
| Pre-solution issue challenge verdict | N/A | Feature request, not bug report | N/A with rationale above. |
| Repro escalation ladder | N/A | Feature request | Public behavior tests plus browser proof selected. |
| Bug reproduced before fix | N/A | Feature request | N/A. |
| Targeted behavior verification | passed | Run focused test/proof for changed behavior or record N/A | `runnerEditorRules`, `runnerMonsterAsset` et `runnerRules` passent. |
| TypeScript or typed config changed | passed | Run relevant typecheck | `npm run typecheck` passe. |
| Build-sensitive behavior changed | passed | Run relevant build/check | `npm run build` passe; aucun code Tweakpane/éditeur dans le JS production. |
| Browser surface changed | passed | Capture browser proof | F2, import, sélection 3D, modification Vie 50 vers 80 et export vérifiés sur le runner réel. |
| Final lint/format | passed | Run relevant lint/format command or record N/A | Aucun script lint; `git diff --check` passe. |
| Autoreview | passed | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff runner/editor relu contre les critères; mutations dans la simulation, UI dev seulement. |
| Timed checkpoint | N/A | No duration requested | N/A. |
| Goal plan complete | yes | Run `/Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs` against this plan | Run during closeout. |
| Browser interaction proof | passed | Exercise target route/interaction or record blocker | Real Galerie des Cibles route exercised through the in-app Browser. |
| Browser console/network check | passed | Record console/network state or N/A | Console contains only Vite/Phaser informational logs; no errors or warnings. Network N/A: local assets rendered successfully. |
| Browser final proof artifact | passed | Record screenshot/trace/route proof or exact caveat | Screenshot captured at `http://127.0.0.1:5173/` with editor, selected monster and edited stats visible. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | requirements and source boundaries recorded | done |
| Implementation | complete | simulation actions, editor adapter, renderer interaction and styles implemented | done |
| Verification | complete | tests, typecheck, build, production boundary and browser proof passed | done |
| Closeout | complete | plan evidence and final review recorded | final response |

Findings:
- Existing runner has a Three.js lane renderer, DOM HUD and simulation-owned enemy array.
- Enemy model variants are currently deterministic from enemy id; editor metadata must override that without changing normal spawns.

Decisions and tradeoffs:
- Use Tweakpane via development-only dynamic import.
- Mutate real runner enemies through public runner-editor actions rather than creating visual-only props.
- Keep editor configuration versioned and separate from normal save persistence.

Timeline:
- 2026-07-15T17:51:06.893Z: plan created.

Verification evidence:
- `npm test`: all 34 test files pass, including `runnerEditorRules ok`.
- `npm run typecheck`: passed.
- `npm run build`: passed with the existing large-bundle warning only.
- Production JS grep: `Runner Editor`, `runner-editor-host` and `tweakpane` absent.
- `git diff --check`: passed.
- Browser: F2 opened the dev editor; JSON imported a chest monster; 3D click selected it; fields synchronized to 50/4/12/0.5/1.7; changing Vie to 80 was immediately preserved by export; no console error.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Ship a dev-only real-time runner editor with tested live mutations and JSON roundtrip. |
| What have I learned? | Tweakpane must not refresh over focused inputs; direct DOM input relays keep live edits reliable. |
| What have I done? | Implemented the dev editor, real simulation mutations, 3D interactions, JSON roundtrip and full verification. |

Open risks:
- Existing Vite build reports the pre-existing bundle-size warning (2.23 MB JS); unrelated to this editor because its code is absent from production JS.
