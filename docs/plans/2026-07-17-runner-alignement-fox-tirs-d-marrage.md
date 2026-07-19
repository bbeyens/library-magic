# Runner alignement Fox tirs démarrage

Objective:
Supprimer dans le Runner le décalage entre la position visuelle du Fox, son placement au démarrage et l’origine de ses projectiles, avec test de régression et preuve navigateur.

Flow mode:
Auto allégé pour un bug local, exécuté en une passe.

Goal plan:
`docs/plans/2026-07-17-runner-alignement-fox-tirs-d-marrage.md`

Applied packs:
- `browser`
- `tdd`

Task source:
- type: demande directe avec trois captures d’écran
- id / link: N/A, aucune issue demandée
- title: alignement Fox, démarrage et tirs
- acceptance criteria: Fox centré dans le hub; position de souris appliquée avant la première frame de course; premiers tirs sur le même axe que le Fox; aucun mouvement racine parasite des animations.

First checkpoint:
- [x] Reproduire le décalage montré par les trois captures.
- [x] Limiter les modifications au démarrage Runner, aux clips Fox et aux projectiles.
- [x] Préserver les autres mini-jeux et les changements sales sans rapport.
- [x] Ajouter un test de régression avant la correction finale.
- [x] Vérifier le vrai lancement dans `http://127.0.0.1:5173/`.
- [x] Arrêter lorsque tests, typecheck, build, preuve navigateur et revue passent.

Timed checkpoint:
- requested duration: N/A, aucune durée demandée
- semantics: résultat vérifiable, pas de temporisation artificielle
- initial confidence score: 70/100 après reproduction
- improvement loop: mesure des racines Mixamo, test rouge, correction, tests et preuve navigateur
- final score / loop closure: 100/100, seuil atteint

Completion threshold:
- PRD issue: N/A, correctif local de faible portée.
- Vertical slice issues: N/A, un seul slice atomique.
- Le démarrage initialise `playerX` et `playerTargetX` ensemble.
- Les clips Fox restent en place sur X/Z tout en conservant leur mouvement vertical.
- Les projectiles démarrent devant le modèle.
- Les tests Runner, la suite complète, le typecheck et le build passent.
- Le vrai lancement décentré montre le Fox et les premiers tirs alignés, sans erreur console.
- La revue ne contient aucun finding bloquant.

Verification surface:
- `npx tsx tests/runnerRules.test.ts`
- `npx tsx tests/runnerHeroAnimation.test.ts`
- `npx tsx tests/runnerFireballRenderer.test.ts`
- `npx tsx tests/runnerMenuScene.test.ts`
- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Browser intégré sur `http://127.0.0.1:5173/`, ouverture Runner, clic Run, déplacement à droite pendant la transition, capture de la première frame.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-17-runner-alignement-fox-tirs-d-marrage.md`

Constraints:
- Ne pas modifier les autres mini-jeux.
- Ne pas réécrire les animations ou assets déjà installés.
- Préserver les changements locaux sans rapport.
- Utiliser le navigateur intégré pour la preuve réelle.

Boundaries:
- Source of truth: demande, captures et comportement réel du Runner.
- Allowed edit scope: `actions.ts`, `runnerRules.ts`, `runnerThreeLane.ts`, `runnerHeroAnimation.ts`, `hud.ts`, tests Runner et ce plan.
- Browser surface: panneau Runner local sur `http://127.0.0.1:5173/`.
- Tracker sync: N/A, micro-correctif sans issue.
- Non-goals: équilibrage, nouveaux assets, refonte du terrain, autres mini-jeux.

Blocked condition:
Arrêter uniquement si le Runner ne peut pas être lancé, si les assets Fox sont illisibles ou si aucune preuve fiable n’est possible. Aucun blocage rencontré.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Demande et captures suffisamment précises; aucune question matérielle nécessaire |
| Prompt requirements captured before work | yes | First checkpoint ci-dessus |
| Timed checkpoint parsed | yes | Aucune durée demandée |
| Active goal checked or created | yes | Goal `019f41dc-55e9-7191-b974-050bf461d370` |
| Source of truth read before edits | yes | Captures, code Runner et GLB inspectés |
| Tracker target verified | no | N/A, aucune publication nécessaire |
| PRD publication decision recorded | yes | N/A, micro-correctif |
| Slice publication decision recorded | yes | N/A, slice atomique |
| First useful slice selected | yes | Initialisation atomique Fox et tirs |
| TDD decision before behavior change or bug fix | yes | Tests rouges ajoutés avant correction finale |
| Browser/game proof decision recorded | yes | Browser intégré requis |
| Review target selected before closeout | yes | Fichiers Runner modifiés et tests associés |
| Browser pack selected | yes | `browser` |
| Browser route / app surface identified | yes | URL locale et panneau Runner |
| Browser tool decision recorded | yes | Browser intégré, sans fallback |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source lue et questions ou raison explicite | Trois captures et demande littérale; aucune question nécessaire |
| 2. autogoal | complete | Goal et plan | Goal actif et ce plan |
| 3. to-prd | complete | Issue ou N/A | N/A, bug local à contrat évident |
| 4. to-issues | complete | Issues ou N/A | N/A, un seul slice atomique |
| 5. implement | complete | Slice et propriétaires | Démarrage atomique, clips in-place, origine de tir avancée |
| 6. browser/game playtest | complete | Route, interaction et résultat | Lancement décentré à droite; Fox et deux tirs alignés; console vide |
| 7. review | complete | Cible et findings | Revue des fichiers Runner et tests; aucun finding bloquant |
| 8. close with evidence | complete | Handoff préparé | Tests, build, navigateur et score préparés |

