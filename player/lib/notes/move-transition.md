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

## a fixer

le seek se déroule mal.
des transitions sont engagées pour tous les élements lorsque une action est requise - retrait, déplacement - chaque élément perd sa position

la méthode initMoveTransitions est appelée une seule fois, ce nest peut-etre pas suffisant ?
-> les transitions sont toutes appelées en meme temps, meme si en logique elles devraient etre terminées. -> les transitions ne sont pas appelées au bon temps.

au moins, il faudrait qu'elle soit appele une fois par cycle ou "move" a été demandé.

echec des tests.
Le déroulement du seek n'est pas identique au deroulement régulier.
Il faut revoir la façon de réaliser l'opération.

Il faudrait tester l'hypothèse ou la méthode ontick n'est appelée qu'une seule fois.
toutes les modifs du onMove sont enregistrées, onTick n'est joué qu'une seule fois.

Il y a un décalage entre le moment ou se calculent les transitions et le moment ou elles devraient se déclencher.
en cacluant seulement les moves, je perds à quel moment ils ont lieu et si il faut effectuer des transitions.
-> il faut passer le delta avec chaque move

il faut passer le delta avec this.moves Map<parentid, Map<delta: content>>
par souci d'efficacité, il faudrait eviter les lectures du DOM inutiles. Il faut donc éliminer les transitions achevées = elapsed > delta+ duration
duration n'existe pas encore, il faudrait l'ajouter comme paramtre optionel de move
