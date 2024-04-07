fixer les conventions pour les events.

Structure proposée :

Event {
name: string | string[]
startAt: number,
data?:any
events?: Event[]
}

un event

- possede un seul point de départ
- peut etre associé à plusieurs noms,
- emporte eventuellement des données,
- comporte eventuellement des events liés. Ceux-ci sont executé avec comme point de départ le StartAt du parent.

du coté des elements :
une action peut etre déclenchée suite à un event. Il faut créer une correspondance entre le name de l'event et la clé de l'action
2 façons sont envisagées :

- simple : action.name et event.name correspondent.
- moins simple : une table de correspondance est placée entre l'element et l'event
  listen : { eventName : string, actionName: string }[]

Dans les deux cas, au moment de jouer la séquence, il faut générer une combinaison unique entre l'action et l'event, par exemple en transformant les noms d'action en associant l'id de l'élément et l'event.
