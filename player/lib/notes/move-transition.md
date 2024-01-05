## enjeux

## etapes

move - remove boolean

- true : transition auto entre les deux positions
- false : retire l'élément de son parent (sur le onComplete de la transition)

supprimer/modifier la ref au parent et la ref du content

- parent ≠ target = enchainer remove content puis add content
- si pas de parent = 1re insertion
- si move dans le meme parent -> pas de double sequence remove/add
- si pas de target remove

revision v1:
dans cette version, le dom est actualisé ç chaque modification.
Il faut permettre un autre cycle :

- toute les modifs sont enregistrées,
- au raf, les permutations du DOM sont effectuées en une seule fois.

Résoudre :

- une transition va interrompre la précédente
- la saisie du w/h peut entrainer des erreurs de mesure (sur une trasition entamée pas ex.)
- utiliser une première version du mixer : les valeurs de transition se superposent à celles par défaut. Etablir des regles : remplacement, fusion, moyenne ?

etapes :
cycle:
Recueillir toutes les modifs.

- pour chaque modif,
  - si n'existe pas :
    - trouver parent
    - trouver tous ses enfants
    - Set list
    - opération sur l'élément : ajout, supp, move.
      -> associer au parent la list
      -> ? signaler si l'élément n'existe pas encore dans le DOM ?
  - s'il existe :
    - actualiser list.

Au raf :

- mesurer les positions de chaque élément dans les list;
  Idéalement, il faut commencer par les éléments imbriqués les plus profonds. Cepandant, pas trop d'optimisation au départ, ce n'est pas le but de ce projet
- appliquer les nouveaux styles - classes;
- réattribuer les éléments dans les nodes parents
- mesurer les nouvelles positions
- actualiser les persos avec les nouveaux children

- lancer les interpolations ;

Envoyer les valeurs au mixeur sur un canal distinct qui prend le prend le pas sur les autres valeurs
