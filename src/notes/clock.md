tracks, Clock et channels sont etroitement imbriqués.
Comment eviter une cascade de dysfonctionnements avec l'introduction des tracks ?

- control : action qui définit un groupe de tracks actifs, et un status
- track : chacun recoit events et datas. un track de référence est défini pour chaque control.

activer un control =

- status
- events
- data
- next
- control name
- tracks names ?
- track reférent

A résoudre :

- currentime -> 1 status par control
- Clock.tick :
  - actif en permanence ou
  - contraint par le control ?
- transitions : comment s'interrompt-elles quand on change de control ?

y-a t'il des transitions qui doivent se terminer de toutes facons ?
-> cela crée une divergeance dans la timeline, pas génable pour le moment.
-> cependant, chaque timeline n'est pas enregistrée ; un changmement d'état vers et depuis une timeline non enregistrable ne sera pas gardée en cas de relecture.
-> un élément est interrompu dans sa transition et change d'état dans le nouveau control. Il doit pouvoir reprendre sa position au retour pour poursuivre.
