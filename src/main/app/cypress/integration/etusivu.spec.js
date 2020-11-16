const autoRecord = require('cypress-autorecord');
describe('Etusivu', function () {
  autoRecord();
  it('Should have cards with working links', function () {
    cy.visit('/');

    cy.get('a[href*="/sivu/ammatillinen-koulutus"]').click();
    cy.get('h1').contains('Ammatillinen koulutus');
  });
});
