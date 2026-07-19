# Runner - popup de pièces et fumée de mort

## Objectif

- Chaque monstre tué crée un événement borné avec position, montant et identifiant stable.
- Le modèle fourni `coin.fbx` est converti en GLB et utilisé dans le popup.
- Le montant gagné monte au-dessus du point de mort sans redémarrer pendant les ticks.
- Une fumée low-poly instanciée masque la disparition du monstre.
- Un monstre esquivé ne crée ni récompense ni effet de mort.
- Le rendu reste borné même si plusieurs monstres meurent ensemble.

## Preuves

- [x] Tests rouges puis verts pour les événements de mort et l'absence d'effet sur esquive.
- [x] Asset GLB validé et chargeable.
- [x] Tests complets, typecheck et build verts.
- [x] Capture navigateur avec popup et fumée visibles.
