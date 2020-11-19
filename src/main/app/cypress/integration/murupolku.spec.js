const autoRecord = require('cypress-autorecord');
const { assertBreadcrumb } = require('../utils');

describe('Murupolku', function () {
  autoRecord();

  it('Should show correct breadcrumb for a contentful page', function () {
    const url = '/konfo/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun';
    cy.visit(url);

    assertBreadcrumb({
      length: 4,
      lastTextContains: 'Paikan vastaanotto ja ilmoittautuminen korkeakouluun',
      lastHrefContains: url,
      hasHakutuloksetLink: false,
    });
  });

  it('Should show correct breadcrumb for koulutus', function () {
    const url = '/konfo/fi/koulutus/1.2.246.562.13.00000000000000000570';
    cy.visit(url);

    assertBreadcrumb({
      length: 3,
      lastTextContains: 'Autoalan perustutkinto',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for toteutus', function () {
    const url = '/konfo/fi/toteutus/1.2.246.562.17.00000000000000000404';
    cy.visit(url);

    assertBreadcrumb({
      length: 4,
      lastTextContains: 'PetteriT:n testitoteutus',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for oppilaitos', function () {
    const url = '/konfo/fi/oppilaitos/1.2.246.562.10.56753942459';
    cy.visit(url);

    assertBreadcrumb({
      length: 3,
      lastTextContains: 'Aalto-yliopisto',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for oppilaitoksen osa', function () {
    const url = '/konfo/fi/oppilaitososa/1.2.246.562.10.61042218794';
    cy.visit(url);

    assertBreadcrumb({
      length: 4,
      lastTextContains: 'Aalto-yliopisto, Kauppakorkeakoulu',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });

  it('Should show correct breadcrumb for valintaperuste', function () {
    const url =
      '/konfo/fi/hakukohde/1.2.246.562.20.00000000000000000429/valintaperuste/4a1037c9-290c-48c1-a726-9833e1b2d749';
    cy.visit(url);

    assertBreadcrumb({
      length: 5,
      lastTextContains: 'Valintaperusteen kuvaus 7.11.2020',
      lastHrefContains: url,
      hasHakutuloksetLink: true,
    });
  });
});
