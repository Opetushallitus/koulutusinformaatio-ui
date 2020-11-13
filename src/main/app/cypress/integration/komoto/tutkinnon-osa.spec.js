const autoRecord = require('cypress-autorecord');

describe('Tutkinnon osa KOMOTO', function () {
  autoRecord();

  it('Tutkinnon osa KOMOTO renders properly', function () {
    cy.visit('/konfo/fi/toteutus/1.2.246.562.17.00000000000000000469');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('(testi) Hevosten hyvinvoinnista huolehtiminen');
    cy.contains('25 + 20 osaamispistettä');
    cy.get('h2').contains('Ilmoittaudu koulutukseen');
    cy.get('a[href="http://www.google.fi"]').contains('Ilmoittaudu koulutukseen');
  });

  it('Tutkinnon osa KOMO kuvaus accordions work', function () {
    cy.get('a[href*="tutkinnonosat/2449201"]').should('not.be.visible');
    cy.get('[aria-expanded=false]').contains('Lisätietoa ilmoittautumisesta').click();
    cy.get('[aria-expanded=true]').contains('Lisätietoa ilmoittautumisesta');
  });
});
