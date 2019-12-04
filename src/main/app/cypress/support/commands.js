Cypress.Commands.add('etusivuSmokeTest', () => {
    cy.visit('http://localhost:3005/konfo');
    cy.wait(1000)
    cy.get('.makeStyles-title-270').contains('Jatkuvaa oppimista elämäsi jokaiseen vaiheeseen.')
    cy.wait(1000);
})

// Examples
// Cypress.Commands.add('login', () => {
//   cy.getSecrets().then((secrets) => {
//     cy.visit('/kirjaudu');
//     cy.get('input[name=username]').type(secrets.testUser.username);
//     cy.get('input[name=password]')
//       .type(secrets.testUser.password)
//       .type('{enter}');
//     // Wait for the welcome box to become visible
//     cy.get('div[data-cy=welcomebox]');
//   });
// });

// Cypress.Commands.add('logout', () => {
//   cy.get('[data-cy=main-menu-toggle]').click();
//   cy.get('[data-cy=main-menu-logout]').click();
// });
