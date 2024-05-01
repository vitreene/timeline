Après la preuve de conceopt, il faut orienter le dev sur plusieurs axes.

en l'état au jour de cette note :

- les mots d'un texte sont extraits par Whisper et présentés avec leur indicateurs de temps.
- lorsque le son est lu, lles events attachés affichent le mot promoncé.
- simultanément, des mots choisis sont associés à l'appartion et la disparition d'image
- un fichier de jeu est créé à la volée
- qui est joué par le player !

---

## Axes de developpements

sur l'appli :

### Chutier

- créer le chutier qui permet de :
  - ajouter et supprimer des médias (images, son, video)
  - classer, trier, et filtrer ces médias dans la liste

### Scene

la scene doit recevoir des capsules pour les placer :

- selection de capsule
- déplacement, resize de la capsule, par souris ou valuers numériques
- pas de rotation dans un premier temps

Les capsules pourraient etre sélectionnées directement, ainsi que via une liste. Cela permettrait de n'afficher que la capsule sélectionnée dans sa zone (et non pas toute la liste)

### Controle

- play, pause, seek
- autoplay : quant un élement est modifié, le player rejoue automatiquement la séquence
- sound on/off
- play segment dans un second temps
  cela oblige a passer les sons dans le player, tout en permattent à ces sons d'emettre des events

### Medias

- connecter avec Whisper pour ajouter les textes issus de la voix
- interface pour enchainer les sons a la suite, valeur de décalage des events
- glisser-déposer les mots sur les items des capsules
  dans un second temps :
  - pistes pour changer de langue,
  - translation des repères d'une langue à l'autre
  - en cas de substitution de fichier sons ( modification, correction) permettre de relier les anciens réglages avec le nouveau (idéalement, avec l'aide de l'IA)

### Capsules

- revoir l'interface, mieux occuper l'espace
- créer, supprimer, déplacer des capsules

- parametrages des capsules selon un typage
  - events par défaut ( seulement entrée, entrée-sortie, idle, etc.)
  - durée par défaut (mais en principe inutile)
  - classnames par defaut associés aux elements (conteneur et items)
  - type d'items acceptés : un seul type par capsule (image, texte)
    - dans un second temps : placer des composants en plus des médias
  - la capsule elle-meme apparait / disparait sur la timeline
  - style du conteneur (css fond, bordure )

comment ajouter les events "addTextTrack" à un son, ajouté aux persos d'une séquence ?

- comme il s'agit d'un ajout pour des fonctions en dehors du controller, il faudrait acceder à l'element avant de démarrer la séquence, attacher les event puis play.
  inconvenient : le controller ignore les modifications ajoutées à l'élément. Certaines opérations pourraient echouer ultérieurement si les ajouts ne sont pas refaits

Il serait mieux d'envoyer une fonction jouée dans une phase d'init que maitrise le controller

state général
Plus le projet va aborder d'interactions, plus les state locaux vont devenir difficiles à atteindre.
un state de l'app pourrait etre utile , ainsi qu'éventuellement une state machine.
Chercher une solution pour sveltekit
