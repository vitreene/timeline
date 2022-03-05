# Clock

Clock est un chronomètre pilotable (events : play, pause, rewind, seek, stop...)

Clock et Timeline sont couplés
Clock execute Timeline.tick(Chrono.now() )

Clock est un event emitter.

Clock devrait pouvoir emettre plusieurs chronos, de façon à ne gérer qu'une instance par projet.

Sur un projet, il faut des compteurs pour :

- le temps ecoulé depuis le lancement du projet,
- le temps de lecture total écoulé hors pause,
- le temps ecoulé de lecture d'une scène
- divers compteurs dans une scène (compte à rebours, chronometres...)

# Timeline

Cette classe fonctionne de manière différente du projet dont elle dérive.
ici, l'idée est d'utiliser le couple Timeline/clock à la place d'events emitters.
On ajoute à tout moment des données à diffuser. qui sont emises au fur et à mesure dès que Clock est lancé.
Clock est déclenché tous les 1/100e de seconde, mais la granularité des evenements est de l'ordre du 1/10e.
Tous les events situés entre le tick et le suivant sont exécutés :

- au tick 500, tous les evenements entre 500 et 599 sont exécutés.
  Cela permet de créer des priorités d'execution selon le délai.
  Les données à diffuser sont regroupés dans un tableau, les premières sont envoyées en premier.

## Inputs

### eventtimes

Dans une story, un tableau d'association entre un label et un temps en millisecondes

```js

{
  500: {channel: 'anim', action: 'enter'},
  900: [{channel: 'anim', action: 'move01'},{channel: 'strap', action: 'move'} ],
}
```

### les actions

```js
{
 element01:
  [{
    enter:{
      move:{to:'id01'},
      transition:{from:'right'},
      style:{x:500,color:red}
   },
    move01:{
      move:{to:'id02'},
   },
   ...
   }]
   ...
 }
```

### un imput traité directement

```js
{
  element01:
  { move:{ x:500,y:50} }
}
```

ici, "move" est écouté par un ou plusieurs éléments qui vont réagir.
Les écouteurs ne sont pas traités par cette librairie
Les inputs sont consignés dans la timeline, meme s'ils sont exécutés immédiatement, pour relecture.

### classement

les inputs sont regroupés :

- par canal de diffusion : animation, strap, etc.
- par temps
- par ligne temporelle (track) : play, langue, interaction, pause...

timeline

- tracks
  - time
    - channel
      - element

### labels

La clé d'un event est une valeur numérique représentant le nombre de millisecondes écoulées depuis le début de la scène.
La clé peut être aussi :

- un label
- une expression relative (voir gsap)
  une table de labels permet de les substituer aux valeurs numériques.
  Un label n'est pas forcément disponible immédiatement. Les données qui en dépendent sont remisées en attendant la résolution du label.

### expressions

les expressions permettent de calculer des temps relatifs à une référence :

- l'élément ou l'événnement précédent,
- un label.
  voir gsap pour le vocabulaire ; en gros : '+=', '-=' devant un nombre indique un temps relatif à au temps de référence.

Labels et expressions devraient pouvoir etre résolus à niveau de l'interprétation du fichier. Cependant, la librairie doit pouvoir traiter des événements live. Ces valeurs sont calculées au fur et à mesure.

### Channel

A chaque Channel est associé une fonction d'update, qui va diffuser au bon endroit ls données qui arrivent
à l'initialisation, un ou plusieurs channels sont créés, avec un nom et un callback

### Tracks

Les tracks permettent d'isoler des pistes où sont placés les inputs. Les tracks peuvent etre activés, desactivés, et ont leur propre ligne de temps.
Le temps est un dérivé du temps de la scène. La plupart du temps, le temps est le meme que celui de référence, ou bien 0 s'il l'on souhaite démarrer une séquence de la meme façon.
exemple :

- track "play" joue la scene
- track "pause" démarre à 0 à chaque fois pour jouer une animation d'attente
  ici, chaque track désactive l'autre (utiliser un state machine ?)

  Les tracks influent sur les actions, et non pas les éléments déjà placés à l'ecran.
  Cependant, l'activation de "pause" peut, par exemple, déclencher une action qui les masque.

  Il faut definir comment chaque track est activé ou désactivé. :

  - A "pause", tous les autres tracks sont désactivés.
  - a "play" le track lié à à la langue est activé, le track "pause" est arrété.

### les données d'entrées dans Timeline

- eventimes : {time : {event, channel}[] }
- états :
  - actions : {id_perso: { id_action: action }[] }[]
  - listens : _map events to actions_ {channel : {event: id_action}}

Listens sert à dispatcher plusieurs actions à partir d'un seul event
En l'absence de listens, event === id_action
Les actions qui ne sont pas reliés à un event sont suspendus, sauf si le libellé est un nombre (id_action === time)
A chaque ajout d'eventime, les actions suspendues sont à nouveau evaluées

Un input recoit une propriété time pour une execution immédiate et une consignation dans le cache de la timeline.

