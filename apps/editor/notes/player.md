intégrer le player

en premier lieu, créer la génération d'un fichier.
Par le concept meme des capsules, des éléments communs peuvent etre répresentés par des classes CSS.

1. Créer un ensemble de classes pour le carrousel.

   - une div cadre occupant toute la surface,
   - une animation d'entrée pour l'image, une autre pour la sortie, une troisième pour l'état idle
     ex : passe vue
     entrée : translate x -100% -> 0
     idle : scale 1 -> 1.25 durée 10s
     sortie : translate x 0 -> -100%

2. construire l'animation :

- table d'events,
- par élément : actions {entrée,idle,sortie}
- capsule : actions

3. l'animation est reconstruite après

- chaque modif des capsules
- modif dans les médias de la scene
