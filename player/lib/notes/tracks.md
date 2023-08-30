## Tracks

Tracks organise des groupes d'événements qui peuvent etre activés ou désactivés simultanément.
les groupes possedent une timeline qu'ils peuvent partager entre eux.

lorsqu'on bascule vers une configuration, la timeline est maintenue ou réinitialisée

La première mise en place doit tester la configuration suivante :

- un groupe Play composé de deux tracks : common et fr;
- un groupe Pause avec un seul track : pause.

play et pause seront accessibles directement.
Un développement consitera à utiliser une interface pour créer les réglages de permutation.

lors d'une permutation, les groupes d'évents sont fusionnés et adressés à Timeline

Track ajoute son propre channel pour traiter les events entrants

Dans une certaine mesure, Tracks pourrait etre utilisé à la façon d'une story, pour

### Questions à résoudre

#### Events de transition

à la bascule play/pause se produit des evenements de transition.
Comment faire pour que ces événements se déroulent dans le cadre de la timeline, sans avoir a créer une interface dédiée ?
une permutation produit des events qui ne seront pas consignés dans la timeline

#### Tracks et straps

il faut basculer non seulement les events mais aussi :

- times
- data
- nextEvent
  cela à pour conséquence de suspendre l'exécution des straps
  (chaud à tester, une bascule puis un seek )

Quel nom pour un groupe de tracks ?

#### les tracks communs

dans l'idée des tracks groupés, il y a la possibilité de garder un track commun et deux tracks de langue avec uniquement leurs events propres
si certains events sont liés aux straps, il seraient aussi inactivés. cela veut dire que nextEvent doit connaitre à quel track il appartient, ce que j'aurai préféré eviter...

Tracks va intercepter Status venant de clock et utiliser son propre Status
Timer(TimerStatus) -> Tracks(TimerStatus -> TrackStatus) -> actions(TrackStatus)
play() et pause() sont transférés vers Tracks
seek aussi

Clock ne gere que startTime, et timers

Chaque Track génère currentTime, pauseTime, nextTime, oldTime

Les subscriptions restent sur Timer ! des actions peuvent etre déclenchées à partir de plusieurs tracks.
Seuls les eventimes sont orientés vers un track.

Tracks manage :

- ajoute un track
- active/désactive une piste
- play | pause | stop (Track.name, {start: number, active:(filterTracks)})
  ou des parametres :
  - start: 'pause' | 'restart'
  - active: 'none' | 'all' | [ list ]

Timer est employé par les channels :

- tick pour les animations
- tous pour les straps
  Avec les tracks, il y a mélange de lignes temporelles, avec le risque de tout mélanger...

  Il faudrait que chaque strap connaisse son contexte d'exécution pour choisir le bon Status.
  Si un strap doit envoyer un event à un autre track, cela devra passer par une api pour garantir le bon enregistrement et les effets de bord.

  un event ne peut pas etre envoyé à un track inactif ? mais rien ne l'empeche non plus

**Tracks contient le state de Timeline !**

L'itération d'un strap 'next' reste dans le contexte ou il a été émis. -> il appartient au track, mais ce track peut etre partagé

- Comment passer les données de Track à Timeline ?
  Au moment d'une permutation, il faut récupérer l'état actuel, puis transférer le nouvel état.

- addEvent : dans timeline ou Track ?
  dans Track pour distribuer les events selon les tracks.

Track, dans sa conception serait optionel, mais il emprunte à Clock et Timeline , il gagnerait à etre entièrement intégré.
Notamment, il en récupère les interfaces (play, pause, addEvent...)

chaque track possede des evenements : onEnter, onExit, on peut y passer un tableau d'events

Methodes

- addEventToTrack( track, event)
- defineTrack(name, options)
  - options{
    onActive,
    onInactive
    }
- defineGroupTrack(options)
  - options{
    name
    group: track[]
    refstatus
    statusOnActive : reset | current
    }
- swapStateTrack(groupTrack)

datas

- status :{[ groupName ] : Status}
- activeGroupTrack

interface

- play()
- pause()

06-05
Tracks est l'équivalent pour les events de Channel pour les actions.
On peut créer un Track en étendant une classe de base.
La base doit s'occuper de récupérer / accéder , aux events , status, ajouter un event
Il faut aussi un process pour communiquer entre les tracks, par exemple pour envoyer des events de l'un à l'autre

Une autre classe s'occupe de gérer l'ensemble des tracks : activation /désactivation, initialisation...

