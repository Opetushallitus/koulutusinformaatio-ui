import { playMockFile } from 'kto-ui-common/cypress/mockUtils';

describe('Osaamisalan description KOMOTO', () => {
  beforeEach(() => {
    playMockFile('komoto-osaamisala-kuvaus.mocks.json');
  });
  // TODO: This test fails with current data from hahtuva. See https://beta.hahtuvaopintopolku.fi/konfo-backend/search/oppilaitoksen-osa/1.2.246.562.10.76662434703/tarjonta
  it('KOMOTO includes osaamisala description', () => {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000000437');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h2').contains('Osaamisalat');
    cy.findByRole('button', { name: /koirahieronnan osaamisala/i }).click();
    cy.get('p').contains(
      'Koirahieronnan osaamisalan suorittanut voi toimia itsenäisenä yrittäjänä tai työntekijänä koirahierontapalveluja tarjoavassa yrityksessä. Hän osaa toteuttaa koirien hieronnan laatimiensa hierontasuunnitelmien mukaisesti ja antaa tarvittavat jatko-ohjeet koirien omistajille tai ohjaajille. Lisäksi hän osaa toimia yrityksen asiakaspalvelutehtävissä ja opastaa asiakkaita eläinten hoitoon liittyvissä kysymyksissä.'
    );
    cy.get('p').contains(
      'Valinnainen tutkinnon osa Eläinalan yritystoiminta valmistaa häntä toimimaan alan yrittäjänä.'
    );
  });
  it('KOMOTO: on empty or missing osaamisala description fallback text should be displayed', () => {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000000466');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h2').contains('Osaamisalat');
    cy.findByRole('button', { name: /kuljetuspalvelujen osaamisala/i }).click();
    cy.get('p').contains('Osaamisalalle ei löytynyt kuvausta.');
  });
});
