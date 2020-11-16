const autoRecord = require('cypress-autorecord');
describe('Osaamisala KOMO', function () {
  autoRecord();
  it('Osaamisala KOMO renders properly', function () {
    cy.visit('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000623');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h1').contains('Hevosten kengittämisen osaamisala');
    cy.findByText('Muu Ammatillinen koulutus');
    cy.findByText('100 osaamispistettä');
    cy.get('h3').contains('Tutkinnon suorittaneen osaaminen');
  });
});
