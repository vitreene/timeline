but : fixer le fonctionnement du composant sceneline.

Proposer des evolutions pour tenir compte de parametres jusque-là ignorés:

- la vitesse d'exécution
- l'influence d'un parametre (0-100%)

#### Les modules de traitement

regrouper tous les modules qui calculent une animatique à partir d'un évent :

- transition
- animation
- pose
- strap
- anim3d
  etc.
  chaque action aurait une prop target: {type, uuid}
  type designerait vers quel render l'orienter (html, 3d...)
  Ces modules seront stateless ; l'état reçu est modifié puis renvoyé en sortie de module.

ils auront accès :

- au store d'élements sur lesquels ils agissent ;
- une fonction next qui sera jouée au prochain tick
- une fonction enQueue pour ajouter des données destinées aux éléments
- une fonction addEvent pour créer un event
  -> voir le fonctionnement actuel des straps.

ils auront chacun une méthode init et update.

Ces modules ne sont donc pas censés créer d'instances à chaque sollicitation.

#### Suppression des channels ?

A la place, encapsuler dans l'action les différents types d'anim, qui seront appelés au besoin
En conséquense, séparer les persos de leurs actions.
Un event ne connait pas la destination des datas qui sont envoyés avec. Les channels permettent de mieux cibler les traitements de ces données.
Il y a la question continuelle si un event peut etre réservé à un élément. Il n'y a jamais de cas ou cela arrive, meme si c'est l'intention : il suffit par exemple d'avoir besoin d'un autre élément dont le but est d'afficher ces memes données.
On peut inverser : chaque élément possède un écouteur à son nom ; un autre élément connaissant ce nom peut aussi lire les données.
l'objet data devrait, sans channel, utiiser une propriété strap, par exemple, pour envoyer le contenu à un strap.

Cela simplifie le traitement des events et déplace le filtrage des données à un endroitoù s'en trouve déja d'autres. Strap rejoint transition et animations.

### Simplifier Clock

- transférer les états Play, Pause, Seek aux tracks
- seulement tick à chaque RAF

Queue devient un Mixer facon Threejs

- mixe les différentes valeurs d'une meme propriété se cumulant à chaque tick

Les manipulations du DOM

- reslot
- reorder
- ajout
- retrait
  se font dans le store ou dans le composant

En entrée :

- des listes d'events, distribués en pistes
- des actions : références à des transformations, transitions, animations
- des éléments : html, svg, mais potentiellement tout autre chose : 3d, canvas...

Atteindre le niveau d'abstraction suffisant pour etre indépendant d'une destination, sans charcher à les implanter toutes.
Cibler en priorité HTML/SVG
optionellement la 3D

Sceneline distribue des données qu'elle ne traite pas directement.
Un système modulaire permet de traiter des données dérivées (transitions...) initiées par un evenement.

### Events

#### A résoudre :

#### Comment gérer le reset d'un perso ?

Quand un perso doit-il etre réinitialisé :

- à la lecture, avant d'etre connecté au DOM
- lors d'un SEEK.

dans un multitrack, le changement de track doit éventuellement déclencher un SEEK des éléments qui sont concernés.
Dans certains cas, il n'est pas utile de faire un reset.
Peut-etre manque-t-il une information pour dire ce qu'il faut faire.

Exemple d'un multitrack bilingue.

- une piste fr
- une piste en
- piste common
- pistes inputs

en cas de changement de langue, il faudrait:

- desactiver la langue précédente,
- activer la langue choisie
- effectuer un seek sur common, inputs et la langue courante
  de cette façon, tous les événements sont relus et mis à jour.

#### sons et vidéos

le son est géré par un Channel. si je supprime les channels, ou se trouve ce module ? comment est-il appelé ?
suivre une piste comme pour threejs ?

## Actions

**Transition** : modifie dans un temps donné l'état courant d'un élément.
A besoin d'accéder à l'état du perso.
parametres :

- from
- to
- repeat
- yoyo
- duration
- easing

**Animation** : suite de transitions enchainées

transition, style, classname, attr modifient l'état courant du perso

**Pose** crée une variation par rapport à l'état courant, avec moindre priorité.
Il peut contenir des transitions, des animations.
Passer d'une pose à une autre ne modifie que les parametres des poses
Il existe une pose "initial" ?

**Straps** devient un module personnalisé d'animation via une logique propre.

D'autres types d'animations sont possibles, pour faire un pont vers d'autres systèmes d'animations (Gsap, Threejs...).
