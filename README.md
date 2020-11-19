# Konfo-UI

Konfo-UI on luotu create-react-app:lla. Backend, jonka ainoa tehtävä on jakaa käyttöliittymä, on Spring Boot 2.0 -sovellus.

[![Build status](https://travis-ci.org/Opetushallitus/konfo-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/konfo-ui)

## Käyttöliittymän kehittäminen

TL;DR

    cd src/main/app
    npm i
    npm start

Kehityksen aikana käyttöliittymää kannattaa ajaa pelkästään nodella, jolloin muutokset näkyvät suoraan selaimessa. TL;DR ohjeilla käyttöliittymä aukeaa osoitteeseen:

http://localhost:3000/

Portteja voi vaihtaa ajamalla:

`PORT=5555 npm start`

Tai esim. kirjaamalla .env.local -tiedostoon `PORT=5555`

## Testit

Selainta vasten ajettavat testit (cypress) olettavat kälin löytyvän ajossa portista `3005`. käyttöliittymätestit käynnistyy komennolla:

    cd src/main/app
    npm run cypress:open

### Yksikkötestit

`npm test`

Yksikkötestit nimetään päätteellä `.test.js` ja ne luodaan niihin kansioihin missä niiden testaama koodi sijaitsee.

### Lint

Lintin voi ajaa komennolla `npm run lint`, tai automaattisen fiksauksen kanssa `npm run lint:fix`. Lint ajetaan myös huskyn pre-commit hookkina.

## Buildaus ja käynnistys

Projektin saa buildattua komennolla:

`mvn clean install`

Tämän jälkeen projektin voi käynnistää lokaalisti komennolla:

`java -jar target/konfo-ui-0.1.0-SNAPSHOT.jar --spring.config.location=./konfoui-dev.yml`

tai komennolla:

`mvn spring-boot:run`

Sovellus aukeaa osoitteeseen:

http://localhost:8080/
