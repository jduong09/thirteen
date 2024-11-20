import React from 'react'
import Game from '../../components/game/game'

describe('<Game />', () => {
  beforeEach(() => {
    /*
    const hands = [
      { hand: [{number: 10, suite: 'spades', value: 29}, {number: 10, suite: 'clubs', value: 30}, {number: 6, suite: 'spades', value: 13}, {number: 8, suite: 'hearts', value: 24}, {number: 9, suite: 'hearts', value: 28}, {number: 3, suite: 'hearts', value: 4}, {number: 12, suite: 'diamonds', value: 39}, {number: 6, suite: 'hearts', value: 16}, {number: 7, suite: 'hearts', value: 20}, {number: 11, suite: 'diamonds', value: 35}, {number: 14, suite: 'diamonds', value: 47}, {number: 6, suite: 'clubs', value: 14}, {number: 13, suite: 'hearts', value: 44}], player: 0, skipped: false},
      { hand: [{number: 15, suite: 'spades', value: 49}, {number: 3, suite: 'diamonds', value: 3}, {number: 7, suite: 'clubs', value: 18}, {number: 5, suite: 'hearts', value: 12}, {number: 11, suite: 'hearts', value: 36}, {number: 4, suite: 'spades', value: 5}, {number: 5, suite: 'diamonds', value: 11}, {number: 9, suite: 'diamonds', value: 27}, {number: 7, suite: 'diamonds', value: 19}, {number: 13, suite: 'diamonds', value: 43}, {number: 15, suite: 'hearts', value: 52}, {number: 3, suite: 'clubs', value: 2}, {number: 6, suite: 'diamonds', value: 15}], player: 1, skipped: false},
      { hand: [{number: 12, suite: 'hearts', value: 40}, {number: 12, suite: 'spades', value: 37}, {number: 8, suite: 'diamonds', value: 23}, {number: 4, suite: 'hearts', value: 8}, {number: 8, suite: 'clubs', value: 22}, {number: 14, suite: 'clubs', value: 46}, {number: 14, suite: 'spades', value: 45}, {number: 12, suite: 'clubs', value: 38}, {number: 5, suite: 'clubs', value: 10}, {number: 14, suite: 'hearts', value: 48}, {number: 13, suite: 'spades', value: 41}, {number: 7, suite: 'spades', value: 17}, {number: 9, suite: 'clubs', value: 26}], player: 2, skipped: false },
      { hand: [{number: 15, suite: 'clubs', value: 50}, {number: 4, suite: 'diamonds', value: 7}, {number: 3, suite: 'spades', value: 1}, {number: 5, suite: 'spades', value: 9}, {number: 11, suite: 'spades', value: 33}, {number: 8, suite: 'spades', value: 21}, {number: 15, suite: 'diamonds', value: 51}, {number: 9, suite: 'spades', value: 25}, {number: 10, suite: 'diamonds', value: 31}, {number: 4, suite: 'clubs', value: 6}, {number: 13, suite: 'clubs', value: 42}, {number: 11, suite: 'clubs', value: 34}, {number: 10, suite: 'hearts', value: 32}], player: 3, skipped: false }
    ];
    */
    
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