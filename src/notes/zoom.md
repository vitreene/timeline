## Zoom

### Ou placer l'appel à zoom ?

- zoom est déclenché par window.resize pour l'ensemble des persos ;
- un zoom par story est possible, via les containers queries ou les écoutes sur les conteneurs.

La modification du zoom entraine le recalcul des persos concernés.
Où ce calcul doit se faire ?
a. dans un channel, ou identique : les elements à modifier sont envoyés dans la queue de rendu.
b. après le rendu dans la queue, pour fixer les valeurs.

La solution b. permet de redessiner les éléments en ayant la garantie d'avoir les derniers états des persos.
Le plus simple est de stocker ces états, avant traitement, dans les persos.
le zoom, si calculé par story, demande une valeur par perso.
Le zoom général serait disponible pour le calcul du zoom story.
Une seule valeur de zoom à stocker dans les persos.

Le traitement de finition, comme les transforms a lieu ici, pas dans queue ?

les infos dont j'ai besoin se trouvent dans renderDOM ; il manque ici raf

renderDOM est accessble dans le contructeur de queue , il serait possible de créer un event qui livrerait directement les updates ?
-> il me faut la liste des id des persos concernés.
