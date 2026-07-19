# runner-degats-contact-selon-pv

Objective:
Faire perdre au joueur exactement les PV restants d'un ennemi lorsqu'il atteint l'équipe dans le Runner, avec une régression ciblée et une vérification complète.

Goal plan:
docs/plans/2026-07-15-runner-degats-contact-selon-pv.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: demande utilisateur locale
- id / link: conversation, sans ticket
- title: dégâts de contact égaux aux PV ennemis restants
- acceptance criteria: à l'impact, `runner.units` diminue directement de `enemy.health`; un ennemi partiellement blessé retire seulement ses PV restants; mort et banque de pièces restent inchangées.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: terminer après tests ciblés et suite complète
- initial confidence score: 96/100
- improvement loop: test rouge, changement minimal dans `advanceRunnerEnemies`, vérification complète
- final score / loop closure: 99/100; test rouge puis vert, suite complète, typecheck, build et diff check passent.

Completion threshold:
- Un test prouve qu'un ennemi avec 4 PV retire 4 unités même si son ancien `contactDamage` vaut 1.
- Un ennemi blessé retire ses PV actuels, pas ses PV maximums.
- Le comportement de mort continue de borner les unités à zéro et de terminer la partie.
- `npx tsx tests/runnerRules.test.ts`, `npm test`, `npm run typecheck` et `npm run build` passent.

Verification surface:
- `tests/runnerRules.test.ts`, suite complète, typecheck, build et `git diff --check`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: branche de contact de `advanceRunnerEnemies`.
- Allowed edit scope: `src/game/simulation/actions.ts` et `tests/runnerRules.test.ts`.
- Browser surface: N/A, règle de simulation sans nouveau rendu.
- Tracker sync: N/A.
- Non-goals: changer les PV, vitesses, récompenses, tirs, modèles, éditeur ou autres mini-jeux.

Current verdict:
- verdict: valid
- confidence: 99/100
- next owner: task
- reason: la source retire actuellement `contactDamage ?? 1`, contrairement à la règle demandée.

Pre-solution issue challenge:
- reporter claim: la perte doit être égale aux PV que l'ennemi possède au contact.
- suggested diagnosis or fix: remplacer la soustraction de `contactDamage` par celle de `enemy.health`.
- repro ladder:
  - tests / source-level repro: test déterministe à ajouter avant le correctif.
  - repo-owned automated browser or integration proof: N/A, la simulation pure est la preuve plus précise.
  - Browser plugin: N/A, aucun changement visuel.
  - screenshot / visual proof: N/A, une capture ne prouve pas la valeur soustraite de façon fiable.
- reproduction verdict: valid; test rouge obtenu avec 9 unités restantes au lieu de 6.
- validity verdict: valid.
- best long-term fix boundary: la branche unique où un ennemi atteint l'équipe.
- harsh honest feedback: conserver `contactDamage` comme règle active contredirait directement la demande; un patch UI serait au mauvais endroit.
- hard-stop decision: continuer avec TDD.

Blocked condition:
- Bloqué seulement si le test ne peut pas reproduire l'ancienne soustraction fixe ou si la suite révèle un contrat contradictoire.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-degats-contact-selon-pv.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | soustraction directe des PV restants |
| Timed checkpoint parsed | yes | aucune durée demandée |
| Active goal checked or created | yes | objectif actif créé |
| Source of truth read before edits | yes | `advanceRunnerEnemies` lu |
| Acceptance criteria captured | yes | seuil ci-dessus |
| Pre-solution issue challenge required | yes | règle actuelle confirmée dans la source |
| Reproduction verdict before implementation | yes | test rouge: 9 unités au lieu de 6 |
| Repro escalation ladder selected | yes | simulation déterministe suffisante |
| Suggested fix reviewed against durable boundary | yes | branche de contact unique |
| TDD decision before behavior change or bug fix | yes | test rouge avant code |
| Browser proof decision for browser surface | N/A | aucun rendu changé; preuve simulation plus exacte |

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
| Named verification threshold | yes | Run the named proof or record blocker | ciblé, suite complète, typecheck et build passent |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | règle actuelle confirmée et verdict valid enregistré |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | test simulation rouge puis vert; navigateur N/A justifié |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | 9 unités obtenues au lieu de 6 |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerRules ok`, 10 - 4 = 6 |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` exit 0 |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` exit 0 |
| Browser surface changed | N/A | Capture browser proof | aucune interface ni rendu modifié |
| Final lint/format | yes | Run relevant lint/format command or record N/A | aucun script lint; `git diff --check` exit 0 |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | une soustraction changée à la source et un test dédié; aucun autre comportement modifié |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | aucune durée demandée |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-degats-contact-selon-pv.md` | commande finale après mise à jour du plan |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | règle actuelle et contrat lus | implementation |
| Implementation | completed | soustraction directe de `enemy.health` | verification |
| Verification | completed | tests, typecheck, build et diff check verts | closeout |
| Closeout | completed | autoreview et plan finalisés | final response |

Findings:
- `advanceRunnerEnemies` retire actuellement `enemy.contactDamage ?? 1`; `enemy.health` n'est pas utilisé au contact.
- Le test ciblé échoue exactement comme prévu: un ennemi à 4 PV avec `contactDamage: 1` ne retire qu'une unité.

Decisions and tradeoffs:
- Utiliser les PV actuels au moment du contact, pas `maxHealth`, afin que les dégâts infligés avant l'impact réduisent directement la perte.
- Conserver le champ `contactDamage` dans les configurations existantes pour compatibilité, mais ne plus l'utiliser dans cette règle.

Timeline:
- 2026-07-15T22:36:54.517Z: plan created.
- 2026-07-16: test TDD rouge, résultat actuel 9 unités contre 6 attendues.
- 2026-07-16: soustraction changée vers les PV restants; test ciblé vert.
- 2026-07-16: suite complète, typecheck, build et diff check passent.

Verification evidence:
- `npx tsx tests/runnerRules.test.ts`: `runnerRules ok`.
- `npm test`: toutes les suites passent.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0; seul l'avertissement existant de taille du bundle reste.
- `git diff --check`: exit 0.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout terminé |
| Where am I going? | Réponse finale |
| What is the goal? | Perdre exactement les PV restants de l'ennemi au contact |
| What have I learned? | See Findings |
| What have I done? | Règle implémentée et vérifiée; voir Timeline |

Open risks:
- Les PV peuvent être fractionnaires après un tir; la demande de soustraction directe implique que les unités peuvent aussi devenir fractionnaires tant qu'elles restent positives.
