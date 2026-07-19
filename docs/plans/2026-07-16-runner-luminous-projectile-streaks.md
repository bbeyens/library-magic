# runner luminous projectile streaks

Objective:
Remplacer les boules de feu Runner par des tirs blancs-jaunes lumineux a longue trainee effilee, toujours instancies en deux draw calls et sans changer la simulation.

Goal plan:
docs/plans/2026-07-16-runner-luminous-projectile-streaks.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request avec reference visuelle
- id / link: N/A
- title: Tirs lumineux en trainee du Runner
- acceptance criteria: les projectiles ressemblent aux bolts blancs lumineux de la reference, avec coeur chaud, halo et trainee; le budget, la quantite et les collisions restent inchanges.

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
- initial confidence score: 93/100
- improvement loop: verrouiller silhouette/materials par test, regenerer Blender, normaliser le halo runtime, verifier une salve niveau 5
- final score / loop closure: 98/100; GLB 4.4 fois plus long que large, salve 6 instances/2 draw calls, Browser et build valides

Completion threshold:
- Le GLB contient une silhouette de bolt au moins trois fois plus longue que large.
- Deux materiaux seulement: coeur blanc-jaune emissif et halo jaune transparent/additif.
- Les 64 projectiles restent instancies avec deux draw calls fixes.
- La salve est clairement visible au niveau du torse dans le vrai Runner.
- Tests, typecheck, build et preuve navigateur passent.

Verification surface:
- `tests/runnerFireballRenderer.test.ts` lit le GLB et le contrat renderer.
- Regeneration Blender, preuve PNG, `npm test`, `npm run typecheck`, `npm run build`.
- Browser sur `http://127.0.0.1:5173/`: salve multishot 5, compte/draw calls, capture et console vide.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `scripts/generate-runner-fireball.py`, `fireball.glb` et chargement/synchronisation dans `runnerThreeLane.ts`.
- Allowed edit scope: generateur Blender, asset projectile, renderer visuel, test et plan.
- Browser surface: course du mini-jeu Runner.
- Tracker sync: N/A.
- Non-goals: modifier trajectoires, vitesse, cadence, degats, homing, collisions, nombre de tirs ou impact particles.

Current verdict:
- verdict: valid
- confidence: 93/100
- next owner: task
- reason: le projectile est deja un GLB Blender instancie et son proprietaire visuel est isole.

Pre-solution issue challenge:
- reporter claim: les tirs doivent ressembler aux traits lumineux blancs de la reference.
- suggested diagnosis or fix: remplacer le mesh boule/flammes par un bolt a tete, coeur et trainee sans augmenter les materiaux.
- repro ladder:
  - tests / source-level repro: test actuel prouve seulement une boule orange a deux materiaux; nouvelles assertions requises avant regeneration.
  - repo-owned automated browser or integration proof: test renderer existant et suite Runner.
  - Browser plugin: verifier une salve reelle a multishot 5.
  - screenshot / visual proof: comparer silhouette, luminosite, hauteur et direction a la reference.
- reproduction verdict: valid, le GLB actuel est orange et presque spherique.
- validity verdict: valid.
- best long-term fix boundary: generateur Blender reproductible plus normalisation du material halo au chargement.
- harsh honest feedback: ajouter des particules DOM ou un trail par balle ruinerait le budget; la trainee doit vivre dans l'instance.
- hard-stop decision: continuer.

