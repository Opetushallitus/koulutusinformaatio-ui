const autoRecord = require('cypress-autorecord');
describe('Tutkinnon osa KOMO', function () {
  autoRecord();
  it('Tutkinnon osa KOMO renders properly', function () {
    cy.visit('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000622');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('(testi) Hevosten hyvinvoinnista huolehtiminen');
    cy.contains('Muu Ammatillinen koulutus');
    cy.contains('25 + 20 osaamispistettä');
    cy.get('[aria-expanded=false]').contains('Hevosten hyvinvoinnista');
  });

  it('Tutkinnon osa KOMO kuvaus accordions work', function () {
    cy.get('a[href*="tutkinnonosat/2449201"]').should('not.be.visible');
    cy.get('[aria-expanded=false]').contains('Hevosten hyvinvoinnista').click();

    cy.get('a[href*="tutkinnonosat/2449201"]').should('be.visible');
    cy.get('[aria-expanded=true]').contains('Hevosten hyvinvoinnista');

    cy.get('a[href*="tutkinnonosat/2569404"]').should('not.be.visible');
    cy.get('[aria-expanded=false]').contains('Hevosten kouluttaminen').click();

    cy.get('a[href*="tutkinnonosat/2569404"]').should('be.visible');
    cy.get('[aria-expanded=true]').contains('Hevosten kouluttaminen');
  });
});
