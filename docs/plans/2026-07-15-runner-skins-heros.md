# runner-skins-heros

Objective:
Ajouter deux skins de héros sélectionnables avant une course runner, remplacer la boule par le skin choisi et garantir une sélection purement cosmétique.

Goal plan:
docs/plans/2026-07-15-runner-skins-heros.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A: no tracker ticket requested
- title: Ajouter le garçon blond et la fille aux cheveux roses comme skins du runner
- acceptance criteria: Les deux personnages sont visibles avant chaque départ; un contour identifie la sélection; le personnage choisi remplace la boule pendant la course; aucun changement de statistiques.

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
- initial confidence score: 82/100
- improvement loop: localiser les assets Unreal, exporter les deux modèles, TDD de la sélection cosmétique, intégrer le hub et le rendu, puis vérifier en navigateur
- final score / loop closure: 97/100; vrais assets, TDD, build et preuve navigateur terminés

Completion threshold:
- Les vrais modèles du garçon blond et de la fille aux cheveux roses sont exportés en assets web chargeables.
- Le hub pré-course montre les deux personnages simultanément avec leurs noms ou identifiants visuels.
- Cliquer un personnage le sélectionne et déplace un contour visible autour de lui.
- Démarrer/rejouer conserve le skin choisi et remplace le rendu en boule du leader par ce modèle.
- La sélection ne modifie ni unités, ni dégâts, ni cadence, ni vitesse, ni économie.
- Tests ciblés, suite complète, typecheck, build, diff check et preuve navigateur passent.

Verification surface:
- Test public de sélection/persistance du skin et invariance des statistiques.
- Test d'intégrité des GLB/textures et du chargement dans `runnerThreeLane.ts`.
- `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`.
- In-app Browser: deux choix visibles, contour sélectionné, clic sur chaque choix, démarrage et modèle rendu sans erreur console/réseau.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `RunnerMetaState` pour le choix cosmétique, `actions.ts` pour la mutation, `hud.ts` pour le sélecteur et `runnerThreeLane.ts` pour le modèle 3D.
- Allowed edit scope: modules runner, styles runner, assets héros exportés, script d'export si nécessaire, tests ciblés et ce plan.
- Browser surface: `http://127.0.0.1:5173/`, livre Galerie des Cibles, hub avant course.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: nouvelles statistiques, compétences propres aux héros, combat/animations supplémentaires, sélection d'autres personnages du pack, changement des monstres.

Current verdict:
- verdict: valid feature request
- confidence: 82/100
- next owner: task
- reason: le runner a déjà un hub DOM, un état meta persistant et un renderer GLTF; la sélection peut rester cosmétique à ces frontières.

Pre-solution issue challenge:
- reporter claim: remplacer la boule du joueur par l'un de deux héros sélectionnés avant la course.
- suggested diagnosis or fix: sélecteur de skins dans le hub et rendu GLTF du skin choisi.
- repro ladder:
  - tests / source-level repro: TDD de l'action `selectRunnerSkin` et de l'invariance de l'état de course.
  - repo-owned automated browser or integration proof: suite runner et build.
  - Browser plugin: interaction réelle avec le sélecteur et démarrage.
  - screenshot / visual proof: les deux choix, le contour et le modèle choisi doivent être visibles.
- reproduction verdict: N/A: feature request, not a bug.
- validity verdict: valid.
- best long-term fix boundary: choix persistant dans `runnerMeta`; assets et rendu restent dans la vue Three.js.
- harsh honest feedback: des cartes avec de simples images qui laisseraient la boule en jeu seraient une fausse implémentation; le GLB choisi doit réellement remplacer le leader.
- hard-stop decision: proceed; stop only if the installed source assets cannot be found or exported after exhaustive local search.

