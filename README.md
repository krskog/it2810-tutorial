## Hvordan lage et RESTful API med Node.js, Express.js, MongoDB og Mongoose

**IT2810 Webutvikling**

*Mitchell, Paul Philip*
*Skog, Kristian*
*Westli, Kenneth*

[TOC]

---

### Introduksjon (hva vi skal lage og hvorfor)

I denne tutorialen skal vi se nærmere på hvordan man lager et RESTful API med Node.js, Express, MongoDB og Mongoose. API'et vil innehold øl- (Beer) typer som elementer. API'et skal kunne håndtere CRUD for elementer, bruke HTTPS verb som GET, POST, PUT og DELETE og returnere data som JSON.

Men hva er egentlig verktøyene og utrykkene vi nevner her?

RESTful står for "Representational State Transfer" og er en arkitektonisk stil for å utvikle nettverksapplikasjoner, der idèen er å benytte seg av HTTP protokollen for å gjøre spørringer mellom maskiner. Et RESTful API er da et API (Application Program Interface) som tillater HTTP spørringer slik som POST, GET, PUT og DELETE for å gjøre CRUD (Create, Read, Update og Delete) operasjoner på data.

Node.js er en JavaScript plattform som i bunn og grunn gir deg mulighet til å kjøre JavaScript utenfor nettleseren. Express er et lettvektig serverrammeverk som kjører på toppen av Node.js. Express utvider mye av server-funksjonaliteten som allerede finnes i Node, og åpner for at utviklere raskt og enkelt kan bygge webapplikasjoner og definere API endepunkter.

Valget å bruke MongoDB som database er basert på at MongoDB er såkalt "NoSQL", som er veldig godt egnet til å håndtere store mengder distribuert data. Mongoose er et Node.js bibliotek som tilbyr ODM (Object Data Mapping) for MongoDB, som vil si at det oversetter data i databasen vår til JavaScript objekter som er klare til bruk i vår applikasjon.

---

### Installasjon
Så nå har vi fortalt hva ting er. Men hvordan bruker man det egentlig?
#### Node.js
Node.js lastes ned ved følgende link:
https://nodejs.org/en/
##### Windows / MAC
Node.js og npm kan installeres enkelt ved å laste ned som en forhåndsbygget installasjonspakke ved linken over.
##### Ubuntu
Node.js og npm (node packet manager) kan lastes ned ved:
```
sudo apt-get install nodejs
sudo apt-get install npm

Lag symbolsk link node for nodejs ved:
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

#### MongoDB

##### Installere MongoDB
MongoDB lastes ned ved følgende link:
[https://www.mongodb.com/download-center?jmp=nav#community](https://www.mongodb.com/download-center?jmp=nav#community)
###### Windows

Installere MongoDB ved å åpne .msi-filen i den utpakkede nedlastingsfilen og følge instruksene. Legg gjerne til MongoDB i PATH-systemvariabelen, for å kunne kjøre MongoDB uten å navigere til mappen hvor det er installert til. Her er det bin-mappen som legges til i PATH-variabelen, f.eks
==C:/Program Files/mongodb/bin==

MongoDB krever en mappe for å lagre dataen. Standardlokasjon for dette for windows er `C:/data/db`.
Man kan også spesifisere en egen lokasjon for dette, men det må da oppgis når MongoDB kjøres.


###### MAC

MongoDB kan installeres enkelt på MAC ved Homebrew, ved: 
```
$ brew install mongodb
```

Standarkatalogen for dataen til MongoDB kan opprettes i MAC ved kommandoen:
```
$ mkdir -p /data/db
```

##### Kjøre MongoDB

Hvis MongoDB-binæren er lagt til i PATH-systemvariabelen kan MongoDB startes ved å kjøre ==mongod== i kommandolinjen. Hvis ikke må filstien til mongodb oppgis:
==C:/Program Files/MongoDB/bin/mongod.exe==

Hvis data-katalogen ikke er ved standardplasseringen må denne oppgis når det kjøres ved:
==mongod --dbpath "C:/sti/til/datab/db"==

MongoDB vil nå kjøre på standardport 27017. Terminal-vinduet som kjører MongoDB må være åpent så lenge MongoDB skal kjøre.

##### Opprette Database
For å opprette en database i MongoDB benytter vi mongo-shell og 
use <databasenavn>.
Vi ønsker å kalle databasen vår 'beer-app' og gjør da følgende:
Hvis ikke mongodb-binæren er i PATH:
```
> C:/Program Files/MongoDB/bin/mongo.exe
> use beer-app
```
Ellers:
```
> mongo
> use beer-app
```

---

### Oppbygging og framgangsmåte

Dette er den endelige filstrukturen vi vil sitte igjen med etter å ha fullført hele tutorialen.

```javascript
beer-app/
- models/
    - beer.js     // mongoose beer model
