const autoRecord = require('cypress-autorecord');

describe.only('Suunniteltu kesto kuvaus KOMOTO', function () {
  autoRecord();

  it('Suunniteltu kesto kuvaus KOMOTO renders properly', function () {
    cy.visit('/fi/toteutus/1.2.246.562.17.00000000000000000420');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');
    cy.get('h3').contains('Suunniteltu kesto');
    cy.findByRole('tooltip').should('not.exist');
    cy.findByRole('heading', { name: /suunniteltu kesto/i })
      .parent()
      .parent()
      .within((s) => {
        cy.findByRole('button').click();
      });
    cy.findByRole('tooltip').within((t) => {
      cy.findByRole('heading', {
        name: /tarkemman kuvauksen teksti ja linkki google.com/i,
      });
      cy.findByRole('link', { name: 'https://oph.fi' })
        .should('have.attr', 'href', 'https://oph.fi')
        .should('have.attr', 'target', '_blank');
      cy.findByRole('link', { name: 'https://beta.testiopintopolku.fi/konfo/fi' })
        .should('have.attr', 'href', 'https://beta.testiopintopolku.fi/konfo/fi')
        .should('have.attr', 'target', '_blank');
    });
  });
});
