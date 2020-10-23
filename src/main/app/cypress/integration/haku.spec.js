const autoRecord = require('cypress-autorecord');
describe('Haku', () => {
  autoRecord();
  it('Koulutustyyppi checkboxes should work hierarchically', function() {
    cy.visit('/konfo/fi/haku/auto');

    cy.findByRole('checkbox', { name: /Ammatillinen koulutus/ }).as(
      'AmmatillinenKoulutus'
    );
    cy.findByRole('checkbox', { name: /Ammatillinen perustutkinto/ }).as(
      'AmmatillinenPerustutkinto'
    );
    cy.findByRole('checkbox', { name: /Ammattitutkinto/ }).as('Ammattitutkinto');
    cy.findByRole('checkbox', { name: /Erikoisammattitutkinto/ }).as(
      'Erikoisammattitutkinto'
    );

    cy.get('@AmmatillinenKoulutus').check();
    cy.get('@AmmatillinenPerustutkinto').should('be.checked');
    cy.get('@Ammattitutkinto').should('be.checked');
    cy.get('@Erikoisammattitutkinto').should('be.checked');

    cy.get('@AmmatillinenKoulutus').uncheck();
    cy.get('@AmmatillinenPerustutkinto').should('not.be.checked');
    cy.get('@Ammattitutkinto').should('not.be.checked');
    cy.get('@Erikoisammattitutkinto').should('not.be.checked');

    cy.get('@AmmatillinenPerustutkinto').check();
    cy.get('@AmmatillinenKoulutus').should('have.attr', 'data-indeterminate');

    cy.get('@Ammattitutkinto').check();
    cy.get('@Erikoisammattitutkinto').check();

    cy.get('@AmmatillinenKoulutus').should('be.checked');
  });
  it('Koulutusala checkboxes should work hierarchically', function() {
    cy.visit('/konfo/fi/haku/auto');
    cy.findByText('Koulutusalat').should('exist');
    cy.findByText('Tekniikan alat')
      .click()
      .should('not.be.visible');

    const tekniikanAlatChk = () =>
      cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i });
    const arkkitehtuuriJaRakentaminen = () =>
      cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen \(\d*\)/i });
    const materiaaliJaProsessitekniikka = () =>
      cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka \(\d*\)/i });
    const koneProsessiEnergiaSahkoTekniikka = () =>
      cy.findByRole('checkbox', {
        name: /Kone-, prosessi-, energia- ja sähkötekniikka \(\d*\)/i,
      });

    tekniikanAlatChk().check();

    tekniikanAlatChk().should('have.attr', 'data-indeterminate', 'false');
    arkkitehtuuriJaRakentaminen().should('be.checked');
    materiaaliJaProsessitekniikka().should('be.checked');
    koneProsessiEnergiaSahkoTekniikka().should('be.checked');

    materiaaliJaProsessitekniikka().uncheck();

    tekniikanAlatChk().should('have.attr', 'data-indeterminate', 'true');
    arkkitehtuuriJaRakentaminen().should('be.checked');
    materiaaliJaProsessitekniikka().should('not.be.checked');
    koneProsessiEnergiaSahkoTekniikka().should('be.checked');

    arkkitehtuuriJaRakentaminen().check();

    tekniikanAlatChk().should('have.attr', 'data-indeterminate', 'true');
    arkkitehtuuriJaRakentaminen().should('be.checked');
    materiaaliJaProsessitekniikka().should('not.be.checked');
    koneProsessiEnergiaSahkoTekniikka().should('be.checked');

    materiaaliJaProsessitekniikka().check();

    tekniikanAlatChk()
      .should('be.checked')
      .should('have.attr', 'data-indeterminate', 'false');
    arkkitehtuuriJaRakentaminen().should('be.checked');
    materiaaliJaProsessitekniikka().should('be.checked');
    koneProsessiEnergiaSahkoTekniikka().should('be.checked');
  });
  it("Koulutuskortti data should be presented correctly for 'Tutkinnon osa'", function() {
    cy.visit('/konfo/fi/haku/auto');

    const searchBox = () =>
      cy.findByRole('searchbox', { name: /etsi koulutuksia tai oppilaitoksia/i });
    const searchButton = () => cy.findByRole('button', { name: /etsi/i });

    searchBox().type('Hevosten hyvinvoinnista huolehtiminen');
    searchButton().click();
    cy.get('[data-cy="1.2.246.562.13.00000000000000000598"]').within((kortti) => {
      cy.get(
        '[data-cy="tutkintonimikkeet-1.2.246.562.13.00000000000000000598"]'
      ).contains('Tutkinnon osa');
      cy.get('[data-cy="opintojenlaajuus-1.2.246.562.13.00000000000000000598"]').contains(
        '25 + 50 osaamispistettä'
      );
    });
  });
  it("Koulutuskortti data should be presented correctly for 'Osaamisala'", function() {
    cy.visit('/konfo/fi/haku/auto');

    const searchBox = () =>
      cy.findByRole('searchbox', { name: /etsi koulutuksia tai oppilaitoksia/i });
    const searchButton = () => cy.findByRole('button', { name: /etsi/i });

    searchBox().type('Jalkojenhoidon osaamisala');
    searchButton().click();
    cy.get('[data-cy="1.2.246.562.13.00000000000000000615"]').within((kortti) => {
      cy.get(
        '[data-cy="tutkintonimikkeet-1.2.246.562.13.00000000000000000615"]'
      ).contains('Osaamisala');
      cy.get('[data-cy="opintojenlaajuus-1.2.246.562.13.00000000000000000615"]').contains(
        '145 osaamispistettä'
      );
    });
  });
});
