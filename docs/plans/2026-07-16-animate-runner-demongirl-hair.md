# animate runner demongirl hair

Objective:
Ajouter des cheveux souples a la Demongirl: oscillation idle, inertie opposee aux mouvements gauche/droite et retour amorti, puis prouver le GLB et le rendu Runner.

Goal plan:
docs/plans/2026-07-16-animate-runner-demongirl-hair.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: demande directe utilisateur
- id / link: N/A
- title: Animer les cheveux de la Demongirl en idle et lors des mouvements gauche/droite
- acceptance criteria: cheveux visiblement moins rigides; idle boucle; mouvement lateral produit une trainee opposee a la direction; retour progressif au centre; animations existantes et autres personnages preserves.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: aucune duree demandee
- initial confidence score: 86/100
- improvement loop: renforcer le rig/poids des cheveux, authorer l'idle, ajouter l'inertie runtime, rendre les extremes, corriger les coupes ou mouvements trop raides
- final score / loop closure: 93/100; rig segmente, idle et course assouplis, inertie directionnelle testee, GLB reimporte, rendus et checks complets valides.

Completion threshold:
- Le rig Demongirl possede au moins deux segments animes par meche principale, avec des poids non nuls pour chaque segment.
- `DemongirlIdle` et `DemongirlRun` contiennent un mouvement secondaire lisible des cheveux sans deplacer la racine du personnage.
- En Runner, un mouvement lateral gauche/droite applique une inertie capillaire opposee et amortie; l'arret ramene progressivement les cheveux au centre.
- Les rendus idle, gauche et droite montrent le personnage entier sans coupe; reimport GLB, tests Runner, suite complete, typecheck et build passent.

Verification surface:
- Rapport JSON de l'export Blender, inspection des poids et canaux GLB, rendus `hair-idle`, `hair-left`, `hair-right`.
- Tests `runnerHeroAnimation` et `runnerHeroSkin`, `npm test`, `npm run typecheck`, `npm run build`.
- Browser Runner local: selection Demongirl, idle puis mouvement vers les deux cotes, inspection visuelle et console.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `scripts/export-runner-demongirl.py`, `exports/runner-demongirl/demongirl.blend`, `girl.glb` et le mouvement lateral de `runnerThreeLane.ts`.
- Allowed edit scope: pipeline/asset Demongirl, helper d'animation Runner, integration de mouvement capillaire, tests et preuves associees.
- Browser surface: `http://127.0.0.1:5173/`, mini-jeu Runner avec la skin girl.
- Tracker sync: N/A.
- Non-goals: changer le mesh, les materiaux, le gameplay de deplacement, les animations Boy/Fox ou ajouter une simulation physique couteuse par sommet.

Current verdict:
- verdict: valid
- confidence: 86/100
- next owner: pipeline Blender Demongirl puis integration Three.js
- reason: deux os de cheveux existent deja mais chaque meche reste controlee comme un bloc; le runtime ne distingue aucune inertie gauche/droite.

Pre-solution issue challenge:
- reporter claim: les cheveux sont trop rigides et doivent bouger en idle, a gauche et a droite.
- suggested diagnosis or fix: enrichir les animations des cheveux et ajouter une reaction directionnelle.
- repro ladder:
  - tests / source-level repro: le rig ne possede qu'un os par cote et les poses idle laissent ces os a zero; aucune logique laterale n'existe dans `runnerThreeLane.ts`.
  - repo-owned automated browser or integration proof: tests de contrat GLB et helper directionnel a etendre.
  - Browser plugin: verifier le Runner reel apres integration.
  - screenshot / visual proof: trois rendus Blender idle/gauche/droite requis.
- reproduction verdict: valid.
- validity verdict: valid.
- best long-term fix boundary: chaine de deux segments par meche dans l'asset, animation idle authorisee, puis inertie directionnelle legere au niveau des os apres evaluation du mixer.
- harsh honest feedback: dupliquer toute l'animation de course en versions gauche/droite serait lourd et se desynchroniserait; la reaction doit rester un mouvement secondaire superpose.
- hard-stop decision: continuer; stopper seulement si la geometrie ne permet pas de repartir les poids sans deformation grossiere.

Blocked condition:
- Le mesh des cheveux ne permet pas de distinguer racines et pointes, ou l'evaluation Three.js ecrase inevitablement les offsets apres le mixer sans alternative additive stable.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-animate-runner-demongirl-hair.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Idle, gauche, droite et cheveux moins rigides captures |
| Timed checkpoint parsed | N/A | Aucune duree demandee |
| Active goal checked or created | yes | Goal actif cree avant edition |
| Source of truth read before edits | yes | Script Blender, rig actuel, contrat GLB et runtime de mouvement lus |
| Acceptance criteria captured | yes | Rig segmente, trois comportements, retour amorti, preuves structurelles et visuelles |
| Pre-solution issue challenge required | yes | Rigidite reproduite dans l'asset et absence de logique directionnelle dans le runtime |
| Reproduction verdict before implementation | yes | `valid` |
| Repro escalation ladder selected | yes | Source/tests -> Blender -> Browser -> rendus |
| Suggested fix reviewed against durable boundary | yes | Mouvement secondaire superpose, pas trois clips corporels dupliques |
| TDD decision before behavior change or bug fix | yes | Tester d'abord le calcul directionnel pur et le contrat d'os/clips; visuel prouve par rendus |
| Browser proof decision for browser surface | yes | Preuve Runner reelle requise |
| Browser pack selected | yes | Pack browser materialise |
| Browser route / app surface identified | yes | Runner sur `http://127.0.0.1:5173/` |
| Browser tool decision recorded | yes | Utiliser le Browser integre en premier conformement au repo |

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
      is recorded with reason. L'asset possede les segments/poids et le runtime ne superpose que l'inertie liee au mouvement reel.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Revue limitee au pipeline Demongirl, helper directionnel, integration Runner, tests et artefacts regeneres.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Browser integre utilise sur le Runner local.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. Aucun warning/erreur console.
