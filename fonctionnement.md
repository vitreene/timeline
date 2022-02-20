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

### les events d'une story

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

```js
class Timeline
add(inputs, eventimes)
```
