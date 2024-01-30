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

atTick

- elaguer les moves qui sont achevés :

  - comparer seekElapsed et delta + duration = nDelta
  - si seekElapsed > (delta + duration) , la transition est finie
    - placer les elements mais ne pas créer de transitions
  - sinon,

- s'il reste plusieurs moves, les traiter dans l'ordre temporel.
  - prendre les mesures,
  - updater les elements,
  - poser l'element,
  - reprendre les mesures
- renvoyer la collection de moves
  - garder le delta, qui permettra de calculer le step de la transition

Limite : l'ordre dans lequel les mesures sont faites est important : il faut que l'élément parent existe dans le DOM pour que la mesure puisse se faire.
-> Si le parent n'est pas dans le DOM, il n'y a pas de transition de position à faire (les transitions d'apparition se font autrement)

Probleme principal : si le déroulé de seek n'est pas identique au déroulé "normal", il y a toujours un risque d'obenir un résultat différent.

cas particulier : une position peut dépendre d'une position parente en mouvement ; il faut pouvoir vérifier et mesurer la position de l'ensemble des parents d'un élément. cela est valable aussi pour toutes les autres transformations , scale et rotation.

dans seek , comment evaluer si un élément doit bouger ou non ?

- Si un élément est ajouté ou retiré, il ne doit pas y avoir d'animation de mouvement
  - les animations terminées,
  - les animations ou from et to sont identiques,
    doivent etre annulées.
    Le probleme principal vient des mesures erronées si l'élément n'est pas dans le DOM. -> il faut renvoyéer null si pas dans le dom ?

echec 2 : si une position est modifiée durant le seek, il faut à chaque fois prendre un snapshot des éléments :
exemple : les élément sont posés, puis un élément est retiré. cela entraine naturellement un décalage des elments qui suivent celui retiré. Si je caclule tout d'un coup, ces éléments ne vont pas "voir qu'il manque un élément et se décaler.
donc, à chaque fois qu'il y a un mouvement, il faut lire les positions et rendre les élements.
On pourrait créer une liste d'actions à rejouer, élaguer ce qui ne sert plus (les transitions terminées, les élements retirés, puis appliquer la séquence restante. )

REFAIRE
une liste des opérations à mener, regroupées par temps :

Map<delta,
Map<PersoId, {
action: "add" | "move" | "remove" | "reparent",
target : null | PersoId,
parent : null | PersoId,
order number | string,
delta: number,
duration: number
}

>

add :

- l'élement n'est pas dans le DOM, pas de transition
- transition pour les sibling
  move :
- transition pour l'élément et les sibling
  remove :
- l'élement n'est plus dans le DOM, pas de transition
- transition pour les sibling
  reparent:
- l'élément est retiré du parent, transition pour les sibling
- l'élément est ajouté au target, transition pour l'élément et les sibling

Le parent est susceptible de bouger lui-meme si ses dimensions sont liées à son contenu. Transition pour le parent.
Les enfants des éléments qui sont en transitions pourraient eux aussi bouger !

pour chaque delta,

- pour chaque opération:
- maj perso.parent
- maj parent.content, target.content
- maj nodelist
  -> TransitionList Set<PersoId>.add( ?element, sibling)

élaguer pour seek :

- les transitions terminées
  les insertions ont été filtrées.

- calculer les positions avant/après
- élaguer les transitions statiques from === to

Il va y avoir un gap si un élément est déjà en transition ?
les positions "avant" doivent intégrer une transition en cours. Vérifier si c'est le cas quand move est appliqué.
Il doit y avoir une séquence de update/render à chaque move !

//
move achevé ? -> move.to
move en cours -> remonter au début du move -> snapshot
si au snapshot, d'autres move son en cours, refaire la meme opération
eventuellement, remonter la chaine des snapshots à réaliser, puis les d&rouler dans l'ordre
