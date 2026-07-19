# animate runner demongirl locally

Objective:
Riguer et animer localement la Demongirl du Runner avec les memes etats utiles que l'autre personnage, puis integrer et verifier le GLB anime.

Goal plan:
docs/plans/2026-07-16-animate-runner-demongirl-locally.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: demande directe utilisateur
- id / link: N/A
- title: Faire localement les animations de la nouvelle fille comme l'autre personnage
- acceptance criteria: Demongirl skinee et animee localement; etats menu/course/blessure/mort disponibles; runtime et Boy/Fox non casses; preuve structurelle et visuelle.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: aucun temps demande
- initial confidence score: 74/100
- improvement loop: inspecter le contrat runtime, authorer rig et clips, exporter, tester, rendre les poses extremes, corriger les deformations
- final score / loop closure: 92/100; le rig, les cinq clips, la reimportation, les tests et les preuves visuelles passent. Le risque restant est uniquement la qualite artistique subjective d'animations creees sans bras.

Completion threshold:
- `girl.glb` contient 1 skin, les 7 materiaux Demongirl, un squelette adapte et les clips embarques necessaires au menu et au gameplay.
- Les animations embarquees reprennent exactement le contrat Fox actuel: `DemongirlIdle` (assis), `DemongirlStand`, `DemongirlSitToStand`, `DemongirlRun` et `DemongirlDeath`; le runtime reutilise Run pour la course blessee comme pour Fox.
- Les tests Runner cibles, le typecheck/build pertinent et une reimportation Blender passent.
- Un contact sheet ou rendu des poses cles montre le personnage entier, au sol, sans coupe ni deformation grossiere.

Verification surface:
- Audit de `src/ui/runnerThreeLane.ts`, `tests/runnerHeroAnimation.test.ts`, `tests/runnerHeroSkin.test.ts` et des exports Fox existants.
- Script Blender reproductible, reimport GLB, rapport JSON, tests Runner cibles, build/typecheck et rendu de poses cles.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `exports/runner-demongirl/demongirl.blend`, contrat d'animation de `runnerThreeLane.ts` et clips Fox/Runner existants.
- Allowed edit scope: pipeline Demongirl, `girl.glb`, tests/contrat Runner necessaires, rapport et preuves d'export.
- Browser surface: Runner local uniquement pour preuve finale si le serveur est disponible.
- Tracker sync: N/A.
- Non-goals: modifier le design du personnage, inventer des bras absents, changer le gameplay Runner, remplacer les animations Boy/Fox.

Current verdict:
- verdict: partially valid
- confidence: 74/100
- next owner: pipeline Blender Demongirl
- reason: les memes etats sont faisables localement, mais la morphologie sans bras exige des animations adaptees plutot qu'un transfert humain literal.

Pre-solution issue challenge:
- reporter claim: animer ici la nouvelle fille d'apres l'autre personnage.
- suggested diagnosis or fix: creer un rig local et reprendre les etats d'animation du Runner.
- repro ladder:
  - tests / source-level repro: le runtime consomme actuellement seulement Idle/Run/Death pour Demongirl et elle n'a aucun skin.
  - repo-owned automated browser or integration proof: a executer apres export.
  - Browser plugin: a utiliser apres export si le Runner local est disponible.
  - screenshot / visual proof: rendus Blender des poses cles requis.
- reproduction verdict: valid, le modele actuel n'a qu'une animation de root et aucun squelette.
- validity verdict: partially valid, meme inventaire d'etats oui; memes mouvements humains au pixel pres non, car aucun bras n'existe.
- best long-term fix boundary: rig Demongirl propre et clips embarques specifiques, relies par le contrat runtime commun.
- harsh honest feedback: copier les animations Mixamo sur ce mesh sans bras donnerait une animation techniquement chargee mais visuellement fausse.
- hard-stop decision: continuer avec des clips adaptes a sa morphologie et prouver les poses.

Blocked condition:
- Le mesh decime ne peut pas etre skine proprement ou les poses cles montrent des deformations irreparables sans remodeler le personnage.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-animate-runner-demongirl-locally.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Meme logique d'animations que l'autre personnage, realisee localement |
| Timed checkpoint parsed | N/A | Aucun temps demande |
| Active goal checked or created | yes | Goal actif cree avant modification |
| Source of truth read before edits | yes | Pipeline Demongirl, runtime Runner, tests et rapports d'animations lus |
| Acceptance criteria captured | yes | Rig, clips, integration, tests, reimport et rendu captures |
| Pre-solution issue challenge required | yes | Limite morphologique et bon ownership documentes |
| Reproduction verdict before implementation | yes | GLB actuel: 0 skin, clips root-only Idle/Run/Death |
| Repro escalation ladder selected | yes | Source/tests -> Blender -> navigateur/rendu |
| Suggested fix reviewed against durable boundary | yes | Rig et clips dans le pipeline Demongirl, pas patch runtime ad hoc |
| TDD decision before behavior change or bug fix | yes | Mise a jour des contrats de test avant integration finale; asset authoring prouve par reimport/rendu |
| Browser proof decision for browser surface | yes | Preuve Runner locale requise si disponible, plus rendu Blender obligatoire |

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
      is recorded with reason. Le rig et les clips sont possedes par le pipeline Blender reproductible et embarques dans `girl.glb`.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Relecture limitee au pipeline Demongirl, a son GLB, au rapport et au contrat de test; les changements concurrents Boy/Fox restent hors scope.
