prealable
evaluer :

- Persos commme class avec add et init
- display update independant

trouver a quel endroit placer les µ-animations -> actonner ?
utiliser la creation de perso pour les elements span
-> rendre independant persos.

- séparer la logique "group" des layers pour pouvoir l'utiliser dans d'autres contextes.

le design des µ-animations prépare celui de "List"

children dans persos.
ne pas réserver children à Layer, car un élément texte peut etre transformé en tableau lors d'une transition.

ou, commnent stocker les références
si un perso a des enfants :

- ce sont d'autres persos,
- c'est du contenu inactif -> enrobé dans un perso ?

reférencer les nodes enfants par l'id du perso.
content = Set<id>
content reférence des tableaux ordonnés de ref aux persos

? si un élément n'est pas un perso ?
comme enfant d'un layer, il faut pouvoir appliquer des transition d'entrée et de sortie. donc, il faut un perso -> Layer
On peut convenir qu'un perso contienne des éléments qui ne sont pas gérés

-> créer une classe Content / Group

methods

- add (position)
- remove
- move
  ces opérations déplacent les élements dans la vue

Note : modifier persoStore qui ne doit plus etendre Map, mais intégrer la prop store pour stocker les persos
