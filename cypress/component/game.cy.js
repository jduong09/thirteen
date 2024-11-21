import React from 'react'
import Game from '../../components/game/game'

describe('<Game />', () => {
  beforeEach(() => { 
    cy.mount(<Game />);
    cy.get('button').contains('Shuffle Deck').click();
  });

  it ('Shuffle button deals 13 cards to all players', () => {
    cy.get('[data-cy=cards]').find('li').should('have.length', 52);
  });

  it('Player passing turn changes game turn to next player', () => {
    cy.get('#span-player-turn').should('have.text', 'Your turn.');
    cy.get('#btn-passTurn').click();
    cy.get('#span-player-turn').should('not.have.text', 'Your turn.');
  });

  it('Playing lowest card causes AI to play single cards subsequently', () => {
    cy.get('[data-player-turn=0]').find('select').select('Strength of Card');
    cy.get('[data-player-turn=0]').within(() => {
      cy.get('[data-cy=cards]').find('li').last().click();
    });
    cy.get('#btn-finalizeTurn').click();

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

describe('Game function validateCombo', () => {
  beforeEach(() => {
    cy.mount(<Game />);
    cy.get('button').contains('Shuffle Deck').click();
  });

  it('Playing one card when combination type is single causes game to pass if middle deck is empty', () => {
    cy.get('[data-player-turn=0]').find('select').select('Strength of Card');
    cy.get('[data-player-turn=0]').within(() => {
      cy.get('[data-cy=cards]').find('li').last().click();
    });
    cy.get('#btn-finalizeTurn').click();

    cy.get('[data-player-turn=0]').within(() => {
      cy.get('[data-cy=cards]').find('li').should('have.length', 12);
    });

    cy.get('[data-cy=div-invalid]').should('not.exist');
    cy.get('#span-player-turn').should('not.have.text', 'Your turn.');
  });

  it ('Playing more than one card when combination type is single causes game to invalidate choice', () => {
    cy.get('[data-player-turn=0]').find('select').select('Strength of Card');
    cy.get('[data-player-turn=0]').within(() => {
      cy.get('[data-cy=cards]').find('li').first().click();
      cy.get('[data-cy=cards]').find('li').last().click();
    });
    cy.get('#btn-finalizeTurn').click();
    
    cy.get('[data-cy=div-invalid]').should('be.visible');

    cy.get('[data-player-turn=0]').within(() => {
      cy.get('[data-cy=cards]').find('li').should('have.length', 13);
    });;

    cy.get('#span-player-turn').should('have.text', 'Your turn.');
  });
});