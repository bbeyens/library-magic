# Niveaux des blocs de mine

Objective:
Ajouter une jauge circulaire de niveau par matériau dans la mine, calquée sur Cristal, indépendante pour chaque bloc, plafonnée au niveau 10 avec affichage MAX.

Goal plan:
docs/plans/2026-07-11-niveaux-des-blocs-de-mine.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: demande utilisateur directe
- id / link: N/A
- title: Cercle de niveau par type de bloc dans la mine
- acceptance criteria: jauge circulaire visible; XP indépendant par matériau; progression 0-10; MAX au niveau 10; changement lors de la sélection d'un terrain d'un autre matériau.

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
- initial confidence score: 90/100
- improvement loop: règles testées puis preuve visuelle réelle
- final score / loop closure: 97/100, règles et rendu vérifiés

Completion threshold:
- Chaque matériau minier possède un XP indépendant initialisé à 0.
- Une couche détruite ajoute exactement 1 XP à son matériau, sans dépasser le plafond utile du niveau 10.
- La jauge montre le matériau du cycle sélectionné, le niveau courant et sa progression; elle affiche MAX et reste pleine au niveau 10.
- Les tests ciblés, la suite complète, le typecheck/build et la preuve navigateur passent.

Verification surface:
- Tests de règles de progression minière et test statique HUD.
- `npm test`, `npm run build`, `git diff --check`.
- Navigateur sur `http://127.0.0.1:5173/`, ouverture de la mine et inspection de la jauge.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`.
- Allowed edit scope: état/règles/HUD/tests de la mine et ce plan.
- Browser surface: panneau du mini-jeu Mine.
- Tracker sync: N/A.
- Non-goals: aucun changement aux autres mini-jeux; aucun changement des textures ou des compétences; aucun push/commit.

Current verdict:
- verdict: valid feature request
- confidence: 97/100
- next owner: user
- reason: fonctionnalité implémentée et vérifiée

Pre-solution issue challenge:
- reporter claim: N/A, nouvelle fonctionnalité.
- suggested diagnosis or fix: porter la jauge Cristal avec un XP séparé par matériau.
- repro ladder:
  - tests / source-level repro: pending
  - repo-owned automated browser or integration proof: pending
  - Browser plugin: pending
  - screenshot / visual proof: pending
- reproduction verdict: N/A, pas un bug.
- validity verdict: valid.
- best long-term fix boundary: progression détenue par `MiningState`, rendu dérivé de cet état.
- harsh honest feedback: une jauge globale serait incorrecte car elle mélangerait les matériaux.
- hard-stop decision: aucun blocage.

Blocked condition:
- Serveur local indisponible pour la preuve visuelle ou incohérence de modèle empêchant d'identifier le matériau du cycle actif.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-11-niveaux-des-blocs-de-mine.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | cercle comme Cristal, niveau indépendant par bloc, 10 MAX |
| Timed checkpoint parsed | N/A | aucune durée demandée |
| Active goal checked or created | yes | goal `019f41dc-55e9-7191-b974-050bf461d370` |
| Source of truth read before edits | yes | état, rupture de bloc, HUD/CSS Cristal et Mine lus |
| Acceptance criteria captured | yes | section Task source et Completion threshold |
| Pre-solution issue challenge required | N/A | nouvelle fonctionnalité |
| Reproduction verdict before implementation | N/A | nouvelle fonctionnalité |
| Repro escalation ladder selected | N/A | nouvelle fonctionnalité |
| Suggested fix reviewed against durable boundary | yes | XP dans MiningState, pas dans le DOM |
| TDD decision before behavior change or bug fix | yes | TDD sur progression et plafond |
| Browser proof decision for browser surface | yes | obligatoire |
| Browser pack selected | yes | pack browser matérialisé |
| Browser route / app surface identified | yes | localhost:5173, panneau Mine |
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
| Named verification threshold | yes | Run the named proof or record blocker | tests complets, build et diff check passent |
| Pre-solution issue challenge verdict | N/A | Nouvelle fonctionnalité | aucun bug revendiqué |
| Repro escalation ladder | N/A | Nouvelle fonctionnalité | TDD et preuve navigateur utilisés |
| Bug reproduced before fix | N/A | Nouvelle fonctionnalité | tests rouges initiaux ont validé l'absence de la fonctionnalité |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `miningMaterialLevels` et `miningMaterialLevelHud` passent |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passe |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passe |
| Browser surface changed | yes | Capture browser proof | jauge 0%, puis Terre 4/100 et anneau 4% après minage |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `git diff --check` passe; aucun script lint dédié requis |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | état détenu par MiningState; XP attribué à la rupture; aucun bonus ou autre mini-jeu modifié par cette tâche |
| Timed checkpoint | N/A | Aucune durée demandée | score final 97/100 |
| Goal plan complete | yes | Run checker global autogoal | checker relancé après fermeture du plan |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Mine ouverte sur localhost; trois clics de minage; jauge mise à jour en direct |
| Browser console/network check | yes | Record console/network state or N/A | aucune erreur console; avertissements Three.js de texture déjà présents; réseau détaillé non exposé par le plugin |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | capture navigateur de la jauge Terre à 4% sur `http://127.0.0.1:5173/` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | requirements and Crystal/Mine source read | implementation |
| Implementation | complete | état, règles, HUD, CSS et tests ajoutés | verification |
| Verification | complete | tests, typecheck, build, navigateur, console | closeout |
| Closeout | complete | autoreview et plan fermés | final response |

Findings:
- Cristal utilise une jauge conique avec 100 XP par niveau.
- Un cycle de mine couvre cinq profondeurs mais un seul sprite/type représentatif.
- La rupture d'une couche est le seul événement fiable pour attribuer l'XP au bon matériau.

Decisions and tradeoffs:
- 1 couche détruite = 1 XP; 100 XP = 1 niveau; niveau 0 à 10.
- Le niveau 10 affiche MAX et la progression est pleine.
- Aucun bonus gameplay n'est ajouté: la demande porte sur le cercle de progression, pas sur un multiplicateur implicite.

Timeline:
- 2026-07-11T12:49:23.974Z: plan created.
- 2026-07-11: tests TDD rouges puis verts pour progression 0-10 et rendu MAX.
- 2026-07-11: navigateur vérifié de 0/100 à 4/100 après minage réel.
- 2026-07-11: suite complète, typecheck, build et diff check validés.

Verification evidence:
- `npm test`: 29 fichiers de tests passent, dont les deux nouveaux tests miniers.
- `npm run typecheck`: passe.
- `npm run build`: passe; avertissement Rollup de taille de chunk préexistant seulement.
- Browser plugin: cercle Terre 50px visible, niveau 0, progression passée à 4%, aucune erreur console.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complet |
| Where am I going? | Réponse finale |
| What is the goal? | Jauge de niveau indépendante par matériau, 0-10 MAX |
| What have I learned? | See Findings |
| What have I done? | Progression indépendante, jauge MAX, tests et preuve navigateur |

Open risks:
- Les avertissements Three.js `Texture marked for update but no image data found` existaient pendant le chargement des textures; ils ne proviennent pas de la jauge DOM et aucune erreur console n'a été observée.
