const autoRecord = require('cypress-autorecord');

describe('Valintaperuste page', function () {
  autoRecord();

  it('Valintaperuste-page renders properly', function () {
    cy.visit('/fi/hakukohde/1.2.246.562.20.00000000000000000191/valintaperuste');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.findByRole('heading', { level: 4, name: /Liiketoiminnan perustutkinto/ });
    cy.findByRole('heading', { level: 4, name: /kielikoe/ });
    cy.findByRole('heading', { level: 4, name: /Annikan pääsykoe/ });
    cy.findByRole('heading', { level: 4, name: /lisäpiste urheilijalle/ });

    cy.findByRole('button', { name: /Tilaisuus 1/ }).click();
  });
});
