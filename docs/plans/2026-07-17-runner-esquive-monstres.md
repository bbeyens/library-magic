# Runner - esquive des monstres

## Objectif

- Un ennemi normal qui dépasse le Fox hors de sa largeur de contact est retiré sans dégâts.
- Cet ennemi esquivé ne donne ni kill ni pièce.
- Un ennemi normal qui touche réellement le Fox conserve les dégâts selon ses PV restants.
- Un mini-boss ou un boss arrivé au Fox inflige ces dégâts quelle que soit sa position latérale.
- La règle est couverte par des tests de régression et la suite du projet reste verte.

## Preuves

- [x] Test rouge pour l'esquive d'un ennemi normal.
- [x] Test rouge pour le contact obligatoire d'un mini-boss et d'un boss.
- [x] Tests Runner verts.
- [x] Suite complète, typecheck et build verts.
