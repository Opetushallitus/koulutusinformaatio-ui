describe('Cookiemodal page', () => {
  it('Cookie modal can be accepted, and saves a cookie', () => {
    cy.clearCookies();
    cy.getCookie('oph-mandatory-cookies-accepted')
        .then((cookie) => {
            expect(cookie).to.be.null;
        });

    cy.visit('/fi/');

    // Wait for everything to load
    cy.findByRole('progressbar').should('not.exist');

    cy.findByRole('button', { name: 'Hyväksy evästeet' }).click();
    cy.getCookie('oph-mandatory-cookies-accepted').should(
      'have.property',
      'value',
      'true'
    );
  });
});
