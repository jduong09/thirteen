describe('Game Cycle', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Shuffle Deck').click();
    cy.get('button').contains('Shuffle Deck').click();
  });

  it('Pressing pass removes player from turn cycle', { defaultCommandTimeout: 8000 }, () => {
    cy.get('#span-player-turn').contains('Your Turn.');

    cy.get('button:last').click();

    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 2's turn.");
    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 3's turn.");
    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 4's turn.");
    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 2's turn.");
  });
});