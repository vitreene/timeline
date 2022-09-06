## micro-animations

désigne des animations de transition portant sur les contenus, texte pour commencer, et prédéfinis.
Génére à la volée des persos , leurs actions, et les events qui s'en suivent.
"Content" doit acceder à Timeline et createPersos

Créer un générateur :

- génère des persos pour chaque lettre
- id : la phrase à modifier avec une exergue sur la lettre : ma-c-hine , mac-h-ine
- action d'entrée, d'en-cours, de sortie
- mise en cache, key = currentime, ou texte + effet ?
- events : progress, stagger, delay : uniforme, unitaire, aleatoire borné

Idéalement, la cascade d'events est issue d'un seul event. Comme pour Transition, il faudrait garder ce seul event et reconstituer les autres, avec mise en cache

Texte
portée : phrase - mot - lettre

Layer
associer aux éléments d'une grille

Image : image découpée
