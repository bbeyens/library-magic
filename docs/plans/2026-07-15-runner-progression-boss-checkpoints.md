# runner-progression-boss-checkpoints

Objective:
Ajouter au Runner les PV ennemis x2 tous les 100 m depuis 5 PV, un boss provisoire tous les 100 m et des checkpoints sélectionnables débloqués tous les 500 m.

Goal plan:
docs/plans/2026-07-15-runner-progression-boss-checkpoints.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: demande utilisateur locale
- id / link: conversation, sans ticket
- title: progression forte, boss et checkpoints du Runner
- acceptance criteria: PV 5/10/20/40 aux distances 0/100/200/300; boss aux multiples de 100 m; checkpoint sélectionnable par multiples de 500 m atteints au record.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: terminer après règles déterministes, UI réelle et suite complète
- initial confidence score: 87/100
- improvement loop: TDD règles pures, état/spawn, menu, tests complets, navigateur
- final score / loop closure: 97/100; règles, spawn, menu, suite complète, build et navigateur validés.

Completion threshold:
- `runnerEnemyHealth` retourne exactement 5 à 0/99 m, 10 à 100 m, 20 à 200 m et 40 à 300 m.
- Un boss provisoire distinct est créé à chaque multiple de 100 m, une seule fois, avec un modèle existant remplaçable plus tard.
- Les checkpoints proposés sont `0` plus chaque multiple de 500 inférieur ou égal au record; le checkpoint sélectionné persiste et initialise la distance de la prochaine course.
- Au départ d'un checkpoint, le prochain boss est le multiple de 100 strictement suivant et les portes reprennent devant le joueur.
- Tests ciblés, suite complète, typecheck, build et preuve navigateur passent.

Verification surface:
- `tests/runnerRules.test.ts`, `tests/runnerMenuScene.test.ts`, `npm test`, typecheck, build, diff check.
- Menu Runner réel sur `http://127.0.0.1:5173/`, sélection de checkpoint et démarrage de course.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: règles dans `runnerRules.ts`, état dans `state.ts`, spawn/reset dans `actions.ts`, menu dans `hud.ts`.
- Allowed edit scope: modules Runner, tests Runner et styles du sélecteur.
- Browser surface: menu du livre Runner puis course 3D.
- Tracker sync: N/A.
- Non-goals: créer l'asset final du boss, modifier les autres mini-jeux, changer les compétences ou l'économie générale.

Current verdict:
- verdict: valid
- confidence: 97/100
- next owner: task
- reason: la santé actuelle croît linéairement depuis 1 PV et aucun état boss/checkpoint n'existe.

Pre-solution issue challenge:
- reporter claim: progression de PV forte, boss tous les 100 m, choix de checkpoint tous les 500 m.
- suggested diagnosis or fix: formule exponentielle, curseur `nextBossDistance`, checkpoint persistant dérivé du record.
- repro ladder:
  - tests / source-level repro: tests rouges à ajouter pour la formule, le boss et le checkpoint.
  - repo-owned automated browser or integration proof: tests statiques du menu plus simulation.
  - Browser plugin: menu et départ réel à vérifier après implementation.
  - screenshot / visual proof: capture du sélecteur dans le menu.
- reproduction verdict: N/A, nouvelle fonctionnalité; l'absence est confirmée dans la source.
- validity verdict: valid.
- best long-term fix boundary: règles pures pour les paliers, état persistant pour le choix, spawn dédié pour le boss.
- harsh honest feedback: coder les distances en conditions dispersées rendrait les futurs assets et équilibrages pénibles; les paliers doivent avoir une source unique.
- hard-stop decision: continuer avec le boss visuel provisoire explicitement remplaçable.

