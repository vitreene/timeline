## Cache

Lorsque on utilise seek, il n'est pas souhaitable ou faisable de relancer les straps :

- il n'y a pas de garantie que les straps soient purs ;
- on ne controle pas les effets de bord,
- les straps faisant appel à des tirages aléatoires ne peuvent pas reproduire un résultat
- Des calculs couteux en temps peuvent bloquer l'execution d'un seek.
- il n'y a pas de mécanisme qui indique la fin de l'usage d'un strap
- seek sur le temps d'usage d'un strap peut amener à le désactiver

### Conséquences

- un strap peut rester un système ouvert, ou bien semi ouvert ?
- chacun peut-il écrire un strap ?
- comment se passe le "contrat" d'un strap ?
- comportement pseudo-indeterminé ?

### quelques pistes

- les events générés sont interceptés et mis en cache
- les effets de bord pourraient l'etre aussi
- pseudo-random, donne toujours le meme résultat à partir d'un tirage initial aléatoire
- interval et timeout dérivés du Timer

### cas dans seek

- pause au milieu de l'exécution d'un strap;
- retour en arrière avant le début de son déclenchement
- retour à play

## une piste : fonctions réactives

Utiliser une fonction qui prend en entrée un état courant, fait un traitement et renvoie l'état next() avec un event pour rappeler la meme fonction avec l'état suivant, et quand nécessaire, un event qui produira le résultat attendu.
Cela permet d'inserer la fonction dans un traitement continu.
Cette fonction peut etre une classe instanciée au lancement de la scene. cela permet d'initialiser certains paramatres au besoin.
Les appels qui ne produisent pas de changement d'état ne sont pas gardés.

Est-ce faisable pour move ?
Il faut permettre de passer des valeurs directement en queue sans passer par un event.

- au mousedown -> event
- mousemove -> queue
- mouseup -> event

dans le cas d'un enregistrement d'un mouvement :

- il n'est pas nécessaire de conserver la trajectoire et la durée de l'intéraction (ex: un drag-drop)
- c'est un contexte ou la timeline pourrait-etre suspendue (des animations de suspens peuvent exister, ce ne serait pas une pause du Timer)
- l'event final peut contenir une version simplifiée de la trajectoire, conçue comme une interpolation de trajet

- comment faire :
- un strap est commencé;
- pause en cours d'exécution;
- retour en arrière, mais, après que le strap ait commencé;
- play. Que se passe-t-il ?
  -> on repasse les dernières fonctions du strap appelé, et on les relance avec des parametres actualisés ? lesquels ?
  -> on garde les valeurs déjà rencontrées qui ne sont pas invalidées, jusqu'à la reprise de la fonction en attente.
  -> si une intéraction annule la fonction en-cours ?
- ilest censé dans ce cas y avoir une procédure pour interrompre et relancer le strap.
