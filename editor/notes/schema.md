1. Projet
   réglages généraux.
   Un projet n'a pas de notion de chapitre pour le moment.

Scenes
une scene contient

- des médias son,video qui s'enchainent ;
- des capsules

Dans l'editeur, les sons et les events sont liés.
Dans la publication, les events sont liés à la scene.
Il doit etre possible de créer des events indépendamment des sons.

la bdd décrit l'éditeur, la publication compilera les données

2. Scene

- id
- capsules : liste d'éléments présentés
- sceneMedias : liste des supports sonores

3. SceneMedia

- refScene
- refMedia
- ordre
- events : json
  une liste d'évents {label: temps} associé à un media créées par whisper
  Plusieurs sons possibles par scene.
  Les sons s'enchainent les uns après les autres.

4. Media

- id
- type : img, txt, son, video , capsule
- source : path / url
- refCapsule ?
- content ? (texte) le texte pourrait avoir une source une key dans un json

5. Capsule

- id
- type : nom d'une définition de capsule
- position ?
- dimensions ?
- elements : capsuleElement[]

6. capsuleElement

- id
- refCapsule : id capsule
- refMedia : media ou capsule
- ordre
- events

7. Event
   id : string
   nom : string
   action : string
   x - startAt : time
   duration? number milliseconds

## API

### Scene

- new scene
- get scene
- add capsule -> create capsule
- remove capsule -> delete capsule
- add medias
- order medias
- remove medias

Une seule scene est ouverte à la fois, le contexte est toujours la meme scene

### Capsule

- get capsules from scene
- get capsule
- create capsule
- delete capsule
- edit type
- add Element to
- remove Element to

### Element (capsuleElement)

- get elements from capsule
- get elements from capsules of scene ?
- get element
- create element
- add event
- remove event
- edit order

Considérer que media et capsule sont fixés à la création de l'element.

### Event

- get events from Element
- get event
- create event
- delete event
- edit action

La propriété startAt devrait etre calculé au rendu, pas enregistrée

### Media

- get medias from scene
- get media
- get medias from capsule ?
- create media
- delete media
- link to / detach from Scene
- link to / detach from Element

La possibilité qu'un meme media soit relié à plusieurs capsules peut-il entrainer une complexité de gestion ?
