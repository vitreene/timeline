# Composer : un éditeur de scenes user-friendly

une scène peut proposer un ou plusieurs composants Liste.
chaque liste est une suite de composants dont les plus simples sont les images et les elements teste

Un éditeur permettant de composer des diaporamas avec différents niveaux de complexité.

Au lieu d'utiliser une timeline classique, l'audio est transcrit et ce sont les mots du texte qui balisent l'entrée ou la sortie d'un élement de la scene.

Un composant "Liste" avec diverses variantes génere une suite d'événements exploités par le Player.

Dans sa forme la plus simple, la liste n'accepte qu'un type d'élément – image ou texte –, un type de déroulé – carousel, enumération, grille... – et correspond à un layer sur la scène.
Chaque layer s'empile les uns sur les autres.

Ce concept de composant est différent des stories qui sont censées etre des animations autonomes. ici, toutes les listes d'une scene sont liées à un audio.
Des audios pourraient etre chainés, mais pour sa simplicité, un gardera qu'un seul audio par scene.

Chaque element d'une liste est associé à un événement d'entrée, un ou plusieurs de maintien et un de sortie.

Dans son expression la plus simple, le carousel, chaque événemement d'entrée correspond à la sortie du précédent.
A chaque evenement est associé une action. Dans sa version la plus simple, le choix de la transition est uniforme pour toute la liste.

A un niveau plus détaillé, chaque element peut recevoir sa propre transition, ainsi que son evenement de sortie

Les listes sont des générateurs associé à une interface.

une liste peut recevoir des composants plus complexes, comme des cartes (associant une image et des textes) ou encore des layers pour des compositions complexes.

A chaque layer correspond une div parente.

TODOs :

- completer les transactions database ;
- créer le layout de base
- créer le layout et logique d'une capsule
- intéraction mots-images
- import de medias

-> 25/03
réactions à l'envoi du form "transition"

- enregistrement bdd
  - créer event
- mise à jour de l'ui

  - coloration du TextTime == count name dans events
  - voir l'event dans la capsule
  - pouvoir effacer l'event

  dans le modele d'event, il n'y a rien qui me permette directement de filtrer les events d'une scene !
  si un meme son est employé dans pllusieurs scenes, alors le compte sera faussé.
  scene-> capsules-> elements -> events
