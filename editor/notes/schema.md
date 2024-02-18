1. Projet
   réglages généraux.
   Un projet n'a pas de notion de chapitre pour le moment.

2. Scenes
   une scene contient

- des médias son,video qui s'enchainent ;
- des capsules

Dans l'editeur, les sons et les events sont liés.
Dans la publication, les events sont liés à la scene.
Il doit etre possible de créer des events indépendamment des sons.

la bdd décrit l'éditeur, la publication compilera les données

Scene

- id
- sceneMedias
- capsules

3. SceneMedia

- id
- refScene
- refMedia
- ordre
- events : json
  une liste d'évents {label: temps} associé à un media créées par whisper

Media

- id
- type : img, txt, son, video , capsule
- source : path / url
- refCapsule ?
- content ? (texte) le texte pourrait avoir une source une key dans un json

4. Capsule

- id
- type : nom d'une définition de capsule
- position ?
- dimensions ?
- elements : capsuleElement[]

capsuleElement

- id
- refCapsule : id capsule
- refMedia : media ou capsule
- ordre
- events

6. Event
   id : string
   nom : string
   action : string
   startAt : time
