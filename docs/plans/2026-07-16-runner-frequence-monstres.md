# Runner - fréquence des monstres

## Objectif

Réduire de 35 % la fréquence des monstres pour augmenter leur espacement, tout en conservant une accélération graduelle avec la distance.

## Critères

- Intervalle initial: `1,46 s` au lieu de `0,95 s`.
- Intervalle minimum: `0,34 s` au lieu de `0,22 s`.
- La fréquence continue d'augmenter avec la distance.
- Aucun changement de vitesse, PV, dégâts ou récompenses.
- Tests, typecheck, build et partie réelle vérifiés.

## Étapes

- [x] Mesurer la courbe existante.
- [x] Ajouter les tests de fréquence.
- [x] Recalibrer la courbe.
- [x] Vérifier le résultat.

## Résultat

- Fréquence multipliée par `0,65`, sans changement des statistiques des monstres.
- Intervalles vérifiés: `1,46 s` à 0 m, `0,69 s` à 700 m et plancher de `0,34 s`.
- `npm test`, `npm run typecheck`, `npm run build` et `git diff --check` passent.
- Runner lancé dans le navigateur; projectiles et ennemi rendus, console propre.
