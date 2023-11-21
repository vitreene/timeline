## debug seek

que se passe-til lorsque que se produit en evenement seek ?
Par rapport à la position de lecture actuelle, seek a lieu en amont ou en aval.

- si amont :

  - les événements inscrits dans la timeline sont relus jusqu`à la nouelle position.
  - les evenements strap sont ignorés.

- si aval :
- tous les événements strap en cours sont itérés jusqu'à la nouvelle position.
- ensuite, les événements inscrits dans la timeline sont relus jusqu`à la nouelle position.

tenir compte :

- des strap en cours lorsque seek est déclenché
- des strap débutant dans le strap en aval

fonctionnement des straps :
l'état est calculé frame par frame, via une fonction next() qui renvoie le state de la fonction.
le strap peut aussi emettre des actions si les conditions sont remplies.
Si le strap se termine, il pourrait envoyer un next : done, et un event de fin.
Les straps sont synchrones.
Une fonction delay pourrait reporter une action à plus tard, simplement en calculant la propriété startAt de l'event.
un strap ne dit pas envoyer d'event dans le passé.

si un strap est déclenché par le rollback ?

- les straps sont inactivés pour les seek en amont.
- il faut les rechercher sur la partie present-> aval et les traiter

donc :

1. si en aval : une passe **forward** pour résoudre les straps et collecter les actions,
2. une passe **backward** pour le rollback de la timeline.
3. placer l'affichage sur seektime.

comment déterminer l'ordre de passage, et filtrer ce qui doit etre traité ?

- c'est simple avec 2 channels, ca peut devenir plus complexe ensuite.
- c'est aux channels de décider ce qui est traité ou non.
  pas d'optimisation au niveau de timeline, il y aura 2 passes avec un signal indiquant à quelle étape on se trouve.
  dans Clock, les états **seek** et **seeking** ne sont pas adaptés pour créer l'état voulu.
  Il pourraient etre utiles par la suite.
  Faut-il proposer une passe dédiée, invalidée par les channels si nécéssaire ?
  Dans la phase PLAY / SEEK / SEEKING, currentime devrait rester constant.
  currentime prend la valeur seektime seulement avant de passer à pause.
