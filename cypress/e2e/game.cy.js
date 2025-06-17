describe('Game Cycle', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.waitForReact();
  });

  it('Has Shuffle Button', () => {
    cy.get('button').contains('Shuffle Deck');
  });

  it('Has Game Component', () => {
    cy.react('Game').should('exist');
    cy.react('Game').getCurrentState();
  });

  it('Should Contain Hand Component after Shuffle Deck', () => {
    cy.react('Hand').should('not.exist');
    cy.get('button').contains('Shuffle Deck').click();

  })
});