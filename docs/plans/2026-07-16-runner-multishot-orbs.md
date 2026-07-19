# runner multishot orbs

Objective:
Ajouter une formation centree d'orbes bleues lumineuses derriere le heros Runner, avec exactement un orbe par niveau de multishot et un rendu instancie performant.

Goal plan:
docs/plans/2026-07-16-runner-multishot-orbs.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request avec reference visuelle
- id / link: N/A
- title: Orbes lumineuses pour les multishots du Runner
- acceptance criteria: un orbe bleu lumineux par niveau de multishot, formation centree derriere le personnage, visible pendant la course et sans cout de rendu proportionnel en draw calls.

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
- improvement loop: contrat pur de formation, rendu instancie, test de compte/centrage, preuve navigateur aux niveaux 0 et 5
- final score / loop closure: 99/100; niveaux 0 et 5, deux draw calls, capture, console, suite, typecheck et build valides

Completion threshold:
- Les niveaux 0 a 5 produisent respectivement 0 a 5 orbes.
- Chaque formation a une somme X nulle, reste derriere le heros et tient dans la largeur du couloir.
- Le rendu utilise deux draw calls fixes au maximum: coeur et halo instancies.
- Tests cibles, suite complete, typecheck, build et preuve navigateur passent.

Verification surface:
- Nouveau test pur de formation et assertions statiques du renderer.
- `npm test`, `npm run typecheck`, `npm run build`.
- Browser sur `http://127.0.0.1:5173/` avec multishot 0 puis 5, dataset de compte/draw calls, capture du canvas et console vide.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: niveau `runnerMeta.upgrades.multishot`, limite 5 de `runnerMultishotProjectiles` et renderer `runnerThreeLane.ts`.
- Allowed edit scope: helper visuel pur, renderer Three.js Runner, tests et plan.
- Browser surface: course du mini-jeu Runner sur `http://127.0.0.1:5173/`.
- Tracker sync: N/A.
- Non-goals: modifier le nombre de projectiles, les degats, collisions, economie, personnages, hub ou assets Blender.

Current verdict:
- verdict: valid
- confidence: 94/100
- next owner: task
- reason: la statistique existe, est bornee a 5 et le groupe `units` suit deja le joueur.

Pre-solution issue challenge:
- reporter claim: le multishot doit etre represente par des orbes bleues en formation derriere le heros.
- suggested diagnosis or fix: deux InstancedMesh partages, poses par un helper deterministe centre.
- repro ladder:
  - tests / source-level repro: N/A, nouvelle fonctionnalite; test rouge exige avant implementation.
  - repo-owned automated browser or integration proof: tests Runner existants plus nouveau test cible.
  - Browser plugin: verifier le vrai canvas aux niveaux 0 et 5.
  - screenshot / visual proof: verifier couleur, halo, centrage, profondeur et absence de chevauchement incoherent.
- reproduction verdict: N/A, fonctionnalite absente.
- validity verdict: valid.
- best long-term fix boundary: disposition pure separee du rendu instancie dans le proprietaire Three.js Runner.
- harsh honest feedback: cinq PointLight ou cinq objets complets seraient inutiles; deux instances suffisent.
- hard-stop decision: continuer.