Faut-il un equivalent pour Channels ?
Timeline est-il seul gestionnaire des channels, ou bien de l'ensemble tracks/channel ?

Timeline pourrait se renommer... StoryLine, ou mieux : SceneLine

02/06
Ajouter des exemples d'utilisation des tracks ; la liste de fonctionnalités à retenir doit correspondre à des cas qu'on s'attend à rencontrer.

le fonctionnement standard :

- un déroulé type e-learning avec une télécommande play/pause. la mise en pause interrompt les evenements en cours lance des animations d'attente.
- un canal de langue synchronise des images avec de la voix selon un temps distinct.
  Le meme evenement est lancé selon un temps distinct.

**Exemples** :

- une phrase est prononcée, les noms sont illustrés et s'illuminent lorsque le mot est prononcé.
  Au changement de langue, les mots sont changés, et le timing evolue car les mots ne sont pas pronocés dans le meme ordre ( inversion sujet/verbe, ou nom/adjectif par exemple)

- un drag-drop d'elements est enregitré. seuls les originines et les destinations le sont, avec une transition entre les deux. tous les drag-drop s'enchainent les uns après les autres. Le temps réel n'est pas respecté.
- une variante, un tracé est dessiné, puis enregistré lorsque l'on clique sur un bouton "save". le trajet est enregistré, l'echelle de temps ne l'est pas.

dans cet exemple, les tracés sont mémorisés au fur et à mesure, puis : optimisés, enchainés, et enfin associé à un event dans la timeline principale.
Ici, un track est lié à une fonctionnalité complete et autonome

Tracks ressemble à une state machine ?

- controles
  - par défaut : play, pause, stop
- definir les transitions entre deux états

dans tracks :

- par controle :

  - Clock.status,
  - times,
  - nextEvent,
  - tracks active/inactive
  - transition enter/exit
  - hypothese d'un state

- par track :
  - events,
  - datas
  - transition enter/exit

y'a t'il un cas ou il faut distinguer un groupe d'un controle ?

chaque controle doit permettre l'accès aux events via une interface

revoir la fonction de la recherche d'event dans timeline.run pour qu'elle renvoie les données dont this.channel a besoin
-> pas besoin de data ou event dans timeline

fixes 11/07
[-] seek
seek presume de mettre le lecteur sur "pause" avant.

- il n'y a plus de concept de pause à proprement parler, il faut designer un nouvel état – controle –
- seek pilote un track, mais en laisse un autre se jouer. c'est complexe ! cela necessite de revoir en profondeur le système : plus de track.current au profit de pointeurs.
  comment jouer deux pistes simultanément avec deux status ?
  Est-ce vraiment utile ? on peut imaginer un freeze pendant le seek.
  un move commencé dans play se poursuit lorsque passé en pause. Ou sera enregistré le move ?

[-] transitition comme un strap
[-] status consignés dans clock

## revoir le status de Track

associer un status à un groupe est une source de complications qui ne permet pas de traiter certains besoins :

- une animation dans une story peut etre déroulée indépendament de la timiline générale,
- une video dans une scene
  si j'associe un status à un track, il est possible de lire ces tracks simultanément dans un groupe, comme c'est le cas en ce moment

L'interface de Clock ne garde que :

- start,
- stop,
- pause

Chaque track aura l'interface telco :

- play,
- pause,
- stop,
- seek

TrackManager permet de piloter des groupes de tracks, de déterminer les modes de pause et de reprise
exemple: une story passe en mode seek, puis la scène se poursuit : cette stroy reste-t-elle figée, reprend-t-elle là ou elle se trouve, reprend-elle de zéro ?

comment fonctionne Clock et tracks ensemble, comment passent les données et les réactions ?
dans Clock, on boucle sur tous les status disponibles dans loop ;

en associant un status à chaque Track, se pose la question du début et fin de la piste.

- le début est identifiable, il faut définir un état "non commencé" au track. que faire lors du seek ?
- la fin est déclarée de façon arbitraire, car il n'y a pas nécessairement de moyen fiable de l'établir automatiquement. La valeur doit etre déclarée, elle peut etre calculée en amont de l'exécution en lisant les actions par exemple.
  La valeur peut etre ouverte, mais il n'y aura pas de sens à lire une telle timeline.
  representer un slider comme un curseur sur une timeline ouverte à la façon d'un éditeur de sons par exemple.
  Une durée ouverte est liée à des composants intéractifs, ou l'intervention de l'utilisateur détermine la durée.

les tracks sont mis en pause ou play, un par un
