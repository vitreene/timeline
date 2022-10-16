vu l'étendue de l'interface de Three, et son autonomie (clock), ne pas chercher à décalquer l'interface.
Penser facilité d'usage.
N'est concerné pour le moment :

- les mouvements sur un objet particulier;
- les animationActions, déclenchés par un event.

dans le store :

- la description des actions associées aux events, comme pour les composants html ;
- un composant Three dont le node est un canvas.
- ce composant recoit un "content" qui contient la logique de l'objet Three.
- en alternative, ce pourrait etre un Strap.
- dans ce script :
  - une partie init va créer la scene, les illuminations, dispatcher les animations
  - une partie update recoit les instructions à gérer : lancement d'anim, mise à jour de positions...
    -> la partie channel est simplifiée, et se consacre à selectionner et transcrire les actions vers le composant.
