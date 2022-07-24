## Transitions

à résoudre :

- tableaux de valeurs dans string (couleurs)
- objets imbriques
- distinction entre transition A->B et initial -> T -> initial

utiliser dans un premier temps la methde simple :

- retenir et appliquer la structure de "to"
- ne pas faire de comparaison avec "from"
- comparer seulement le nombre de termes à comparer
- comparer les string supportant les valeurs : elles doivent etre identiques
  La vérification de from et to devrait se faire avant, au moment de l'interprétation des données.

**L'objet Perso est réputé etre conforme.**

todo :
[ ] comparer from et to pour qu'ils aient les memes props
[ ] completer avec le style courant
[ ] parcourir l'objet pour identifier toutes les propriétés de style animés du perso, leur donner une valeur par défaut
[ ] transitions nommées : définies avant l'exécution ?
[x] repeat
[x] yoyo

### Les animations "stationaires"

un "acteur" dans une animation possede plusieurs etats correspondant à des evenements comme :

- l'entrée,
- la sortie,
- l'attente. Une ou plusieurs animations d'un état "idle" dont l'acteur peut sortir pour une transition vers une autre état.
  Plutot un modele "jeu video"

c'est une façon différente d'animer que d'enchainer une série d'états. Ces deux approches peuvent se completer.

#### un point sur move

move enregistre les déplacements d'un element d'un layer à l'autre.
il permettra aussi de déplacer un élément à l'intérieur d'un layer.

il y a 3 endroits ou les operations se font :

- channel-perso - move
  prépare les éléments à manipuler selon les indications données
- queue - render
  ajoute, retire, deplacer l'élément donné
- layer - update
  met à jour le contenu.

il est souhaitable que le contenu soit mis à jour via la queue, qui garantit que l'opération se fait entre deux frames.
entre deux rafraichissements, plusieurs elements peuvent etre ajoutés. il faut les stocker temporairement.
c'est le role de la queue. cependant le contenu est traité indifférement.
-> identifier la nature de content et le traiter en conséquence.
Avantages

- c'est le bon endroit pour faire ce traitement
  inconvénients :
- cela éclate le traitement sur plusieurs composants
- cela rend le systeme moins modulable.

les fonctions d'ajout - retrait peuvent etre placées dans le composant Layer, et activés dans move.

Transition comme un strap.
Sans avoir à tout remanier, il y a deux type d'evaluation des events :

- les events réguliers, consignés,
- et les events transitoires, notamment dans les strap

Jusqu'à présent, les channels strap et persos ne se mélangent pas. Mais transition se prete à un emploi comme strap, mais lu depuis channel.persos.
Tenter deux flux disctinct à la place du seul run :

- run pour les events réguliers,
- runNext pour les transitoires.
  -> modifier dans channel-strap
