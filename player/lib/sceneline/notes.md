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

### notes todo 26/06

[x] instance Display dans Controller,

- méthodes accessibles
- pouvoir ajouter un perso
- depuis tween :
  - transport des valeurs
    - distinguer unit et valeurs
    - arrays et pattern pour les couleurs
  - definir "from" si absent
- modules Strap sur le modele Tween
  - possibilité de generer un event
- styles :
  - zoom
  - transform via matrix
- attr : setAttribute , valeur null/undefined pour supprimer l'attribut
- persos
  - state style + transform
  - parent
- definir Content
  - anticiper List (add/remove/move) et micro-interactions
  - Static : Html avec slots dynamiques
  - Components
  - third-party : threejs, autres
  -

notes 09/07
propriétés de Perso :

Perso

- id
- tag
- initial
- actions
- emit
- node
- parent
- transform -> etat, prop brutes
- style -> etat, prop brutes. Toutes props hors transform
- matrix -> prop résolue

style et transform contiennent les propriétés courantes, non-résolues :

- chaque valeur est individuelle, exprimée si besoin par son alias
  (ex : x, y pur translateX et translateY)
- chaque propriété est décrite de l'une de ces façons :
  - valeur absolue {value: number, unit: string}
  - tableau de valeurs (couleurs) : {value : number[], mask: regex}
  - unitless : number|string ; si number, est multiplié par zoom
- transform :
  des valeurs distinctes pourraient etre attribuées à un deplacement scénarisé et un lié à un mouvement (souris par exemple). Ces valeurs sont fusionnées au rendu.
  on aurait :
- x, y pour des mouvements absolus
- dx, dy mouvements additifs
- pointerX, pointerY pour la souris/ touch,
- pointerDX, pointerDY en additif.
  -> verifier si j'ai besoin des deux derniers, ou si un seul suffit.
  -> eventuellement, la meme chose pour rotation.
- une valeur matrix contient le résultat des calculs pour l'élément, est utilisé par les enfants pour calculer leur position absolue.
- autoriser quand meme une valeur matrix en entrée dans transform. ce matrix sera une prop directe de Perso.
  Note : si une props transform est passée en entrée, la recomposer en valeurs directes. A faire en pré-traitement (ou dissuader de le faire: ignorer/warn)

A l'update, les valeurs ajoutent ou remplacent les présentes.

A quel endroit sont résolues les valeurs ? idéalement, avant raf.
Cependant, je n'ai pas trouvé de moyen d'arreter l'arrivée de valeurs en entrée pour réaliser les calculs. une proposition :

-> Les valeurs issues d'une action peuvent etre connues à l'avance :

- regrouper les actions par perso
- calculs
- fusion des résultats
- raf

entre deux rendus du timer, d'autres modifications peuvent arriver sur chaque tick :

- input
- tween/straps
  -> il pourrait y avoir un décalage ou le tick place les entrées dans une queue de calcul, traitée dans le cycle suivant

en résumé , les entrées du cycle précédent sont calculés le cycle suivant