Work Checklist:
- [x] Exigences et frontières capturées.
- [x] Objectif, seuil, vérifications et condition de blocage concrets.
- [x] Timed checkpoint marqué N/A avec scores de confiance.
- [x] Auto Step Ledger tenu à jour.
- [x] PRD marqué N/A avec raison.
- [x] Issues marquées N/A avec raison.
- [x] Premier slice sélectionné et implémenté.
- [x] Patterns voisins lus avant édition.
- [x] Correction placée dans les propriétaires Runner existants.
- [x] Preuve navigateur faite avec l’outil approuvé.
- [x] Revue faite après implémentation et vérification.
- [x] Handoff final assemblé.
- [x] Route, interaction et résultat visuel enregistrés.
- [x] Console navigateur contrôlée, zéro warning et zéro erreur.
- [x] Preuve faite sur le vrai mini-jeu Runner.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Enchaîner source, goal, TDD, implémentation, preuve, revue | Ledger complet |
| PRD published | no | N/A autorisé pour micro-tâche | N/A, correctif local |
| Slice issues published | no | N/A autorisé pour micro-tâche | N/A, slice atomique |
| Implemented slice | yes | Nommer le slice | Alignement Fox, lancement et origine projectile |
| Typecheck/build/test proof | yes | Exécuter les contrôles | Tous verts; avertissement Vite de taille de chunk non bloquant |
| Browser/game proof | yes | Exercer le lancement affecté | Fox à droite et premiers tirs sur son axe dès la première frame |
| Review | yes | Revoir les changements | Aucun finding bloquant |
| Final handoff completeness | yes | Résumer preuves et score | Préparé |
| Timed checkpoint | no | N/A si aucune durée | N/A, aucune durée demandée |
| Goal plan complete | yes | Exécuter le checker | À exécuter après cette mise à jour |
| Browser interaction proof | yes | Ouvrir Runner et lancer | Réussi sur URL locale |
| Browser console/network check | yes | Contrôler les erreurs | Console `[]`; réseau hors scope car assets déjà chargés avec succès |
| Browser final proof artifact | yes | Capture ou trace | Capture de la première frame avec deux tirs alignés |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Captures et demande sans ambiguïté matérielle | autogoal |
| Autogoal setup | complete | Goal et plan créés | PRD |
| PRD | complete | N/A, micro-tâche | issues |
| Issues | complete | N/A, slice atomique | implementation |
| Implementation | complete | Contrats et rendu Runner corrigés | browser proof |
| Browser/game proof | complete | Première frame décentrée alignée | review |
| Review | complete | Aucun finding bloquant | closeout |
| Closeout | complete | Preuves réunies | final response |

Findings:
- `handleRunnerPointerMove` ignorait la souris pendant le hub et la transition.
- Le démarrage créait la course au centre puis demandait au Fox de rattraper la souris; les tirs déjà créés conservaient leurs anciens X.
- Les pistes Mixamo contenaient des translations absolues X/Z différentes selon le clip.
- Le mesh du projectile s’étendait derrière son origine logique.

Decisions and tradeoffs:
- Transmettre la dernière position de souris à l’action de démarrage et initialiser les deux positions ensemble, plutôt que masquer le rattrapage visuellement.
- Neutraliser seulement X/Z de la racine Mixamo; conserver le mouvement vertical relatif.
- Avancer l’origine de tir de `1.25` unité sans réduire sa portée utile.
- Ne pas publier de PRD/issues pour éviter du bruit de tracker sur un micro-correctif.

Review fixes:
- Le premier essai appliquait `onMove` après `startRunnerRun`, ce qui conservait une interpolation et la diagonale des premiers tirs.
- La revue a remplacé ce flux par `onComplete(pointerTargetX)` et une initialisation atomique dans le store.
- Aucun finding restant.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Fox démarrait au centre puis glissait vers la souris | 1 | Passer la position dans l’action de démarrage | Corrigé et couvert par test |
| Le premier essai navigateur revenait vite au hub | 1 | Capturer dès que le HUD devient visible | Première frame capturée avec succès |

Timeline:
- 2026-07-17T00:54:12.651Z: goal et plan créés.
- 2026-07-17: racines Mixamo et géométrie de projectile mesurées.
- 2026-07-17: tests rouges ajoutés puis correctif implémenté.
- 2026-07-17: tests ciblés, suite complète, typecheck, build et diff check validés.
- 2026-07-17: preuve navigateur réussie et console vide.

Verification evidence:
- Tests ciblés: `runnerRules ok`, `runnerHeroAnimation ok`, `runnerFireballRenderer ok`, `runnerMenuScene ok`.
- Suite complète: 46 fichiers de test réussis.
- Typecheck: exit 0.
- Build: exit 0; avertissement préexistant de chunk supérieur à 500 kB.
- `git diff --check`: exit 0.
- Browser: `standardRun`, `data-runner-fireball-instance-count=2`, Fox décentré à droite et tirs verticalement alignés au premier rendu.
- Console browser: `[]`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Réponse finale puis clôture du goal |
| What is the goal? | Supprimer le décalage Fox, démarrage et tirs |
| What have I learned? | La dérive combinait initialisation tardive, root motion Mixamo et origine du mesh |
| What have I done? | Unifié les positions, normalisé les clips, avancé les tirs et prouvé le lancement réel |

Open risks:
- Aucun risque fonctionnel identifié sur le correctif.
- Le build conserve un avertissement de taille de chunk sans rapport avec cette tâche.
