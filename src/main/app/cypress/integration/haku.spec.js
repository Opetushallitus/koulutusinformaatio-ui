const autoRecord = require('cypress-autorecord');
describe('Haku', () => {
  autoRecord();
  it('Koulutustyyppi checkboxes should work hierarchically', function () {
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
  it("Koulutustyyppi switching between 'Tutkintoon johtavat' and 'Muut'", function () {
    cy.visit('/konfo/fi/haku/auto');
    const tutkintoonJohtavatBtn = () =>
      cy.findByRole('button', { name: /Tutkintoon johtavat/i });
    const muutBtn = () => cy.findByRole('button', { name: /Muut/i });
    const ammatillinenKoulutusChk = () =>
      cy.findByRole('checkbox', { name: /Ammatillinen koulutus/i });
    const ammatillinenPerustutkintoChk = () =>
      cy.findByRole('checkbox', { name: /Ammatillinen perustutkinto/i });
    const erikoisammattitutkintoChk = () =>
      cy.findByRole('checkbox', { name: /Erikoisammattitutkinto/i });
    const tutkinnonOsaChk = () => cy.findByRole('checkbox', { name: /Tutkinnon osa /i });
    const osaamisalaChk = () => cy.findByRole('checkbox', { name: /Osaamisala /i });

    ammatillinenKoulutusChk().should('be.visible');
    ammatillinenPerustutkintoChk().should('be.visible');
    erikoisammattitutkintoChk().should('be.visible');

    cy.get('[data-cy=koulutustyyppi-filter]').within((koulutustyyppppi) => {
      tutkintoonJohtavatBtn().should('have.attr', 'aria-selected', 'true');
      muutBtn().should('have.attr', 'aria-selected', 'false');

      muutBtn().click().should('have.attr', 'aria-selected', 'true');
      tutkintoonJohtavatBtn().should('have.attr', 'aria-selected', 'false');
      tutkinnonOsaChk().should('be.visible');
      osaamisalaChk().should('be.visible');
      ammatillinenPerustutkintoChk().should('not.be.visible');
      erikoisammattitutkintoChk().should('not.be.visible');

      tutkinnonOsaChk().check().should('be.checked');
      ammatillinenKoulutusChk().should('have.attr', 'data-indeterminate', 'true');
      osaamisalaChk().should('not.be.checked');

      osaamisalaChk().check().should('be.checked');
      tutkinnonOsaChk().should('be.checked');
      ammatillinenKoulutusChk()
        .should('be.checked')
        .should('have.attr', 'data-indeterminate', 'false');
    });
  });
  it('Koulutusala checkboxes should work hierarchically', function () {
    cy.visit('/konfo/fi/haku/auto');
    cy.findByText('Koulutusalat').should('exist');
    cy.findByText('Tekniikan alat').click().should('not.be.visible');

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
    cy.get('[data-cy=koulutusalat-filter]')
      .should('exist')
      .within((kaf) => {
        tekniikanAlatChk().should('exist').check();

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
  });
  it('Opetustapa filter checkboxes and mobile summary view', function () {
    cy.visit('/konfo/fi/haku/auto');
    const etaopetusChk = () => cy.findByRole('checkbox', { name: /Etäopetus \(\d*\)/i });
    const verkkoOpiskeluChk = () =>
      cy.findByRole('checkbox', { name: /Verkko-opiskelu \(\d*\)/i });
    cy.findByText('Opetustapa').should('exist').click();
    cy.get('[data-cy=opetustapa-filter]')
      .should('exist')
      .within((optf) => {
        etaopetusChk().click().should('be.checked');
        etaopetusChk().click().should('not.be.checked');
        verkkoOpiskeluChk().click().should('be.checked');
      });
    cy.get('[data-cy=chip-opetuspaikkakk_3]')
      .should('exist')
      .within((etaOpChip) => {
        cy.get('svg').should('exist').click();
      });
    cy.get('[data-cy=opetustapa-filter]')
      .should('exist')
      .within((optf) => {
        verkkoOpiskeluChk().should('exist').should('not.be.checked');
      });
  });
});
