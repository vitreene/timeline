## enjeux

## etapes

move - remove boolean

- true : transition auto entre les deux positions
- false : retire l'élément de son parent (sur le onComplete de la transition)

supprimer/modifier la ref au parent et la ref du content

- parent ≠ target = enchainer remove content puis add content
- si pas de parent = 1re insertion
- si move dans le meme parent -> pas de double sequence remove/add
- si pas de target remove
