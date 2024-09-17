describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it ('displays shuffle button by default', () => {
    cy.get('button').contains('Shuffle Deck');
  });

  it ('shuffles deck', () => {
    cy.get('button').contains('Shuffle Deck').click();

    cy.get('ul', { timeout: 100000 }).should('have.length', 13);
  });
});