# Koulutusinformaatio UI

Koulutusinformaatio UI on luotu create-react-app:lla. Backend, jonka ainoa tehtävä on jakaa käyttöliittymä, on Spring Boot 2.0 -sovellus.

## Buildaus ja käynnistys

Projektin saa buildattua komennolla:

`mvn clean install`

Tämän jälkeen projektin voi käynnistää lokaalisti komennolla:

`java -jar target/koulutusinformaatio-ui-0.1.0-SNAPSHOT.jar

Sovellus aukeaa osoitteeseen:

http://localhost:8080/

## Käyttöliittymän kehittäminen

Kehityksen aikana käyttöliittymää kannattaa ajaa nodella, jolloin muutokset näkyvät suoraan selaimessa.

`cd src/main/app`
`npm start`

Käyttöliittymä aukeaa osoitteeseen:

http://localhost:3005/
