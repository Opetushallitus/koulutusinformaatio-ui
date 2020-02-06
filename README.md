# Konfo-UI


Konfo-UI on luotu create-react-app:lla. Backend, jonka ainoa tehtävä on jakaa käyttöliittymä, on Spring Boot 2.0 -sovellus.

[![Build status](https://travis-ci.org/Opetushallitus/konfo-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/konfo-ui)

## Vaatimukset

Lokaalia ajoa varten Konfo-backendin pitää vastata osoitteessa:

http://localhost:3006

(Porttia voi myös vaihtaa, ks. käyttöliittymän kehittäminen)

## Buildaus ja käynnistys

Projektin saa buildattua komennolla:

`mvn clean install`

Tämän jälkeen projektin voi käynnistää lokaalisti komennolla:

`java -jar target/konfo-ui-0.1.0-SNAPSHOT.jar --spring.config.location=./konfoui-dev.yml`

tai komennolla:

`mvn spring-boot:run`

Sovellus aukeaa osoitteeseen:

http://localhost:8080/

## Käyttöliittymän kehittäminen

Kehityksen aikana käyttöliittymää kannattaa ajaa pelkästään nodella, jolloin muutokset näkyvät suoraan selaimessa.

`cd src/main/app`

Ensimmäisellä kerralla `npm rebuild node-sass`

`npm start`

Käyttöliittymä aukeaa osoitteeseen:

http://localhost:3005/

Portteja voi vaihtaa ajamalla:

`PORT=5555 BACKEND_PORT=5556 npm start`

## Testit

Käyttöliittymätestit (cypress) käynnistyy komennolla: 

    cd src/main/app
    npm run cypress:open
    
Muut testit löytyvät hakemistosta `src/main/app/src/__tests__`.
Nimetään yksikkötestit päätteellä `.test.js` ja laitetaan ne sopiviin hakemistoihin.
Lisäksi projektissa on headless-selaintestejä, jotka käyttävät Puppeteer-kirjastoa. Laitetaan ne hakemistoon
`src/main/app/src/__tests__/headless/`. Mock-datan luontiin tarvittavat javascript-luokat ja muut testityökalut
voi laittaa hakemistoon `src/main/app/src/__tests__/mocks`, joka skipataan testejä ajettaessa.

Testit voi ajaa default porteissa komennolla

`npm test`

tai tietyissä porteissa

`PORT=5555 BACKEND_PORT=5556 npm test`

Jos haluaa ajaa testit ilman watchia, annetaan lisäksi parametriksi `CI=true`.

Linttaukset voi ajaa komennola
`npm run lint`
tai automaattisen fiksauksen kanssa
`npm run lint:fix`
Linttaukset ajetaan automaattisesti, kun koodia koitetaan committaa.
