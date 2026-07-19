# Runner - coûts des compétences

## Objectif

Rendre les premiers achats Runner accessibles après quelques éliminations, tout en conservant une progression de prix forte sur les niveaux avancés.

## Critères

- Dégâts coûte `1` pièce au niveau 0.
- Chaque compétence coûte au maximum `8` pièces pour son premier niveau.
- Chaque niveau suivant coûte strictement plus cher que le précédent.
- Les compétences avancées restent plus chères que les améliorations fondamentales.
- Les achats utilisent toujours uniquement les pièces Runner.
- Tests Runner, suite complète, typecheck, build et menu Skill vérifiés.

## Étapes

- [x] Auditer les coûts et gains initiaux.
- [x] Ajouter les tests de la nouvelle économie.
- [x] Implémenter les coûts recalibrés.
- [x] Vérifier le menu Skill et les commandes du projet.

## Résultat

- Prix initiaux: Dégâts `1`, Vies `2`, Cadence `3`, Vitesse latérale `2`, Portée `3`, Multishot `8`, Homing `6`, Vitesse projectile `3`, Portails `4`, Pièces `3`.
- Courbe Dégâts: `1, 2, 3, 4, 6, 9`, puis croissance exponentielle continue.
- `npm test`, `npm run typecheck`, `npm run build` et `git diff --check` passent.
- Menu Skill vérifié dans le navigateur; les dix prix sont corrects et la console est propre.