Blocked condition:
- Arreter si Blender ne peut pas regenerer/reimporter le GLB ou si la nouvelle silhouette n'est pas visible dans le vrai canvas.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-luminous-projectile-streaks.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | reference visuelle de traits blancs lumineux a tete chaude |
| Timed checkpoint parsed | N/A | aucune duree demandee |
| Active goal checked or created | yes | objectif actif cree |
| Source of truth read before edits | yes | generateur, GLB, test et renderer lus |
| Acceptance criteria captured | yes | silhouette, palette, halo, hauteur et budget |
| Pre-solution issue challenge required | N/A | fonctionnalite visuelle directe |
| Reproduction verdict before implementation | yes | GLB actuel inspecte: orange, 2 materiaux, silhouette compacte |
| Repro escalation ladder selected | yes | GLB/test, Blender proof, Browser et capture |
| Suggested fix reviewed against durable boundary | yes | mesh instancie garde, asset remodele a la source |
| TDD decision before behavior change or bug fix | yes | renforcer le test GLB avant regeneration |
| Browser proof decision for browser surface | yes | salve niveau 5 dans le vrai Runner |
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
| Named verification threshold | yes | Executer les preuves nommees | silhouette, materiaux, budget, salve, tests applicables et build valides |
| Pre-solution issue challenge verdict | N/A | Fonctionnalite visuelle directe | ancien GLB orange inspecte avant changement |
| Repro escalation ladder | yes | GLB/test, Blender, Browser et capture | toutes les marches applicables executees |
| Bug reproduced before fix | N/A | Nouvelle cible visuelle | test rouge sur noms de materiaux avant regeneration |
| Targeted behavior verification | yes | Test projectile et Runner | `runnerFireballRenderer` et `runnerRules` passent |
| TypeScript or typed config changed | yes | Executer typecheck | `npm run typecheck` passe |
| Build-sensitive behavior changed | yes | Executer build | `npm run build` passe; avertissement de taille existant |
| Browser surface changed | yes | Capturer une salve | 6 instances, 2 draw calls, axe avant et trainees visibles |
| Final lint/format | N/A | Aucun script lint | tests, typecheck et execution Blender couvrent les changements |
| Autoreview | yes | Relire asset, renderer et portee | simulation, impacts, stats et nombre de tirs inchanges |
| Timed checkpoint | N/A | Aucune duree demandee | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-luminous-projectile-streaks.md` | a executer apres fermeture du plan |
| Browser interaction proof | yes | Lancer Runner a multishot 5 | `ready=true`, `instances=6`, `draws=2`, `standardRun` |
| Browser console/network check | yes | Lire erreurs/avertissements | console vide; aucun appel reseau ajoute |
| Browser final proof artifact | yes | Capture du vrai canvas | traits blancs-jaunes allonges et alignes sur la route |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | boule orange 2 materiaux et pipeline instancie identifies | implementation |
| Implementation | completed | bolt Blender, halo additif, hauteur et axe runtime integres | verification |
| Verification | completed | test cible, typecheck, build, Browser et suite hors 2 tests Demongirl valides | closeout |
| Closeout | completed | audit de portee termine; checker final restant | final response |

Findings:
- Le GLB precedent etait orange et sa longueur n'atteignait pas trois fois sa largeur.
- Le nouveau GLB fait 16 116 octets, 156 triangles, 2 primitives et 2 materiaux.
- Sa longueur Y glTF est 4.406 fois sa largeur; la rotation fixe X=90 degres l'aligne sur +Z monde.

Decisions and tradeoffs:
- Garder le nom de fichier `fireball.glb` pour ne pas multiplier les contrats runtime.
- Utiliser une tete et deux cones joints, repartis entre coeur opaque et halo transparent.
- Appliquer l'additif au chargement Three.js car glTF encode BLEND mais pas le blending additif.
- Allonger seulement l'axe longitudinal de 45 % au runtime; aucune portee de collision ne change.

Timeline:
- 2026-07-16T15:44:26.846Z: plan created.
- 2026-07-16: ancien GLB inspecte, test cible rendu rouge, bolt regenere dans Blender.
- 2026-07-16: premiere capture a revele un axe horizontal; rotation decorative retiree et test verrouille.
- 2026-07-16: capture finale validee avec 6 instances et deux draw calls.

Verification evidence:
- Blender 5.1.2: `RunnerLuminousBolt`, 86 sommets, 156 triangles, deux materiaux.
- GLB: 16 116 octets, `RunnerBoltCore` opaque, `RunnerBoltGlow` BLEND, ratio longitudinal 4.406.
- Browser: bolts blancs-jaunes allonges, hauteur 0.72, axe avant correct, 6 instances, 2 draw calls, console vide.
- `runnerFireballRenderer`, `runnerRules`, tous les tests sauf les deux contrats Demongirl concurrents, typecheck et build passent.
- Suite globale bloquee hors perimetre: `runnerHeroAnimation` attend `applyRunnerDemongirlHairMotion`; `runnerHeroSkin` attend `DemongirlHairTip.L`, absents du runtime actuel.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Checker puis reponse finale |
| What is the goal? | Tirs blancs-jaunes lumineux a trainee dans le Runner |
| What have I learned? | Le GLB instancie peut porter la trainee sans augmenter les draw calls |
| What have I done? | Asset, renderer, tests et preuve Browser termines |

Open risks:
- Deux tests Demongirl modifies en parallele echouent sur des attentes cheveux hors perimetre; aucune modification de ces fichiers n'a ete faite ici.
- Le build conserve l'avertissement Vite existant sur la taille du bundle.