- routes/
    - index.js    // base url for API-et (http://localhost:8080/api)
    - beers.js    // beers endepunktet   (http://localhost:8080/api/beers)
- node_modules/   // laget av npm og holder alle avhengigheter
- package.json    // definerer vår app og dens avhengigheter
- server.js       // express app
- 
```

#### 1. Initialisere et Node.js prosjekt
Slik som alle andre Node.js prosjekter, kommer vi til å bruke *npm* til å håndtere avhengighetene for prosjektet vårt. Vi begynner ved å initialisere prosjektet ved hjelp av pakkebehandleren npm.

```shell
$ mkdir beer-app  # lag prosjektmappe
$ cd beer-app     # naviger til prosjektmappen
$ npm init        # bruk default verdiene ved å trykke Enter hver gang
```

Etter å ha fullført veiviseren for `npm init` vil det ligge en fil som heter `package.json` i roten av prosjektet. Denne filen definerer hvilke avhengigheter prosjektet har. 

#### 2. Installere nødvendige avhengigheter
De to viktigste pakkene vi må installere er `express` og `mongoose`. I tillegg, for at vi skal kunne lese innhold fra en klient sin POST request, trenger vi også `body-parser`. La oss nå installere disse pakkene;

```
$ npm install express mongoose body-parser --save
```

I denne tutorialen vil vi i tillegg benytte oss av den kommende nye utgivelsen av ECMAScript, ES6 (ES2015). ECMAScript er det virkelige navnet for JavaScript. ES6 bringer med seg en haug av forbedringer over ES5, slik som default parametere i funksjoner, destrukturering, fat arrow notasjon, klasser og mye mer. Du kan [lese mer om ES6 her](http://es6-features.org/).

Siden ES6 enda ikke er offisielt støttet, må vi bruke [Babel](https://babeljs.io) for å *transpilere* ES6 kode til ES5 kode. Vi begynner ved å installere Babel CLI-et (Command Line Interface) og det siste presetet.

```
$ npm install babel-cli babel-preset-latest --save-dev
```

I tillegg vil vi bruke `nodemon`, et verktøy som gjør at serveren vår restartes automatisk hver gang vi gjør endringer i koden, slik at vi ikke trenger å kjøre `npm start` mellom hver gang. 

```
$ npm install nodemon --save-dev
```

Nå skal din `package.json` fil se omtrent slik ut:
```javascript
{
  "name": "beer-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.15.2",
    "express": "^4.14.0",
    "mongoose": "^4.6.8"
  },
  "devDependencies": {
    "babel-cli": "^6.18.0",
    "babel-preset-latest": "^6.16.0",
    "nodemon": "^1.11.0"
  }
}
```

> **Ey! --save-dev vs. --save**
> Du la kanskje merke til at pakkene vi installerte med *--save-dev* flagget la seg under *devDependencies* og de vi installerte med *--save* flagget la seg under *dependencies*? Pakker vi installerer med *--save-dev* flagget er pakker som kun er ment for bruk under utvikling, slik som testrammeverk, task runners, og build tools. Pakker installert med *--save* flagget er pakker som er vitale for at din app skal kunne fungere og kjøre.

Vi må gjøre noen få endringer i `package.json` filen for å konfigurere *Babel* og *nodemon*, samt gjøre klart for resten av prosjektet; 

* Legge til en `babel` property
* Endre entry point
* Legge til `start` script

```javascript
{
  "name": "beer-app",
  "version": "1.0.0",
  "description": "",
  "main": "server.js", // <- rename fra index.js
  "scripts": {
    "start": "nodemon server.js --exec babel-node --presets latest", // <- legg til dette
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.15.2",
    "express": "^4.14.0",
    "mongoose": "^4.6.8"
  },
  "devDependencies": {
    "babel-cli": "^6.18.0",
    "babel-preset-latest": "^6.16.0",
    "nodemon": "^1.11.0"
  },
  "babel": { // <- legg til dette
    "presets": ["latest"]
  }
}
```

#### 3. Sette opp en Express server
Neste steg er å sette opp en express server, og her vil vi bare ha med hva som er absolutt nødvendig. Her vil vi først hente inn express, definere app, lage og konfigurere vår app til å bruke bodyParser, og sette port for appen. Begynn ved å lage en ny fil kalt `server.js` i rotmappen.

```javascript
// server.js

