# runner-tirs-bloques-invisibles

Objective:
Corriger les tirs du runner absorbés avant d'atteindre les ennemis par des collisions sans obstacle visible, avec une régression déterministe et une preuve dans le jeu local.

Goal plan:
docs/plans/2026-07-15-runner-tirs-bloques-invisibles.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user bug report
- id / link: conversation locale, sans ticket
- title: tirs du runner bloqués par des obstacles invisibles
- acceptance criteria: les tirs ne disparaissent plus sur une entité sans représentation visible; les portes actives et ennemis visibles gardent leurs collisions; aucun autre mini-jeu ne change.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A, aucune durée demandée
- semantics: terminer après preuve déterministe et navigateur
- initial confidence score: 72/100
- improvement loop: reproduire, isoler l'entité consommatrice, corriger la source de vérité, tester puis jouer
- final score / loop closure: 97/100; repro rouge, correctif vert, suite complète, build et navigateur validés.

Completion threshold:
- Un test ciblé reproduit le tir absorbé par une entité non visible avant correction et passe après correction.
- Les collisions contre les portes non activées et les ennemis rendus restent couvertes.
- `npm test`, `npm run typecheck` et `npm run build` passent.
- Le runner réel est lancé dans le navigateur et sa console ne montre pas d'erreur liée au correctif.

Verification surface:
- `npx tsx tests/runnerRules.test.ts`, `npm test`, `npm run typecheck`, `npm run build`.
- Inspection du runner sur `http://127.0.0.1:5173/` avec le navigateur intégré, capture et console.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `advanceRunnerBullets` et la cohérence état simulation/rendu des ennemis et portes.
- Allowed edit scope: logique runner dans `src/game/simulation/actions.ts`, types/règles runner si nécessaire, et `tests/runnerRules.test.ts`.
- Browser surface: panneau du livre Runner, menu puis partie 3D.
- Tracker sync: N/A, aucun ticket demandé.
- Non-goals: terrain, modèles, stats, économie, menu, éditeur et autres mini-jeux.

Current verdict:
- verdict: valid
- confidence: 90/100
- next owner: task
- reason: le test ciblé prouve qu'un ennemi réduit conserve le rayon fixe et absorbe un tir hors du modèle visible.

Pre-solution issue challenge:
- reporter claim: des tirs sont absorbés par des blocs invisibles et n'atteignent pas les ennemis.
- suggested diagnosis or fix: suspicion initiale d'une porte activée ou d'une entité invisible; le repro minimal cible l'écart collider/modèle des ennemis redimensionnés.
- repro ladder:
  - tests / source-level repro: `npx tsx tests/runnerRules.test.ts` échoue avec santé 5 au lieu de 9 quand le tir passe hors du modèle à échelle 0,25.
  - repo-owned automated browser or integration proof: N/A, aucune suite E2E dédiée; preuve navigateur réelle prévue après correction.
  - Browser plugin: partie réelle lancée et terrain/modèles observés; preuve finale après correction.
  - screenshot / visual proof: capture avant correction montrant le runner 3D réel, preuve finale à enregistrer.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: calculer le rayon de collision depuis la même échelle que le rendu dans `advanceRunnerBullets`.
- harsh honest feedback: une échelle purement visuelle avec un collider fixe crée exactement des impacts dans le vide; le corriger ailleurs ne ferait que masquer le désaccord.
- hard-stop decision: continuer, le bug est reproduit avant implementation.

