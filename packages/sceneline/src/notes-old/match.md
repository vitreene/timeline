exemple :
id = path.to.element:event

horloge.London.aiguille.heure:stop
horloge.Paris.aiguille.minute:start
toto.Paris.aiguille.minute:start

- regex London[\.\w]+\:(\w+)
  -> horloge.London.aiguille.heure:stop

- horloge[\.\w]+\:(\w+)
  -> horloge.London.aiguille.heure:stop
  -> horloge.Paris.aiguille.minute:start

- horloge[\.\w]+\.minute:(\w+)
  -> horloge.Paris.aiguille.minute:start

- horloge\.Paris\.\w+\.minute:(\w+)
  -> horloge.Paris.aiguille.minute:start

Le motif de recherche utilise les wildcard \* et \*\*

Ils sont remplacés au build ou au runtime par :

- \* -> \w+
- \*\* -> \[\w+\.\]
