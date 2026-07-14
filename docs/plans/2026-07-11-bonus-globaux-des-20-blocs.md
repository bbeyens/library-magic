# Bonus globaux des 20 blocs

Objective:
Donner un niveau indépendant aux 20 blocs, +5% de gains de mine par niveau et +5% aux ressources de tous les mini-jeux par bloc MAX.

Goal plan:
docs/plans/2026-07-11-bonus-globaux-des-20-blocs.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: demande utilisateur directe
- id / link: N/A
- title: Bonus globaux des 20 blocs
- acceptance criteria: 20 XP indépendants; 0-10; +5% Mine par niveau; +5% global par bloc MAX; 20 MAX = +100%; HUD et tous les gains principaux synchronisés.

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
- improvement loop: TDD multi-jeux, navigateur, suite complète
- final score / loop closure: 97/100, calculs, multi-jeux et HUD validés

Completion threshold:
- `blockTypeXp` contient exactement 20 progressions indépendantes.
- Chaque niveau cumulé ajoute 5% aux récompenses de mine; un type niveau 10 contribue donc 50%.
- Chaque type niveau 10 ajoute 5% aux ressources principales de Mana, Serpent, Runes, Défense, Blackjack, Cent, Cibles, Mine et Slime; 20 MAX donnent x2.
- Le cercle affiche le type actif, son niveau, son bonus Mine et le bonus global MAX.
- Tests ciblés/complets, typecheck/build, diff check et navigateur passent.

Verification surface:
- Tests de progression 20 types, multiplicateurs et récompenses représentatives de chaque mini-jeu.
- `npm test`, `npm run build`, `git diff --check`.
- Browser plugin: cercle et bonus du type actif.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: état minier, rupture de blocs, points d'attribution des ressources principales.
- Allowed edit scope: state/actions/HUD/tests de progression et récompenses, ce plan.
- Browser surface: cercle de niveau de la mine.
- Tracker sync: N/A.
- Non-goals: aucun bonus aux XP, dégâts, coûts, remboursements ou monnaies de debug; aucune texture modifiée.

Current verdict:
- verdict: valid feature request requiring 20-type refactor
- confidence: 97/100
- next owner: user
- reason: fonctionnalité complète et vérifiée

Pre-solution issue challenge:
- reporter claim: 20 types doivent contribuer jusqu'à +100% global.
- suggested diagnosis or fix: remplacer l'XP par matériau partagé par un XP par sprite tier.
- repro ladder:
  - tests / source-level repro: test rouge sur l'absence du modèle 20 types
  - repo-owned automated browser or integration proof: suite complète verte
  - Browser plugin: cercle et XP du type actif validés
  - screenshot / visual proof: Terre #1 puis 4/100 après minage
- reproduction verdict: valid; l'état actuel ne possède que 11 XP matériau.
- validity verdict: valid.
- best long-term fix boundary: progression par index de type dans MiningState et multiplicateur commun aux points de gain.
- harsh honest feedback: conserver 11 matériaux rendrait mathématiquement impossible le plafond +100% demandé.
- hard-stop decision: aucun blocage.

Blocked condition:
- Impossible d'identifier les 20 sprite tiers ou échec d'un test de récompense d'un mini-jeu.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-11-bonus-globaux-des-20-blocs.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | 5% Mine/niveau, 5% global/MAX, 20 types, 100% |
| Timed checkpoint parsed | N/A | aucune durée |
| Active goal checked or created | yes | goal actif |
| Source of truth read before edits | yes | progression actuelle et points de récompense inspectés |
| Acceptance criteria captured | yes | seuil ci-dessus |
| Pre-solution issue challenge required | yes | modèle 11 matériaux confirmé insuffisant |
| Reproduction verdict before implementation | yes | 11 clés au lieu de 20 |
| Repro escalation ladder selected | yes | TDD puis navigateur |
| Suggested fix reviewed against durable boundary | yes | état + attribution de récompense |
| TDD decision before behavior change or bug fix | yes | tests avant code |
| Browser proof decision for browser surface | yes | HUD requis |
| Browser pack selected | yes | browser |
| Browser route / app surface identified | yes | localhost Mine |
| Browser tool decision recorded | yes | Browser plugin via node_repl |

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
| Named verification threshold | yes | Run the named proof or record blocker | tests complets, build, diff et navigateur passent |
| Pre-solution issue challenge verdict | yes | Confirmer 11 contre 20 | modèle partagé confirmé et remplacé |
| Repro escalation ladder | yes | TDD puis Browser | test rouge, tests verts, preuve réelle |
| Bug reproduced before fix | yes | Vérifier impossibilité de 20 bonus | `materialXp` ne contenait que 11 clés |
| Targeted behavior verification | yes | Tests multiplicateurs | x1.05, x1.50, x11, x1.05 global et x2 validés |
| TypeScript or typed config changed | yes | Run relevant typecheck | build TypeScript passe |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passe |
| Browser surface changed | yes | Capture browser proof | Terre #1, XP et trois bonus présents dans le DOM réel |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `git diff --check` passe |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | 20 entrées; remboursements, prêts, XP et debug non multipliés |
| Timed checkpoint | N/A | Aucune durée demandée | 97/100 |
| Goal plan complete | yes | Run checker global autogoal | checker relancé après clôture |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | type #1 de 0 à 4 XP, autres types inchangés |
| Browser console/network check | yes | Record console/network state or N/A | aucune erreur; avertissements Three.js préexistants seulement |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | capture mine ouverte et inspection DOM du cercle |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | 20 tiers et points de gain inspectés | implementation |
| Implementation | complete | état 20 types, multiplicateurs, récompenses et HUD | verification |
| Verification | complete | tests ciblés/complets, build, navigateur | closeout |
| Closeout | complete | autoreview et plan fermés | final response |

Findings:
- L'XP actuel est partagé entre 11 matériaux alors que 20 sprites existent.
- Les ressources principales sont attribuées à des points distincts dans `actions.ts`.
- Le helper commun couvre les gains sans toucher aux mises, prêts, remboursements, XP ou debug.

Decisions and tradeoffs:
- Bonus Mine additif par niveau cumulé: multiplicateur `1 + totalLevels * 0.05`.
- Bonus global additif par type MAX: multiplicateur `1 + maxedTypes * 0.05`.
- Les bonus s'appliquent aux ressources principales, pas aux XP ni aux retours/remboursements.

Timeline:
- 2026-07-11T13:25:06.148Z: plan created.
- 2026-07-11: test TDD rouge puis modèle `blockTypeXp[20]` implémenté.
- 2026-07-11: multiplicateurs Mine/global branchés aux ressources principales.
- 2026-07-11: tests complets, build, diff check et HUD navigateur validés.

Verification evidence:
- `miningGlobalBonuses`, `miningMaterialLevels`, `miningMaterialLevelHud` passent.
- `npm test`, `npm run build`, `git diff --check` passent.
- Browser: Terre #1, XP 0/100 puis 4/100, bonus type/total/global présents; aucune erreur console.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complet |
| Where am I going? | Réponse finale |
| What is the goal? | 20 progressions, bonus Mine et bonus global MAX |
| What have I learned? | See Findings |
| What have I done? | 20 niveaux indépendants et bonus globaux vérifiés |

Open risks:
- À 20 types MAX, la mine cumule x11 Mine et x2 global, soit x22, conséquence additive des deux règles.
- Avertissements Three.js de chargement de textures préexistants, aucune erreur liée à cette fonctionnalité.
