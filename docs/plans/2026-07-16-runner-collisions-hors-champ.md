# Runner collisions hors champ

## Objectif

Empêcher un ennemi qui n'est pas encore visiblement entré dans la zone de jeu d'absorber ou de détourner un projectile, sans modifier les collisions des ennemis et portes visibles.

## Seuil de réussite

- Un test déterministe reproduit le tir absorbé par un ennemi fraîchement créé hors champ.
- Le test échoue avant le correctif et passe après.
- Une cible entrée dans la zone visible reste touchable.
- Le guidage ne vise pas une cible encore hors champ.
- `npx tsx tests/runnerRules.test.ts`, `npm test`, `npm run typecheck` et `npm run build` passent.
- Le Runner réel est vérifié dans le navigateur, sans nouvelle erreur console.

## Limites

- Source de vérité: simulation Runner dans `src/game/simulation/actions.ts` et règles partagées Runner.
- Aucun changement de terrain, statistiques, économie, modèles ou autres mini-jeux.
- Aucun commit ou push sans demande explicite.

## Étapes

- [x] Reproduire le cas hors champ avec un test rouge minimal.
- [x] Classer et tester les hypothèses collision, porte, guidage et rendu.
- [x] Corriger la cause à la frontière simulation/rendu.
- [x] Exécuter les vérifications ciblées et globales.
- [x] Vérifier la partie réelle et la console dans le navigateur.

## Résultat

- Repro avant correctif: l'ennemi à `44` unités perdait `4 PV` et absorbait le projectile.
- Correctif: collision et homing ignorent la marge de spawn jusqu'à `40` unités; les monstres restent pré-rendus dans le brouillard.
- Régressions: cible visible touchée, cible hors champ ignorée par le homing, porte fermée bloquante et porte activée traversable.
- Vérification: test Runner, suite complète, typecheck et build verts.
- Navigateur: stress test avec compétences maximales; tirs conservés à `44` puis `41,06` unités, cible tuée après entrée dans la zone; aucune erreur ou alerte console.
