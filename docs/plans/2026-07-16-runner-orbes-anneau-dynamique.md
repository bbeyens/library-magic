# Runner - orbes en anneau dynamique

## Objectif

Entourer le Fox avec les orbes Multishot sur 360 degrés et plusieurs hauteurs, avec une réorganisation fluide lors des ajouts et retraits et une capacité prototype de 20 orbes.

## Critères

- À 5 orbes, le Fox reste au centre et des orbes occupent les côtés, l'avant et l'arrière.
- À 20 orbes, la formation reste centrée, espacée et répartie verticalement.
- Un changement de quantité interpole les positions au lieu de les téléporter.
- Le gameplay reste limité à 5 Multishots; un paramètre de développement permet seulement la prévisualisation à 20.
- Le rendu reste instancié en quatre draw calls maximum.
- Tests, typecheck, build et captures à 5/20 orbes validés.

## Étapes

- [x] Auditer la formation et le rendu actuels.
- [ ] Ajouter les tests de formation et de transition.
- [ ] Implémenter la distribution 3D et l'interpolation.
- [ ] Vérifier les prototypes 5 et 20 dans le navigateur.
