# Economie des skills de mine

Objective:
Faire payer les compétences avec les ressources visibles du compteur de mine, réduire leurs coûts et vérifier un achat réel sans consommation de mana.

Goal plan:
docs/plans/2026-07-11-economie-des-skills-de-mine.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: demande utilisateur directe
- id / link: N/A
- title: Economie des skills de mine
- acceptance criteria: achats débitent le total `state.mining.materials`; le mana et les minerais globaux restent intacts; prix réduits; icône et libellé Ressources; états achetables synchronisés.

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
- initial confidence score: 94/100
- improvement loop: TDD, navigateur, suite complète
- final score / loop closure: 98/100, achat réel et suite complète validés

Completion threshold:
- Les dix compétences minières utilisent exclusivement le total visible de `state.mining.materials`.
- Les coûts de départ sont réduits à 10-120 ressources et leur croissance est plus faible.
- Le dock affiche l'icône minière, le texte Ressources et se réactive lorsque le compteur augmente.
- Tests ciblés, tests complets, typecheck/build, diff check et achat navigateur passent.

Verification surface:
- Nouveau test d'économie minière et test statique HUD.
- `npm test`, `npm run build`, `git diff --check`.
- Browser plugin sur localhost: compteur 15 vers 5 lors de l'achat Pickaxe +; mana inchangé.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `miningSkillCost`, `buyMiningSkill`, cartes du dock minier.
- Allowed edit scope: règles/actions/HUD/tests de la mine et ce plan.
- Browser surface: dock des compétences de la mine.
- Tracker sync: N/A.
- Non-goals: aucun changement aux économies des autres mini-jeux, textures, niveaux de blocs ou effets de skills.

Current verdict:
- verdict: valid feature request
- confidence: 98/100
- next owner: user
- reason: économie implémentée et vérifiée

Pre-solution issue challenge:
- reporter claim: les skills utilisent la mauvaise ressource et coûtent trop cher.
- suggested diagnosis or fix: remplacer mana par minerais et réduire la courbe.
- repro ladder:
  - tests / source-level repro: test rouge sur coût 70 et débit mana, puis vert
  - repo-owned automated browser or integration proof: suite complète verte
  - Browser plugin: achat réel validé
  - screenshot / visual proof: compteur 15 puis 5, dégâts 1 puis 2
- reproduction verdict: valid, `buyMiningSkill` et le HUD lisent actuellement `state.mana`.
- validity verdict: valid.
- best long-term fix boundary: règles d'achat sur `mining.materials` et snapshots du dock, pas un correctif visuel seul.
- harsh honest feedback: changer seulement l'icône laisserait une économie fausse.
- hard-stop decision: aucun blocage.

Blocked condition:
- Impossible d'ouvrir le dock de mine ou échec des tests de débit de ressource.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-11-economie-des-skills-de-mine.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | ressource mine + coûts réduits |
| Timed checkpoint parsed | N/A | aucune durée |
| Active goal checked or created | yes | goal actif |
| Source of truth read before edits | yes | coût, achat, dock et signatures lus |
| Acceptance criteria captured | yes | seuil ci-dessus |
| Pre-solution issue challenge required | yes | comportement confirmé dans la source |
| Reproduction verdict before implementation | yes | mana lu et débité actuellement |
| Repro escalation ladder selected | yes | test de règle puis navigateur |
| Suggested fix reviewed against durable boundary | yes | action + HUD |
| TDD decision before behavior change or bug fix | yes | test avant code |
| Browser proof decision for browser surface | yes | achat réel requis |
| Browser pack selected | yes | pack browser |
| Browser route / app surface identified | yes | localhost, Mine |
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
| Named verification threshold | yes | Run the named proof or record blocker | tests, build, diff et navigateur passent |
| Pre-solution issue challenge verdict | yes | Confirmer la mauvaise monnaie | débit mana confirmé dans la source |
| Repro escalation ladder | yes | Test puis navigateur | toutes les étapes passent |
| Bug reproduced before fix | yes | Test rouge | coût 70 au lieu de 10 avant correction |
| Targeted behavior verification | yes | Test économie | `miningSkillEconomy` passe |
| TypeScript or typed config changed | yes | Run relevant typecheck | typecheck et build passent |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passe |
| Browser surface changed | yes | Capture browser proof | carte à 10 ressources; compteur 15 vers 5; dégâts 1 vers 2 |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `git diff --check` passe |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Mana restauré après collision de patch; seuls achat/coûts/dock miniers changent |
| Timed checkpoint | N/A | Aucune durée demandée | score final 98/100 |
| Goal plan complete | yes | Run checker global autogoal | checker relancé après cette mise à jour |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | minage jusqu'à 15 puis achat Pickaxe + |
| Browser console/network check | yes | Record console/network state or N/A | aucune erreur; avertissements Three.js de texture préexistants seulement |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | capture après achat: compteur 5, Pickaxe + à 2 dégâts, prochain coût 12 |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | coût, achat et dock inspectés | implementation |
| Implementation | complete | coûts, débit multi-matériaux, dock et test | verification |
| Verification | complete | test ciblé, suite, build et navigateur | closeout |
| Closeout | complete | autoreview et plan fermés | final response |

Findings:
- `buyMiningSkill` débite actuellement le mana.
- Les états désactivés et leur signature dynamique utilisent également le mana.
- L'asset `minerals.svg` existe déjà.
- La monnaie globale `resources.minerals` n'est plus gagnable dans l'interface depuis le retrait de l'échange; le compteur visible est donc la source correcte pour les skills.

Decisions and tradeoffs:
- Prix de base: 10, 25, 30, 12, 20, 25, 35, 120, 15, 40.
- Multiplicateurs de croissance réduits entre 1.22 et 1.45.
- Le coût est prélevé sur les matériaux disponibles dans l'ordre stable des ressources, sans toucher au mana ni aux minerais globaux.

Timeline:
- 2026-07-11T13:09:33.423Z: plan created.
- 2026-07-11: test TDD rouge puis vert; collision de motifs HUD détectée et corrigée sans modifier Mana.
- 2026-07-11: achat navigateur validé de 15 à 5 ressources, Pickaxe 1 à 2 dégâts.
- 2026-07-11: tests complets, build et diff check passent.

Verification evidence:
- `miningSkillEconomy`, `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`: passent.
- Browser: coût initial 10, activation à 15 ressources, débit exact de 10, prochain coût 12, aucun débit mana.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complet |
| Where am I going? | Réponse finale |
| What is the goal? | Skills payés par le compteur de mine à prix réduit |
| What have I learned? | See Findings |
| What have I done? | Coûts réduits, monnaie corrigée, achat réel vérifié |

Open risks:
- Avertissements Three.js de chargement de textures déjà présents et sans lien avec l'économie; aucune erreur navigateur.
