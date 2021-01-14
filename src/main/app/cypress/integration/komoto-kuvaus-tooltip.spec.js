import { playMockFile } from 'kto-ui-common/cypress/mockUtils';

describe('Kuvaus tooltip KOMOTO', () => {
  beforeEach(() => {
    playMockFile('komoto-kuvaus-tooltip.mocks.json');
  });

  it('Suunniteltu kesto kuvaus KOMOTO renders properly', () => {
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
    cy.findByRole('tooltip').within(() => {
      cy.get('a[href*="https://oph.fi"]').should('have.attr', 'target', '_blank');
    });
  });
});