// IMPORTS
// vi kaller først pakkene vi trenger
import express     from 'express'; 
import bodyParser  from 'body-parser';
import mongoose    from 'mongoose';

// deretter kaller vi routene vi skal bruke (disse defineres senere)
import routes      from './routes/index';
import beers       from './routes/beers';


// SETUP
let app   = express(); // <- definerer en express app
let port  = process.env.port || 8080;
mongoose.connect('mongodb://localhost:27017/beer-app') // pass på at MongoDB kjører!


// MIDDLEWARES
// vi konfigurerer så at app skal bruke bodyParser som middleware
// dette vil la oss hente data ved POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
// registrerer routene vi skal lage
app.use('/api', routes)
app.use('/api/beers', beers)


// START SERVER
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
```

Dersom man prøver å kjøre prosjektet nå ved å kjøre kommandoen `npm start` vil man få en del feil - dette er fordi vi har prøvd å importere filer fra */routes* som enda ikke finnes.

Neste steg blir derfor å lage disse filene! Lag en ny mappe kalt `routes` i rotmappen, og lag to nye filer inni denne mappen; `index.js` og `beers.js`. Så kan du åpne filen `index.js` - vi skal lage vårt første endepunkt!

```javascript
// routes/index.js

import { Router } from 'express'; // importer Router fra Express

let router = Router(); // lag en instans av express Router

// returner JSON til klienten ved en GET-request til http://localhost:8080/api
router.get('/', (req, res) => {
	res.status(200).json({
		message: "Hooray! Our API works!"
	})
})

// gjør router variabelen tilgjengelig for andre filer
module.exports = router;
```
Når en klient nå kjører en GET request til `http://localhost:8080/api` vil det bli returnert en status kode 200 (OK) og et JSON object på formen
`{ message: "Hooray! Our API works!" }`. Så lett var det! 

Før vi går i gang med å definere flere endepunkter, må vi sette opp en Mongoose modell for våre Beer objekter. 

#### 4. Object Data Mapping (ODM) med Mongoose

Etter dette oppretter vi og definerer en modell. Vi lager en ny mappe i rotmappen kalt `models` og oppretter filen `beer.js` i mappen.

```javascript
// models/beer.js

import mongoose from 'mongoose';

const BeerSchema   = new mongoose.Schema({
    name:       String, // name er av typen String
    brewery:    String, // brewery er av typen String
    size:       Number, // size er av typen Number (som i 500 ml)
    alcoholic:  Boolean // alcoholic er av typen Boolean
});

module.exports = mongoose.model('Beer', BeerSchema);
```

Denne modellen hjelper oss med å oversette data i MongoDB databasen vår til JavaScript objekter. I vårt tilfelle vil en Beer-enhet ha egenskapene *name, brewery, size* og *alcoholic*, som alle er frivillig å spesifisere. Hvis vi ønsker å være litt strengere, kunne vi ha definert egenskaper for eksempel slik: 

