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

08/08/22

## nouvelle chaine de rendu

mieux distribuer les roles pour optimiser le rendu.

- queue ne va renvoyer que les updates cumulés entre deux ticks.
- diff vérifie qu'il n'y a pas de doublon et ne garde que ce qui est nouveau
- render calcule les valeurs définitives avec le zoom

## chemins de rendu

selon la nature des propriétés à traiter, les calculs sont différents.

- content : pas d'évaluation, un nouveau content est passé tel quel.
- atributs: idem
- style : deux modes, string ou objet.
  - string est passé el quel, sans évaluation et vient remplacer le style précédent.
  - objet : chaque prop est ajoutée individuellement, une valeur null supprime la prop.
- transform : un objet dont les props sont fusionnées avec style, et qu'il faut séparer ( à revoir ?)
  - des alias doivent etre résolus x -> translateX
  - les propriétés existantes sont ajoutées pour produire une string en sortie
  - une propriété transform doit exister dans perso.
- class : string ou objet
  - string remplace la class existante
  - objet : 4 propriétés – add, remove, toggle, replace – avec un tableau de string come valeurs
    cet objet est explicite, il peut etre issu de valeurs implicites défini par ailleurs.

Note de rappel : le json de référence doit etre explicite au risque d'etre lourd, ce qui permet différentes approches pour le générer