- [x] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | GLB reimporte: 1 mesh, 1 skin, 15 os, 7 materiaux, 5 clips nommes de 45 canaux; cinq rendus complets |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Verdict `partially valid`: meme contrat d'etats, mouvements adaptes a la morphologie sans bras |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Baseline 0 skin/root-only; tests et reimport; Browser Runner; rendus Blender des cinq etats |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature d'animation; baseline structurelle prouvee: aucun skin et seulement des clips root-only |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerHeroAnimation` et `runnerHeroSkin` passent; contrat exact des cinq clips valide |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passe |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passe; avertissement Rollup de taille de chunk non bloquant et preexistant |
| Browser surface changed | yes | Capture browser proof | Runner local: menu assis, transition vers debout, course et mort visibles; console vide. Le clip dedie final `SitToStand` est ensuite valide par reimport et rendu Blender. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `python3 -m py_compile scripts/export-runner-demongirl.py` et typecheck passent |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Aucun patch runtime ad hoc; source FBX conservee; poids gauche/droite non nuls; Boy/Fox concurrents non modifies par ce travail |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | Aucune duree demandee |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-animate-runner-demongirl-locally.md` | Le checker autogoal passe |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Contrat runtime, assets Boy/Fox, source Demongirl et tests audites | termine |
| Implementation | completed | Rig 15 os, skinning deterministe, cinq actions et export GLB reproductible | termine |
| Verification | completed | Reimport Blender, rapport JSON, 45 tests, typecheck, build, Browser et rendus de poses | termine |
| Closeout | completed | Preuves consignees; objectif pret a etre ferme | final response |

Findings:
- Demongirl actuelle: 1 mesh fusionne, 7 materiaux, 0 skin, clips `DemongirlIdle`, `DemongirlRun`, `DemongirlDeath` limites au root.
- Le Runner attend maintenant cinq clips embarques pour le Fox (`Idle`, `Stand`, `SitToStand`, `Run`, `Death`); son rig complet reste incompatible directement avec la morphologie Demongirl.
- La fille n'a pas de bras visibles; le rig doit privilegier root, bassin, torse/tete, jambes, manteau/cheveux et queue.

Decisions and tradeoffs:
- Authorer les clips dans Blender sur un rig Demongirl dedie au lieu d'utiliser Mixamo ou de retargeter aveuglement le squelette humain.
- Conserver la silhouette et les 7 materiaux; accepter une gestuelle sans bras mais exiger des jambes, du rebond, du manteau et de la queue lisibles.

Timeline:
- 2026-07-16T14:16:28.986Z: plan created.

Verification evidence:
- `exports/runner-demongirl/export-report.json`: source FBX SHA-256 inchange, GLB de 3 443 324 octets, 1 mesh, 1 skin, 15 os, 7 materiaux et reimportation Blender reussie.
- Clips embarques: `DemongirlIdle`, `DemongirlStand`, `DemongirlSitToStand`, `DemongirlRun`, `DemongirlDeath`, chacun avec 45 canaux.
- Poids controles notamment sur les quatre groupes de jambes: `Leg.L=1951`, `Shin.L=1998`, `Leg.R=1940`, `Shin.R=1985`.
- Rendus inspectes: idle assis, stand, transition sit-to-stand, run et death; personnage entier et silhouette lisible.
- `npx tsx tests/runnerHeroAnimation.test.ts`: passe.
- `npx tsx tests/runnerHeroSkin.test.ts`: passe.
- `npm test`: les 45 fichiers de test passent.
- `npm run typecheck`: passe.
- `npm run build`: passe; seul l'avertissement non bloquant sur la taille du chunk Vite demeure.
- Browser Runner local: Demongirl assise dans le menu, transition debout, `standardRun` et `fallFlat` observes; aucun log console. Cette preuve a couvert la transition visuelle avant l'ajout du clip dedie; le clip dedie final est prouve par le contrat source, la reimportation et son rendu Blender.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout termine |
| Where am I going? | Reponse finale |
| What is the goal? | Livrer une Demongirl riggee et animee selon les etats Runner existants |
| What have I learned? | Le transfert humain literal est invalide; un rig morphologique local produit un meilleur resultat et reste reproductible |
| What have I done? | Rig, skinning, cinq clips, GLB runtime, rapport, rendus, tests, build et preuve navigateur termines |

Open risks:
- Les animations sont volontairement adaptees a l'absence de bras; une future passe artistique peut affiner le caractere sans changer le contrat runtime.
- Le gros chunk Vite signale par le build est hors scope de cet asset et n'empeche pas son execution.