Blocked condition:
- Bloqué seulement si le serveur local et le navigateur intégré sont tous deux indisponibles après relance; les tests source restent obligatoires.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-tirs-bloques-invisibles.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | tir non absorbé par obstacle invisible; aucun autre jeu modifié |
| Timed checkpoint parsed | yes | aucune durée demandée |
| Active goal checked or created | yes | objectif actif créé |
| Source of truth read before edits | yes | `advanceRunnerBullets`, spawn/cull et rendu portes/ennemis lus |
| Acceptance criteria captured | yes | seuil et limites ci-dessus |
| Pre-solution issue challenge required | yes | bug report challenge ci-dessus |
| Reproduction verdict before implementation | yes | test rouge exact enregistré |
| Repro escalation ladder selected | yes | test source puis navigateur réel |
| Suggested fix reviewed against durable boundary | yes | rayon de collision dans la simulation, pas patch rendu |
| TDD decision before behavior change or bug fix | yes | test déterministe rouge requis avant correctif |
| Browser proof decision for browser surface | yes | preuve réelle requise après tests |
| Browser pack selected | yes | pack browser appliqué |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, livre Runner |
| Browser tool decision recorded | yes | navigateur intégré approuvé par le dépôt |

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
| Named verification threshold | yes | Run the named proof or record blocker | ciblé, suite complète, typecheck, build et navigateur passent |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | verdict `valid` enregistré avant implementation |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | test rouge puis partie réelle et capture |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | santé 5 au lieu de 9 pour le tir hors modèle réduit |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerRules ok`, petit modèle ignoré et grand modèle touché |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` exit 0 |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` exit 0 |
| Browser surface changed | yes | Capture browser proof | partie Runner 3D démarrée après rechargement |
| Final lint/format | yes | Run relevant lint/format command or record N/A | aucun script lint; `git diff --check` exit 0 |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | revue du hunk collider et des deux régressions; aucun changement hors runner ajouté |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | aucune durée demandée |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-tirs-bloques-invisibles.md` | commande finale planifiée après cette mise à jour |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | bibliothèque -> livre Runner -> Run -> partie 3D visible |
| Browser console/network check | yes | Record console/network state or N/A | console erreurs/avertissements vide; réseau N/A, aucun asset modifié |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | capture du runner en partie après correctif |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | source collision/rendu inspectée et repro rouge | implementation |
| Implementation | completed | rayon multiplié par `enemy.scale` sur X et Z | verification |
| Verification | completed | tests, typecheck, build, browser et console verts | closeout |
| Closeout | completed | autoreview et plan finalisés | final response |

Findings:
- Repro rouge: un ennemi `scale: 0.25` est visuellement réduit mais `advanceRunnerBullets` utilise toujours `RUNNER_HIT_RADIUS` sur X et Z; un tir à 0,4 unité est consommé dans l'espace vide.
- Les portes activées sont déjà exclues des collisions; les collisions balayées et la priorité de la cible la plus proche sont déjà testées.

Decisions and tradeoffs:
- Appliquer l'échelle du monstre au rayon sur X et Z; conserver exactement le rayon actuel pour tous les ennemis de taille 1.
- Ne pas changer la portée des tirs: c'est une statistique distincte et aucune preuve ne la relie à la collision invisible reproduite.

Timeline:
- 2026-07-15T22:14:56.917Z: plan created.
- 2026-07-16: test TDD rouge reproduit le collider invisible d'un ennemi réduit.
- 2026-07-16: collision ennemie synchronisée avec l'échelle visuelle; tests petit et grand modèles verts.
- 2026-07-16: `npm test`, typecheck, build, diff check et partie Runner navigateur passent; console propre.

Verification evidence:
- `npx tsx tests/runnerRules.test.ts`: `runnerRules ok`.
- `npm test`: toutes les suites passent, y compris les autres mini-jeux.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0; avertissement Rollup existant sur la taille du bundle uniquement.
- `git diff --check`: exit 0.
- Navigateur intégré: Runner ouvert puis Run lancé; terrain, héros, ennemi et porte rendus; aucun log error/warning.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout terminé |
| Where am I going? | Réponse finale |
| What is the goal? | Supprimer les collisions invisibles des tirs du runner sans changer les autres jeux |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Les modèles de même échelle peuvent avoir des silhouettes différentes; le rayon suit maintenant l'échelle globale, pas la géométrie exacte de chaque GLB. C'est cohérent avec le moteur de collision simple actuel.