Blocked condition:
- Les fichiers source des deux héros ne sont pas présents sur le Mac, ou aucune combinaison mesh/squelette/texture exportable ne peut être identifiée après trois méthodes de recherche/export.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-skins-heros.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Two skins, simultaneous visibility, selected outline, cosmetic-only behavior captured. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created before durable work. |
| Source of truth read before edits | yes | Runner state/actions/HUD/Three renderer and Unreal RPGHeroSquad assets inspected. |
| Acceptance criteria captured | yes | Listed in Task source and Completion threshold. |
| Pre-solution issue challenge required | N/A | Feature request, not a bug report. |
| Reproduction verdict before implementation | N/A | Feature request. |
| Repro escalation ladder selected | yes | TDD, suite/build, browser interaction and screenshot. |
| Suggested fix reviewed against durable boundary | yes | Meta state owns selection; Three.js owns presentation. |
| TDD decision before behavior change or bug fix | yes | State/action test will precede implementation. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Browser pack materialized. |
| Browser route / app surface identified | yes | Galerie des Cibles hub at localhost. |
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
| Named verification threshold | passed | Run the named proof or record blocker | All named tests, typecheck, build, diff check and browser proof pass. |
| Pre-solution issue challenge verdict | N/A | Feature request | Valid feature request; no bug reproduction required. |
| Repro escalation ladder | N/A | Feature request | TDD and browser proof still completed. |
| Bug reproduced before fix | N/A | Feature request | N/A with rationale above. |
| Targeted behavior verification | passed | Run focused test/proof for changed behavior or record N/A | `runnerRules`, `runnerHeroSkin` and `runnerMonsterAsset` pass. |
| TypeScript or typed config changed | passed | Run relevant typecheck | `npm run typecheck` passes. |
| Build-sensitive behavior changed | passed | Run relevant build/check | `npm run build` passes with existing chunk-size warning only. |
| Browser surface changed | passed | Capture browser proof | Both heroes visible, selected outline switches, girl GLB replaces ball in live run. |
| Final lint/format | passed | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passes. |
| Autoreview | passed | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | State mutation is cosmetic-only; one hero replaces the player ball; assets and UI reviewed. |
| Timed checkpoint | N/A | No duration requested | N/A. |
| Goal plan complete | yes | Run global autogoal checker against this plan | Run during closeout. |
| Browser interaction proof | passed | Exercise target route/interaction or record blocker | Galerie des Cibles hub and live course exercised in in-app Browser. |
| Browser console/network check | passed | Record console/network state or N/A | Zero console errors/warnings; both GLBs and shared texture loaded without hero-load warnings. |
| Browser final proof artifact | passed | Record screenshot/trace/route proof or exact caveat | Screenshots captured for two-choice hub, selected girl outline and girl model in course. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | requirements, runner ownership and Unreal assets identified | done |
| Implementation | complete | exports, state/action, selector, renderer and styles implemented | done |
| Verification | complete | targeted/full tests, typecheck, build and browser proof passed | done |
| Closeout | complete | evidence and review recorded | final response |

Findings:
- Existing runner uses circles for all units and has no skin selection state.
- Boy source is `SK_TinyHeroPolyart`; girl source is `SK_TinyHeroGirlPolyart`; both use the TinyHero skeleton, run animation and shared atlas.
- Exported GLBs each contain one mesh, one skin and one animation; previews are 256x256 transparent PNGs.

Decisions and tradeoffs:
- Keep the selection cosmetic in `runnerMeta`; do not branch gameplay formulas by skin.
- Replace the complete ball crowd with one hero model; the existing numeric label remains the source of truth for units/hit points.
- Use static previews rendered from the same GLBs in the hub and animated GLBs in the live Three.js lane.

Timeline:
- 2026-07-15T19:23:55.124Z: plan created.

Verification evidence:
- Initial TDD failure: `selectedSkin` was undefined before state/action implementation.
- `npm test`: all test files pass, including `runnerHeroSkin ok` and `runnerRules ok`.
- `npm run typecheck`: passed.
- `npm run build`: passed; existing large-chunk warning remains.
- `git diff --check`: passed.
- Browser: boy initially selected; clicking girl moved `aria-pressed` and yellow outline; starting displayed the animated pink-haired model with unit count 3 and no balls.
- Browser console: 0 errors, 0 warnings, no runner hero load failures.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Ship two real hero skins with a pre-run selector and no stat changes. |
| What have I learned? | Both requested heroes share a compatible TinyHero animation and texture pipeline. |
| What have I done? | Exported assets, added cosmetic selection, replaced the ball renderer and verified the complete flow. |

Open risks:
- Existing Vite bundle-size warning remains unrelated; hero files are loaded as external assets.