Blocked condition:
- L'asset final du boss n'est pas requis maintenant; bloqué seulement si le menu existant ne peut pas accueillir un sélecteur sans casser la scène 3D.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-progression-boss-checkpoints.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | paliers PV, boss 100 m, checkpoints 500 m |
| Timed checkpoint parsed | yes | aucune durée demandée |
| Active goal checked or created | yes | objectif actif créé |
| Source of truth read before edits | yes | règles, état, spawn et menu lus |
| Acceptance criteria captured | yes | seuil ci-dessus |
| Pre-solution issue challenge required | N/A | fonctionnalité nouvelle, absence confirmée |
| Reproduction verdict before implementation | N/A | tests rouges de contrat requis |
| Repro escalation ladder selected | yes | règles pures, simulation, menu statique, navigateur |
| Suggested fix reviewed against durable boundary | yes | règles et curseurs centralisés |
| TDD decision before behavior change or bug fix | yes | tests rouges avant code |
| Browser proof decision for browser surface | yes | sélection réelle requise |
| Browser pack selected | yes | pack browser appliqué |
| Browser route / app surface identified | yes | livre Runner sur localhost |
| Browser tool decision recorded | yes | navigateur intégré du dépôt |

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
| Named verification threshold | yes | Run the named proof or record blocker | ciblés, suite, typecheck, build et navigateur passent |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | fonctionnalité nouvelle; absence source confirmée |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | tests rouges puis règles/simulation/menu/navigateur verts |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | fonctionnalité absente, contrats rouges enregistrés |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerRules`, `runnerMenuScene`, `runnerMonsterAsset` verts |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` exit 0 |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` exit 0 |
| Browser surface changed | yes | Capture browser proof | sélecteur visible puis Run démarre la scène 3D |
| Final lint/format | yes | Run relevant lint/format command or record N/A | aucun script lint; `git diff --check` exit 0 |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | règles centralisées, curseurs sans duplication, choix validé par record, aucun autre jeu changé |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | aucune durée demandée |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-progression-boss-checkpoints.md` | commande finale après cette mise à jour |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | bibliothèque -> Runner -> checkpoint -> Run |
| Browser console/network check | yes | Record console/network state or N/A | aucun error/warning; aucun nouvel asset réseau |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | capture menu avec combobox et capture course démarrée |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | règles, état, spawn, rendu et menu lus | implementation |
| Implementation | completed | progression, boss, checkpoints et sélecteur intégrés | verification |
| Verification | completed | tests, typecheck, build, diff check et navigateur verts | closeout |
| Closeout | completed | autoreview et plan finalisés | final response |

Findings:
- Santé actuelle: `1 + floor(distance / 55)`, donc ni 5 PV au départ ni doublement par 100 m.
- Aucun champ boss, aucun curseur de boss et aucun checkpoint persistant n'existent.
- Le menu Runner est une couche DOM transparente au-dessus de la scène 3D et peut accueillir un `<select>` compact.
- Tests rouges: exports de règles checkpoint/boss absents et markup `data-runner-checkpoint` absent.

Decisions and tradeoffs:
- Formule: `5 * 2^floor(distance / 100)` avec distance bornée à zéro.
- Boss provisoire: monstre existant agrandi, marqué `isBoss`, santé et récompense multipliées; l'asset final pourra être branché via ce marqueur.
- Checkpoint disponible selon `bestDistance`, sélection persistante, prochain boss strictement après le point de départ.

Timeline:
- 2026-07-15T22:45:32.222Z: plan created.
- 2026-07-16: contrats TDD ajoutés; règles Runner et test menu échouent avant implementation comme attendu.
- 2026-07-16: formule x2, état checkpoint, curseur/spawn boss et sélecteur menu implémentés.
- 2026-07-16: tests ciblés, suite complète, typecheck, build et diff check passent.
- 2026-07-16: navigateur réel confirme la combobox checkpoint, le démarrage et une console propre.

Verification evidence:
- `npx tsx tests/runnerRules.test.ts`: paliers, boss unique, checkpoints et curseurs passent.
- `npx tsx tests/runnerMenuScene.test.ts`: sélecteur checkpoint présent.
- `npx tsx tests/runnerMonsterAsset.test.ts`: distinction visuelle boss présente.
- `npm test`: toutes les suites passent.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0; avertissement existant de taille du bundle uniquement.
- `git diff --check`: exit 0.
- Navigateur intégré: option `0 m` visible avec record inférieur à 500 m, Run démarre, aucun log error/warning.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout terminé |
| Where am I going? | Réponse finale |
| What is the goal? | Progression x2, boss 100 m et checkpoints 500 m dans le Runner |
| What have I learned? | See Findings |
| What have I done? | Progression, boss et checkpoints implémentés et vérifiés |

Open risks:
- La force exacte du boss n'est pas spécifiée; un multiplicateur provisoire explicite sera isolé dans les règles pour être ajusté sans toucher au spawn.
- L'asset final reste à fournir; le marqueur `isBoss` et le spawn dédié rendent son remplacement local au renderer.
