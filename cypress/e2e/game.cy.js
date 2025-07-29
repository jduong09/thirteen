describe('Game Cycle', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.waitForReact();

    cy.get('[data-cy=btnShuffle]').contains('Shuffle Deck').click();
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
  });

  it.only('Playing lowest card causes AI to play single cards subsequently', () => {
    cy.get('[data-player-turn=0]').within(() => {
      cy.get('[data-cy=cards]').find('li').last().click();
    });
    cy.get('[data-cy=select-combinations]').select('Single');

    cy.get('#btn-finalizeTurn').click();
    cy.wait(2000);

    cy.get('[data-player-turn=1]').within(() => {
      cy.get('[data-cy=cards]').find('li').should('have.length', 12);
    });

    cy.get('[data-player-turn=2]').within(() => {
      cy.get('[data-cy=cards]').find('li').should('have.length', 12);
    });

    cy.get('[data-player-turn=3]').within(() => {
      cy.get('[data-cy=cards]').find('li').should('have.length', 12);
    });
  });
});