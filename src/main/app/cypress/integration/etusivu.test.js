Cypress.Screenshot.defaults({
    capture: 'runner'
  });

  describe('Etusivu', () => {
    it('Etusuvun smoke-testi', () => {
      cy.etusivuSmokeTest()
    });
  });