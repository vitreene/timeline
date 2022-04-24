Objectif : librairie Timeline

Se focaliser en priorité sur les fonctions de la Timeline

Prochaines étapes :

[x] channel Straps synchrones

- comment les invoquer
- mise en cache du résultat

[ ] tracks

- clock.status passe à la Timeline
- un status par track
- Pause est une permutation de tracks
- Timer.stop devient Timer.end

Track va s'intercaler entre clock et Timeline,
track

[x] inputs

- evenements enregistrés ou non
- [x] passer des datas supplémentaires

[ ] drag-drop : definir une api des inputs

- les inputs move
  - ne sont pas gardés
  - sont compilés en fin d'opération
- l'action en fin d'opération est conservée (change de channel)

[ ] labels: accepter des labels à la place de valeurs time

- mettre en attente les labels à résoudre

[ ] valeurs relatives
Accepter et résoudre des valeurs relatives au précédent eventTime - formes "+=", "-=", ">=" (voir gsap)

[-] straps tester les cas :

- [x] seek au milieu de l'execution d'un strap
- [x] mettre en cache les résultats pour ne pas surcharger les event deja créés
- ? tester sur le couple nom_instance/time

[x] distinguer l'id du state d'un strap du strap lui-meme : permettre d'avoir plusieurs exécutions simultanément
Plusieurs exécutions simultanées necessitent de nommer les evenements de façon unique pour chaque instance

[ ] convenir des termes pour nommer les evenements que peut produire un strap :

- sur les états: start/init, end/complete, update

[ ] ambiguité de initial :

- ne passe pas par la TL , la TL n'est pas informée des attributs passé au node.
- au premier update, les attributs sont remplacés par les nouveaux, et pas complétés.
- il n'y a pas encore de notion d'entrée et de sortie d'un node (n'est pas la TL)
- comment la TL pourrait etre informée de l'etat d'un élément avec agir dessus la toute première fois ? faux probleme ?
- temporaire : recopier initial comme une action.

[x] un event à 0 est ignoré.

[x] transition ne reprend pas.
Suite des opérations :

- play jusqu'à transition complete;
- seek au milieu de la transition
- play : la transition n'existe plus, elle n'est pas relancée.
  Au lancement de play, il faudrait vérifier que toutes les transitions soient relancées.
  Ou, une transition n'est jamais supprimée mais filtrée ?
  Si la transition n'est pas supprimée, il y a le risque qu'elles s'accumulent si il y a replay. il faut s'assurer qu'il n'y en ai qu'une seule
  -> props sert de reference pour ne pas dupliquer les transitions.

[ ] un mode "idle" sur Clock inactive la loop, mais conserve le status

[ ] consolidation :

- Clock accessible depuis timeline, via les Track, Track fournit Status aux channels
- les channels sont intégrés dès le constructeur de Timeline
- il n'est pas utile d'avoir une Api extérieure : Main et Strap n'ont pas besoin d'etre accessibles à part de Timeline
- Queue à besoin d'un render ; il doit etre possible de définir une queue/render par channel.
- dans un premier temps, Clock reste à part, l'api play/pause sera géré par Tracks ensuite
- channel.addStore doit ajouter le store, pas seulement les actions
