# content et render

comment doit fonctionner render

- son propre système de rendu, inspiré par une fonction h -> voir sinuous
- une interface qui permet d'associer le moteur de rendu de son choix.

Timeline ne renvoie que les propriétés qui changent dans un node.

Il ne doit pas y avoir d'opération d'écriture dans le DOM en dehors du rendu.

La propriété content doit alors renvoyer :

- la valeur nombre, string, src d'un contenu,
- un node ou tableau de nodes si c'est un slot

En cas de micro-intéraction, une string est remplacée par un fragment.
Un composant temporaire est alors créé qui prend content en entrée et restitue un node en sortie.

Dans cette version de projet, pour l'instant il n'y a pas de notion de composant dédié (texte, image, etc).
Un texte avec micro-intéraction pourrait etre un composant distinct d'un composant texte simple ?

dans ces cas, content pourrait etre une fonction qui accepte une valeur et renvoie un node
