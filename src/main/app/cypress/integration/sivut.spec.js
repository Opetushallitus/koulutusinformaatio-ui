const autoRecord = require('cypress-autorecord');
describe('Sivut', () => {
  autoRecord();
  it('Language change should be reflected in URL and page content', function() {
    cy.visit('/konfo/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun');
    cy.findByRole('heading', {
      name: /paikan vastaanotto ja ilmoittautuminen korkeakouluun/i,
    });
    cy.findByRole('button', { name: /fi/i }).click();
    cy.findByRole('option', { name: /på svenska/i }).click();

    cy.findByRole('heading', { name: /mottagande av studieplats i gemensam ansökan och anmälning till högskolor/i })
    cy.url().should('include', '/sv/sivu/mottagande-av-studieplats-i-gemensam-ansoekan-och-anmaelning-till-hoegskolor')
    
    cy.go('back');
    cy.url().should('include', '/konfo/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun');
    cy.findByRole('heading', {
      name: /paikan vastaanotto ja ilmoittautuminen korkeakouluun/i,
    });

  });
});