Dans quel ordre recevoir ces objets ?
listens et actions doivent etre traités en meme temps, pour résoudre les manques.
il peuvent meme etre résolus avant recéption. Ne pas en tenir compte.
definir des clés internes pour découpler eventimes et actions;

- si de nouveaux objets sont ajoutés, les propriétés communes viennent remplacer les précédentes.
  -> cependant, ce sont des evenements qui ne seront pas tracés par la timeline.
  On pourrait sceller la timeline avec un start() et ne permettre que des input par la suite ?
  exemple : comment gérer les events d'un jeu que l'on peut recommencer sans rejouer la scene ?

### Store

Regrouper pour une scène tout les éléments que la timeline doit gérer:
par composant :

- la fonction de création
- node
- les états :
  - actions
    - actions spéciales :
      - move
      - transition : passage d'un état à l'autre
      - animations : suite de transitions enchainées
      - états : transition ramenant à l'état de départ
  - listens
- portée des transformations : toutes les propriétés de l'objet qui vont évoluer
- état courant : résultat des transformations, avant le render
- rendered : attributs appliqué au node
- parent ref au composant parent
- transformation : matrice appliquée au composant
- position : position réelle relative à la fenêtre / la scene

transformation sert à calculer la position réelle d'un élément sur la scene, en remontant la chaine des parents pour cumuler les transformations

## Store et timeline :

La timeline reçoit à tout moment de nouveaux events et le store ajoute ou retire de nouveaux composants.
les associations entre events et actions doivent se faire en temps réel, ou bien etre révisés à chaque modification

## Fonctionnement

Timeline peut se contenter de classer les event entrant et de les renvoyer ensuite sur la partie traitement

Comment faire fonctionner :

- le mode seek
  tester ce mode en utilisant un réducer
- les events dérivés (transition, move...)
  les events générés ne sont pas envoyés dans la timeline. Ces events s'abonnent à Clock qui fournira un tick.

## seek et determinisme

une recherche n'est envisageable que si l'ensemble de l'animation est déterministe et prédictible.
Cela exclue d'office les evenements aléatoires qui doivent etre résolus pour pouvoir etre appliqués.

- les événements passés sont determinés,
- les futurs sont partiellement déterminés

(non) : Les straps doivent etre concus comme des fonctions pures pour un résultat toujours identique.

Dans les cas de saisie, par exemple de la souris, un enregistrement est fait une première fois et le strap n'est pas actif en cas de relecture.
si la lecture se fait en aval, aucune saisie n'est faite.

Si la tete de lecture est poussée vers l'avant, toutes les indéterminations sont résolues et re-employées.

Comment un événement est-il considéré comme déterminé ou non, et comment un cache est généré en conséquence ?
un strap peut générer une suite de conséquenses, toute la chaine doit etre une suite de fonctions pures.

Il n'y a aucun moyen de déterminer si une chaine de fonctions est pure. Il n'est donc pas possible de rejouer des straps.
Il faut lire les données enregistrées en retour des fonctions.

Un strap peut se présenter comme pur s'il sait renvoyer une meme donnée pour une meme entrée.
ex : un compteur, un minuteur.

Les straps sont destinés à gérer les effets de bord des inputs , il n'y a pas de predictabilité dans ce cas.

Il serait possible de distinguer les canaux où les straps sont des résultats dérivés - computed - et d'autres des side-effects non-prévisibles - inputs clavier-souris, random...

Les inputs eux-memes peuvent etre enregistrés tels quels, ou bien optimisés.

- dans une saisie, ne garder que le résultat final,
- un drag-drop souris, ne garder que les résultats des déplacements
  Techniquement, certaines opérations passent par le channel ou rien n'est retenu, et se terminent par une action via un channel ou l'opération est consignée.

Ce serait de la responsabilité du développeur de s'assurer des effets des straps ; les channels permettent de s'assurer d'un comportement selon le choix fait.

Commencer par ce qui prédictible - anim - , puis les computed, qui deviennent un channel à part.
Les channels :

- ANIM : les animations pré-ecrites. 100% prédictibles, mais doivent tenir compte d'interventions extérieures.
- COMPUTED, DERIVED : états derivés d'une entrée - fonctions pures
- INPUTS : saisies par l'utilisateur, générateurs aléatoires, ce channel n'enregistre pas de données
  ex: dans INPUTS, un générateur produit un résultat aléatoire, qui passe dans la timeline par le channel ANIM pour etre enregistré. Si seek est joué, seul ce résultat sera appelé, le générateur ne le sera pas.
  un seek dans le "futur" ne déclenche pas non plus le générateur ? -> si, une seule fois. Dans ce cas, est plutot dans un computed joué une seule fois, qui pourrait etre pré-généré.

un autre scénario : dans une séquence drag-drop, rejouer la séquence en supprimant les temps morts entre les déplacements.

- quand débute la phase d'intéraction, changement de track ;
- les actions enregistrées sont recalées pour s'enchainer sans temps mort ; la track est recalculée.