```javascript
// ...
mobileNumber: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{9}$/, 'This value is not a valid phone number.']
}
// ...
```

For å holde tutorialen simpel nok, holder vi oss til frivillige egenskaper slik som BeerSchema allerede er definert.

#### 5. Definere API endepunkter 
Da er vi endelig klare til å implementere selve kjernen av API-et vårt; nemlig routene som definerer endepunktene våre. 

Det er i hovedsak fem operasjoner vi ønsker å kunne utføre:
* Hente ut alle Beer-enheter
* Lage en ny Beer-enhet
* Hente ut èn enkelt Beer-enhet
* Oppdatere en Beer-enhet
* Slette en Beer-enhet

Følgende tabell viser hvilke API endepunkter vi vil opprette, hvilken operasjon som skal utføres og hvilken HTTP metode det tilsvarer.

| Endpoint       | HTTP metode   | CRUD operasjon       |
| -------------  |:-------------:| --------------------:|
| /api/beers     | `GET`         | **READ** all Beers  |
| /api/beers     | `POST`        | **CREATE** one Beer |
| /api/beers/:id | `GET`         | **READ** one Beer   |
| /api/beers/:id | `PUT`         | **UPDATE** one Beer |
| /api/beers/:id | `DELETE`      | **DELETE** one Beer |

Disse endepunktene er ikke valgt helt på måfå; de følger et sett med best practices for hvordan man skal designe RESTfulle URL-er:
* URL-er skal inneholde substantiv, aldri verb
    * Bra:     `http://localhost:8080/api/beers`
    * Dårlig:  `http://localhost:8080/api/beers/get`
* Kun bruk flertall substantiv for konsistens, aldri entall
    * Bra:     `http://localhost:8080/api/beers`
    * Dårlig:  `http://localhost:8080/api/beer`
* Du skal aldri trenge å gå dypere enn `ressurs/id/ressurs`

Da skal vi kode litt igjen! Åpne opp filen `beers.js` i routes mappen. Vi begynner med endepunktet for å lage en enkelt Beer-enhet.

```javascript=
// routes/beers.js

import { Router } from 'express';
import Beer from '../models/beer'

let router = Router();

// http://localhost:8080/api/beers
router.route('/')
    
    // Create a single beer
    .post((req, res) => {

        let beer = new Beer({            // lag en ny instans av Beer-modellen
            name: 	   req.body.name,   
            brewery:   req.body.brewery,
            size: 	   req.body.size,
            alcoholic: req.body.alcoholic
        })

        beer.save((err, savedBeer) => {
            if (err) res.status(500).send(err); // hvis db error, returner status kode 500
            res.status(201).json(savedBeer); // ellers returner status kode 201 og den lagrede Beer-enheten
        })
    })

module.exports = router;
```

Nå kan vi prøve å legge til en ny enhet i databasen ved å bruke `cURL` på Mac / UNIX. Forsikre deg om at serveren kjører (*npm start* i rotmappen), og deretter åpne et nytt terminalvindu og skriv inn følgende:
> NB: Hvis du har Windows, anbefaler vi at du enten bruker Git Bash for å bruke cURL, eller Chrome-extensionen Postman.

```shell
$ curl --data "name=Heineken&brewery=Mack&size=500&alcoholic=false" http://localhost:8080/api/beers/
```

Se der ja! Hvis alt er oppe og kjører som det skal, vil du få som svar:
```shell
{"__v":0,"name":"Heineken","brewery":"Mack","size":500,"alcoholic":false,"_id":"582f7927a3fb158de63a8da9"}
```

Som du ser så har MongoDB opprettet en unik ID for oss. 

Videre implementerer vi routen for å hente alle Beer-enheter. Med Router.route() kan vi chaine sammen forskjellige routes (altså HTTP metoder) på samme endepunkt.

