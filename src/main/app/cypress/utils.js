const findBreadcrumbItems = () => {
  return cy.findByRole('navigation', { name: 'Murupolku' }).find('li');
};

export const assertBreadcrumb = ({
  length,
  lastTextContains,
  lastHrefContains,
  hasHakutuloksetLink,
}) => {
  findBreadcrumbItems().should('have.length', length);

  findBreadcrumbItems()
    .last()
    .should('contain', lastTextContains)
    .findByRole('link')
    .should(($link) => {
      expect($link.attr('href')).to.include(lastHrefContains);
    });

  if (hasHakutuloksetLink) {
    findBreadcrumbItems()
      .eq(1)
      .should('contain', 'Hakutulokset')
      .findByRole('link')
      .should(($link) => {
        expect($link.attr('href')).to.include('/konfo/fi/haku');
      });
  }
};