- [x] Browser pack: proof uses the real affected browser surface. Demongirl selectionnee dans le menu et `standardRun` observe dans le canvas reel.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | 17 os, 4 groupes de cheveux ponderes, 51 canaux par clip, trois rendus capillaires, reimport GLB valide |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Verdict `valid`; un os unique par meche et aucune logique laterale reproduisaient la rigidite |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Tests rouges avant implementation; reimport Blender; Browser reel; rendus idle/gauche/droite |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Tests initiaux echouaient sur helper absent et os `HairTip` absents; source idle laissait les cheveux a zero |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerHeroAnimation` valide gauche/droite/retour doux; `runnerHeroSkin` valide rig et poids; rendus extremes distincts |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passe |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passe; avertissement Vite de taille de chunk non bloquant |
| Browser surface changed | yes | Capture browser proof | Idle Demongirl observe a deux phases distinctes, selection et `standardRun` valides; capture directionnelle courte remplacee par rendus Blender + test pur deterministe |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `python3 -m py_compile scripts/export-runner-demongirl.py` et typecheck passent |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Aucun mouvement du root ajoute; retour ralenti a 2.4/s; offsets appliques apres mixer; mort et Boy/Fox preserves |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | Aucune duree demandee |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-animate-runner-demongirl-hair.md` | Le checker autogoal passe |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Runner ouvert, girl selectionnee, transition menu et course `standardRun` exercees |
| Browser console/network check | yes | Record console/network state or N/A | Console warn/error vide; verification reseau N/A car asset GLB charge et rendu sans erreur |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Deux captures idle montrent des phases distinctes; tab Runner laisse ouvert. Les extremes lateraux sont les PNG Blender controles. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Rig, poids, clips, mouvement lateral et contrats de test audites | termine |
| Implementation | completed | Deux os de pointe, poids progressifs, cles idle/run, inertie runtime et retour amorti | termine |
| Verification | completed | Reimport Blender, trois rendus, 46 tests, typecheck, build et Browser | termine |
| Closeout | completed | Revue finale et preuves consignees | reponse finale |

Findings:
- Les anciennes meches utilisaient seulement `DemongirlHair.L/R`; chacune se deformait donc comme une plaque unique.
- Les poses idle/stand avaient peu ou pas de decalage aux cheveux et aucune information de mouvement lateral n'etait transmise apres le mixer.
- La geometrie permet un partage racine/pointe par hauteur: 2 275 sommets ponderes sur `HairTip.L`, 713 sur `HairTip.R`.
- Le raccourci `I` n'est pas une preuve visuelle valable ici: tous les tirs font tomber le Runner de test a 1 FPS. Les preuves finales utilisent la charge normale.

Decisions and tradeoffs:
- Ajouter un segment de pointe par cote plutot qu'une physique par sommet: deformation lisible, cout runtime minime et export reproductible.
- Authorer le mouvement idle/course dans Blender, puis ajouter seulement l'inertie directionnelle apres `mixer.setTime` pour eviter de dupliquer toutes les animations corporelles.
- Deriver la direction du deplacement reel entre deux positions, pas de `playerTargetX`, afin d'eviter une reaction anticipee.
- Garder une attaque rapide (13/s) et ralentir le retour (2.4/s) pour une oscillation perceptible sans flottement permanent.

Timeline:
- 2026-07-16T15:41:17.535Z: plan created.
- 2026-07-16: baseline rouge capturee; rig passe de 15 a 17 os; GLB et previews regeneres.
- 2026-07-16: tests, typecheck, build, reimport et Browser termines.

Verification evidence:
- `export-report.json`: 1 mesh, 1 skin, 7 materiaux, 17 os, 5 clips de 51 canaux et reimportation Blender reussie.
- Poids cheveux: racines L/R `2947/1263`, pointes L/R `2275/713`; les quatre groupes sont non vides.
- Rendus controles: `demongirl-hair-idle.png`, `demongirl-hair-left.png`, `demongirl-hair-right.png`; les extremes sont pixellement distincts, personnage entier et sans intersection grossiere.
- Browser: deux phases idle visibles, Demongirl selectionnee, `standardRun` observe; aucun warning/erreur console. La course normale est courte pour une capture directionnelle stable, donc le sens lateral est prouve par le helper deterministe et les rendus Blender.
- `npm test`: 46 fichiers passent.
- `npm run typecheck`: passe.
- `npm run build`: passe avec avertissement de taille de chunk preexistant/non bloquant.
- `python3 -m py_compile scripts/export-runner-demongirl.py`: passe.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout termine |
| Where am I going? | Reponse finale |
| What is the goal? | Livrer des cheveux Demongirl souples en idle et reactifs aux mouvements gauche/droite |
| What have I learned? | La rigidite venait a la fois du rig monosegment et de l'absence d'inertie apres mixer |
| What have I done? | Rig, poids, clips, integration runtime, tests et preuves visuelles termines |

Open risks:
- La grande meche gauche domine naturellement la silhouette du modele; les deux directions changent surtout sa courbure plutot qu'une translation symetrique.
- Le chunk Vite de 2.26 MB reste hors scope et n'est pas cause par les quatre transformations d'os ajoutees par frame.
