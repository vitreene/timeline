Objectif : librairie Timeline

Se focaliser en priorité sur les fonctions de la Timeline

Prochaines étapes :

[ ] channel Straps synchrones
  - comment les invoquer
  - mise en cache du résultat
  
[ ] tracks
  - clock.status passe à la Timeline
  - un status par track
  - Pause est une permutation de tracks
  - Timer.stop devient Timer.end

[ ] inputs
  - evenements enregistrés ou non
  - passer des datas supplémentaires

[ ] drag-drop : definir une api des inputs 
  - les inputs move 
    - ne sont pas gardés
    - sont compilés en fin d'opération
  - l'action en fin d'opération est conservée (change de channel)

[ ] labels: accepter des labels à la place de valeurs time
  - mettre en attente les labels à résoudre

[ ] valeurs relatives
    Accepter et résoudre des valeurs relatives au précédent eventTime
    - formes "+=", "-=", ">=" (voir gsap)
    