```javascript=19
// routes/beers.js
// ....
		beer.save((err, savedBeer) => {
			if (err) res.status(500).send(err);
			res.status(201).json(savedBeer);
		})
	})
    
    // Read all beers
    .get((req, res) => {
        Beer.find((err, beers) => {
            if (err) res.status(500).send(err);
            res.status(200).json({
                "count":   beers.length,
                "results": beers
            })
        })
    })
// ....
```

Så kan vi igjen teste med cURL (eller Postman):
```shell
$ curl -X GET http://localhost:8080/api/beers
```

Og da får vi som svar:
```json
{
    "count": 1,
    "results: [
        {
            "_id": "582f74aaa3fb158de63a8da8",
            "name": "Heineken",
            "brewery": "Mack",
            "size": 500,
            "alcoholic": false,
            "__v": 0
        }
    ]
}
```
Det er god praksis å returnere noe metadata om resultatsettet, slik som antall enheter som ble returnert (*count* i dette tilfellet). 

La oss fortsette å bygge på våre endepunkter. Vi har nå håndtert alle routes som går til `/api/beers`, og nå skal vi begynne med alle routes som omhandler single Beer-enheter, altså `/api/beers/:id` endepunkter. 

```javascript=38
// routes/beers.js

// ....

// http://localhost:8080/api/beers/:id
router.route('/:id')
	
    // Get a beer by id
    .get((req, res) => {
        Beer.findById(req.params.id, (err, beer) => {
            if (err) res.status(500).send(err);
            res.status(200).json(beer);
        })
    })
    
    // Update a beer by id
    .put((req, res) => {
        var beerId = req.params.id
        Beer.findById(beerId, (err, beer) => {
            if (err) res.status(500).send(err);
            if (!beer) res.status(404).json({message: "Not found."})
            let { beer.name, beer.brewery, beer.size, beer.alcoholic } = req.body

            beer.save((err, savedBeer) => {
                if (err) res.status(500).send(err);
                res.json(savedBeer)
            })
        })
    })
	
    // Delete a beer by id
    .delete((req, res, next) => {
        Beer.findByIdAndRemove(req.params.id, (err, beer) => {
            if (err) res.status(500).send(err);
            res.json(beer);
        })
    })
    
// ....
```

Test ut de nye endepunktene med cURL eller Postman! Husk at på PUT endepunkter må du sende med en body (på samme måte som vi gjorde for POST til /api/beers).




#### 7. Express middlewares
Middlewares er funksjoner som spesifiseres til å kjøre enten application-wide, eller når et visst endepunkt blir aksessert. Middlewares har tilgang til `req` og `res` objektene, samt det neste middleware-laget ved hjelp av `next` variabelen. Man kan gjøre haugevis av ting med Express middlewares, der av noe av det vanligste er å logge alle innkommende requests, verifisere identiteten til en innkommende request (auth), håndtere sikkerhet og mye mer. 

Vi kan nå opprette en det enkleste express middleware vi kan tenke oss. I dette eksempelet skal vi simpelthen logge til konsollen hver gang API'et mottar en forespørsel.

```javascript
// server.js
// ...

// MIDDLEWARES
// middleware for alle forespørsler
router.use((req, res, next) => {
    console.log('Test Testosteron logger alt!'); // <- logg
    next(); // går til neste routes i stedenfor å stoppe her
});

// ROUTES
// ...
```
Hver gang serveren nå mottar en request, vil det logges "Test Testosteron logger alt!" til terminalen som serveren kjøres i. Det finnes en haug av nyttige middlewares som man simpelthen kan installere med npm - [sjekk ut denne listen for mer](https://blog.jscrambler.com/setting-up-5-useful-middlewares-for-an-express-api/)


---


### Avslutning
Du har nå opprettet et RESTful API! Om man ønsker å bevege seg videre kan neste steg være å koble dette opp til et AngularJS eller React prosjekt. Du kan se hele [GitHub repoet her](https://github.com/pmitche/it2810-tutorial).