Blocked condition:
- Arreter si le niveau multishot ne peut pas etre observe dans l'etat runtime ou si le canvas local ne peut pas charger le renderer Three.js.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-multishot-orbs.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | orbes bleues, lumineuses, centrees, derriere le heros, une par multishot |
| Timed checkpoint parsed | N/A | aucune duree demandee |
| Active goal checked or created | yes | objectif actif cree pour cette fonctionnalite |
| Source of truth read before edits | yes | limite multishot, etat Runner, `syncUnits` et pools Three.js lus |
| Acceptance criteria captured | yes | compte, formation, lumiere, performance et preuve visuelle |
| Pre-solution issue challenge required | N/A | fonctionnalite directe |
| Reproduction verdict before implementation | N/A | fonctionnalite absente, pas un bug |
| Repro escalation ladder selected | yes | test pur, suite, Browser, capture |
| Suggested fix reviewed against durable boundary | yes | helper pur plus deux InstancedMesh dans `runnerThreeLane` |
| TDD decision before behavior change or bug fix | yes | test de formation et contrat renderer avant implementation |
| Browser proof decision for browser surface | yes | preuve aux niveaux 0 et 5 dans le vrai Runner |
| Browser pack selected | yes | pack browser materialise |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Runner en course |
| Browser tool decision recorded | yes | Browser integre du depot |

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
| Named verification threshold | yes | Executer tous les controles nommes | 0-5 orbes, centrage, deux instances, suite et Browser valides |
| Pre-solution issue challenge verdict | N/A | Fonctionnalite directe | solution instanciee retenue apres lecture du plafond 5 |
| Repro escalation ladder | yes | Test, suite, Browser et capture | toutes les marches applicables executees |
| Bug reproduced before fix | N/A | Nouvelle fonctionnalite | test initial rouge sur module absent |
| Targeted behavior verification | yes | Executer test orbes et Runner | `runnerMultishotOrbs` et `runnerRules` passent |
| TypeScript or typed config changed | yes | Executer typecheck | `npm run typecheck` passe |
| Build-sensitive behavior changed | yes | Executer build | `npm run build` passe; avertissement Vite existant seulement |
| Browser surface changed | yes | Capturer les niveaux 0 et 5 | datasets 0/0 puis 5/2 et rendu bleu centre captures |
| Final lint/format | N/A | Aucun script lint | typecheck et tests couvrent les fichiers touches |
| Autoreview | yes | Relire la portee finale | aucun calcul de tir, degat, collision ou economie modifie |
| Timed checkpoint | N/A | Aucune duree demandee | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-multishot-orbs.md` | a executer apres fermeture du plan |
| Browser interaction proof | yes | Acheter multishot 5 et lancer Runner | `hero=standardRun`, `orbs=5`, `draws=2` observes |
| Browser console/network check | yes | Lire erreurs et avertissements | console vide; aucun appel reseau ajoute |
| Browser final proof artifact | yes | Capture du vrai canvas | cinq orbes cyan lumineuses derriere le Fox |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | multishot borne a 5 et proprietaire `syncUnits` identifies | implementation |
| Implementation | completed | helper pur, coeur et halo instancies integres | verification |
| Verification | completed | test rouge/vert, suite, typecheck, build et Browser valides | closeout |
| Closeout | completed | revue de portee terminee; checker final restant | final response |

Findings:
- Multishot est borne a 5 et ajoute exactement un projectile par niveau.
- Le groupe `units` est le bon proprietaire: il est cache au hub et suit le jeu pendant la course.
- Deux InstancedMesh suffisent pour un coeur cyan opaque et un halo bleu additif.

Decisions and tradeoffs:
- Formation: une rangee pour 1-2, puis deux rangees centrees pour 3-5.
- Positions absolues dans `units`, decalees par `playerX`, pour suivre lateralement le heros sans parenter au squelette anime.
- Aucun PointLight ni post-traitement bloom: le halo additif donne la lecture voulue pour deux draw calls fixes.

Timeline:
- 2026-07-16T15:21:58.977Z: plan created.
- 2026-07-16: test cible ajoute et observe rouge sur module absent.
- 2026-07-16: helper de formation et deux InstancedMesh integres au renderer Runner.
- 2026-07-16: niveaux 0 et 5 verifies dans le Browser puis suite complete passee.

Verification evidence:
- `runnerMultishotOrbs.test.ts`: compte 0-5, centrage X, profondeur negative et plafond 5 valides.
- Browser niveau 0: `orbs=0`, `draws=0`; niveau 5: `orbs=5`, `draws=2`, `hero=standardRun`.
- Capture: cinq petits coeurs cyan avec halos bleus en formation derriere le Fox; console vide.
- `npm test`, `npm run typecheck`, `npm run build`: exit 0.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Checker puis reponse finale |
| What is the goal? | Une orbe bleue lumineuse par multishot derriere le heros |
| What have I learned? | Deux instances couvrent proprement le plafond de cinq orbes |
| What have I done? | Formation, rendu, tests et preuve Browser termines |

Open risks:
- Le build conserve l'avertissement Vite existant sur la taille du bundle; aucun nouveau chargement ou asset n'est ajoute.
