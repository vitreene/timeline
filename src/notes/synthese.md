but : fixer le fonctionnement du composant sceneline.

En entrée :

- des listes d'events, distribués en pistes
- des actions : références à des transformations, transitions, animations
- des éléments : html, svg, mais potentiellement tout autre chose : 3d, canvas...

Atteindre le niveau d'abstraction suffisant pour etre indépendant d'une destination, sans charcher à les implanter toutes.
Cibler en priorité HTML/SVG
optionellement la 3D

Sceneline distribue des données qu'elle ne traite pas directement.
Un système modulaire permet de traiter des données dérivées (transitions...) initiées par un evenement.

Events
