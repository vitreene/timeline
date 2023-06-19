Queue dans l'ancienne version du projet devient Mixer

- recoit les propriétés de style
- accumule, mélange les valeurs de props identiques
- chaque valeur est associé à un poids (0-1)
- non : Le poids est défini par défaut comme la valeur de progress de la tween
- le résultat est la moyenne des valeurs pondérées
- une valeur peut venir d'un tween ou d'un set ; quelles priorités ?
- un set sur un tween va créer un effet de rupture (voulu si l'on veut une assignation sans transition.) Sinon cela doit passer par une tween.
  Une assignation spéciale pourrait forcer la désactivationdes autres valeur en forcant leur progress à aller vers 0, tandis que le set passerait à 1

Le mixer réalise lui meme un tween sur des propriétés identiques
la dernière assignation l'emporte ( p ex, un set plus récent qu'un tween en cours va « éteindre » ce tween)
-> ce qui implique des parametres pour préciser le comportement d'un assignation entrante.
le fondu-enchainé est préconisé, mais parfois, une assignation directe est necessaire (sans transition)

Comme pour le tween, la valeur entrante est comparée à l'existante. est-il nécessaire dans ce cas d'aller chercher l'existant dans le tween, puisqu'il est dispo dans le mixer ?  
-> la valeur du tween serait relative

en sortie, une valeur unique

Chaque valeur doit être identifiée :

- à son origine ?,
- à sa destination.

ou bien la valeur est toujours calculée lors d'un cycle :

- les valeurs se cumulent dans un buffer,
  le buffer est réduit à une valeur
  pas de mémorisation des composantes, c'est les tweens qui gèrent ?

les valeurs envoyées sont les calculs en absolus, pas en relatifs (le delta seulement) ; quels avantages / inconvenients ?

La valeurs entrantes doivent modifier l'existant

ex :

- x est à 200 ; un tween (from: x, to: 0) : les valeurs du tween remplace la valeur initiale
- x est à 200 ; un tween relatif (to: +50) x va de 200 à 250
  Le tween relatif est à retenir pour eviter le pré-calcul du from
- opacity est à 0.5, (to: 0.8) est plus facile à définir que du relatif.

LoopEvent : applique les actions selon les events selectionnés par l'entrée time

- events : map <time,events>
- add : collecte tous les events
- update, seek = reçoit time et envoie les events associés aux actions

Actionner : reçoit des events et lance les actions asociées à chaque event

- actions : map <eventName, actions >
- update : selectionne l'action, puis l'attribue
  - lancement des tweens, des straps
  - ou transmission directe
  - les actions "style" passent par le mixer

Mixer : traite les entrées concurrentes de l'objet style, qu'elles viennent d'un set ou d'une tween. quand deux valeurs divergent, propose une valeur mediane basée sur le poids respectif de chaque valeur
un "set" aura la priorité et n'utilisera pas de mix. Un set peut etre transformé en amont en un tween pour une transition douce.
Le mixer doit recevoir en plus de la valeur :

- l'id de la destination,
- l'id de l'operation émétrice,
- eventuellement a progression
- les valeurs complémentaires ( mode couleur, unités...)

Queue : recueille les resultats, ne garde que le plus récent, et envoie au render à chaque raf -> déclenche les rendus
devrait gérer les overflows, si la queue met trop de temps à se vider, le restant est reporté à la frame suivante

le cycle des données :

- Chrono -> time
- Time Events -> action à déclencher
- Action :
  - init actions secondaires
    - tween
    - straps
    - cumul / mixe les valeurs -> stock
  - set direct -> stock
  - renderer chaque tick
- Render : prend les valeurs actualisées durant un cycle et les rend à l'écran
  - dans raf
  - clear stock

La Queue ne garde que :

- stack
- flush
- render

5 types d'update :

- classname : passer un objet avec le nom et l'action attendue : add/remove/toggle et la liste de classes.
- attr : setAttribute , valeur null/undefined pour supprimer l'attribut
- content :
  - string/number -> textContent
  - texte enrichi, HTML
  - image, video
  - component
  - third-party
- event : penser à la délegation d'event, qui permettrait de cloner un élément en cas reset / initial sans perdre ses events
- style : le plus utilisé
  - sous rubriques :
    - transform
    - couleurs
  - alimenté en direct - set - ou par flux - tween -
