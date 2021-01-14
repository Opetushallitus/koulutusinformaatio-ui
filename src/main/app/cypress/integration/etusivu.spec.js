describe('Etusivu', () => {
  it('Should have cards with working links', () => {
    cy.visit('/');

    cy.get('a[href*="/sivu/ammatillinen-koulutus"]').click();
    cy.get('h1').contains('Ammatillinen koulutus');
  });
});
