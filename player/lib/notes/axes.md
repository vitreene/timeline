## Axes de developpement

A. Librairie

En vue de proposer une API, rendre la librairie la plus modulaire possible pour la personnaliser avec le moins de contraintes possibles.

1. modularité

- penser les "actionners" comme des plug-ins
- proposer une api commune pour les animations externes :
  - video
  - lottie
  - three
  - gsap
    passer les valeurs : delta, progression,
    events : init, start, pause, stop, seek
- separer la partie timer qui gere les events de l'actionner qui gere les changements d'état

2. animations

- poses : des animations reversibles
- animation / sequence = suite de changements d'états du composant, simultanés ou à la suite
- mixeur de propriétés : si une meme propriété poseede plusieurs valeurs, les mélanger
- micro-animations : décrites par un nom et quelques propriétés, les micro-animations gerent des effects de transitions sur les contenus (changement de texte et effets d'apparition/disparition notamment)
- animation svg : interpolation de trajets, déplacement sur les trajets
- FLIP d'images

3. Fonctionnalités

- propager la position transform du parent via matrix
- FLIP entre deux éléments sur des branches différentes du dom
- Pin, point de référence sur lequel s'ajuste plusieurs elements

4. démo : stress-test combinant tous les éléments disponibles

B. Format de fichier

Créer un format de document permettant d'exprimer une séquence de façon concise

- construction par héritage de propriétés
- parametrage par configuration
- List : générateur de listes
- contenus,
- styles,
- éléments
- grille d'affichage
- décalages

Des variantes de parser permettent de transformer un format legacy vers le format standard

C. Apps Vitreene
un editeur et un player
une app utilisateur

- construit des vues à partir d'un minimum d'informations
