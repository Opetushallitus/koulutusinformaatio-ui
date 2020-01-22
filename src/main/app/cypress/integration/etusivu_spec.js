
describe('Etusivu', function() {
    it('Should have cards with working links', function() {
        cy.visit('/');
        cy.get(`[data-cy="kortti-link"]`)
          .first()
          .click();

        cy.get(`[data-cy="sivu"]`).should('be.visible');
    })
})