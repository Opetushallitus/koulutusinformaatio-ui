describe('Haku', () => {
  it('Koulutustyyppi checkboxes should work hierarchically', () => {
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
  it('Koulutusala checkboxes should work hierarchically part1', () => {
    cy.visit('/konfo/fi/haku/auto');
    cy.findByText('Koulutusalat').as('Koulutusalat')
    cy.get('@Koulutusalat').should('exist');
    cy.findByText('Tekniikan alat').as('TekniikanAlatTxt');
    cy.get('@TekniikanAlatTxt').click()
    cy.get('@TekniikanAlatTxt').should('not.be.visible')


    cy.findByRole('button', { name: /<< Kaikki koulutusalat/i }).as(
      'BackToLevel01'
    );
    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_001')
    
    cy.get('@TekniikanAlat_01_Chk_001').check()
    
    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_01')
    cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen \(\d*\)/i }).as('ArkkitehtuuriRakentaminen_02_Chk_01')
    cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka \(\d*\)/i }).as('MateriaaliProsessitekniikka_02_Chk_01')
    cy.findByRole('checkbox', { name: /Kone-, prosessi-, energia- ja sähkötekniikka \(\d*\)/i }).as('KoneProsessiEnergiaSahko_02_Chk_01')
    cy.get('@TekniikanAlat_01_Chk_01').should('have.attr', 'data-indeterminate', 'false');
    cy.get('@ArkkitehtuuriRakentaminen_02_Chk_01').should('be.checked');
    cy.get('@MateriaaliProsessitekniikka_02_Chk_01').should('be.checked');
    cy.get('@KoneProsessiEnergiaSahko_02_Chk_01').should('be.checked');
    
    cy.get('@MateriaaliProsessitekniikka_02_Chk_01').uncheck();

    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_02')
    cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen \(\d*\)/i }).as('ArkkitehtuuriRakentaminen_02_Chk_02')
    cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka \(\d*\)/i }).as('MateriaaliProsessitekniikka_02_Chk_02')
    cy.findByRole('checkbox', { name: /Kone-, prosessi-, energia- ja sähkötekniikka \(\d*\)/i }).as('KoneProsessiEnergiaSahko_02_Chk_02')
    cy.get('@TekniikanAlat_01_Chk_02').should('have.attr', 'data-indeterminate', 'true');
    cy.get('@ArkkitehtuuriRakentaminen_02_Chk_02').should('be.checked');
    cy.get('@MateriaaliProsessitekniikka_02_Chk_02').should('not.be.checked');
    cy.get('@KoneProsessiEnergiaSahko_02_Chk_02').should('be.checked');
    
    cy.get('@ArkkitehtuuriRakentaminen_02_Chk_02').check()
    
    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_03')
    cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen \(\d*\)/i }).as('ArkkitehtuuriRakentaminen_02_Chk_03')
    cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka \(\d*\)/i }).as('MateriaaliProsessitekniikka_02_Chk_03')
    cy.findByRole('checkbox', { name: /Kone-, prosessi-, energia- ja sähkötekniikka \(\d*\)/i }).as('KoneProsessiEnergiaSahko_02_Chk_03')
    cy.get('@TekniikanAlat_01_Chk_03').should('have.attr', 'data-indeterminate', 'true');
    cy.get('@ArkkitehtuuriRakentaminen_02_Chk_03').should('be.checked');
    cy.get('@MateriaaliProsessitekniikka_02_Chk_03').should('not.be.checked');
    cy.get('@KoneProsessiEnergiaSahko_02_Chk_03').should('be.checked');
  

  });
  it('Koulutusala checkboxes should work hierarchically part2', () => {
    cy.visit('/konfo/fi/haku/auto');
    cy.findByText('Koulutusalat').as('Koulutusalat')
    cy.get('@Koulutusalat').should('exist');
    cy.findByText('Tekniikan alat').as('TekniikanAlatTxt');
    cy.get('@TekniikanAlatTxt').click()
    cy.get('@TekniikanAlatTxt').should('not.be.visible')


    cy.findByRole('button', { name: /<< Kaikki koulutusalat/i }).as(
      'BackToLevel01'
    );
    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_001')
    
    cy.get('@TekniikanAlat_01_Chk_001').check()
    
    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_01')
    cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen \(\d*\)/i }).as('ArkkitehtuuriRakentaminen_02_Chk_01')
    cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka \(\d*\)/i }).as('MateriaaliProsessitekniikka_02_Chk_01')
    cy.findByRole('checkbox', { name: /Kone-, prosessi-, energia- ja sähkötekniikka \(\d*\)/i }).as('KoneProsessiEnergiaSahko_02_Chk_01')
    cy.get('@TekniikanAlat_01_Chk_01').should('have.attr', 'data-indeterminate', 'false');
    cy.get('@ArkkitehtuuriRakentaminen_02_Chk_01').should('be.checked');
    cy.get('@MateriaaliProsessitekniikka_02_Chk_01').should('be.checked');
    cy.get('@KoneProsessiEnergiaSahko_02_Chk_01').should('be.checked');
    
    cy.get('@MateriaaliProsessitekniikka_02_Chk_01').uncheck();

    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_02')
    cy.findByRole('checkbox', { name: /Arkkitehtuuri ja rakentaminen \(\d*\)/i }).as('ArkkitehtuuriRakentaminen_02_Chk_02')
    cy.findByRole('checkbox', { name: /Materiaali- ja prosessitekniikka \(\d*\)/i }).as('MateriaaliProsessitekniikka_02_Chk_02')
    cy.findByRole('checkbox', { name: /Kone-, prosessi-, energia- ja sähkötekniikka \(\d*\)/i }).as('KoneProsessiEnergiaSahko_02_Chk_02')
    cy.get('@TekniikanAlat_01_Chk_02').should('have.attr', 'data-indeterminate', 'true');
    cy.get('@ArkkitehtuuriRakentaminen_02_Chk_02').should('be.checked');
    cy.get('@MateriaaliProsessitekniikka_02_Chk_02').should('not.be.checked');
    cy.get('@KoneProsessiEnergiaSahko_02_Chk_02').should('be.checked');
    
    cy.get('@MateriaaliProsessitekniikka_02_Chk_02').check()

    cy.findByRole('checkbox', { name: /Tekniikan alat \(\d*\)/i }).as('TekniikanAlat_01_Chk_03')
    cy.get('@TekniikanAlat_01_Chk_03').should('have.attr', 'data-indeterminate', 'false');
    
  })
});
