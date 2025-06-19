import React from 'react';
import Game from '../../components/game/game';
import Card from '../../components/cards/cards';
import Hand from '../../components/gameComponents/hand';

describe('<Game />', () => {
  beforeEach(() => { 
    cy.mount(<Game />);
    cy.get('[data-cy=btnShuffle]').contains('Shuffle Deck').click();
    cy.waitForReact();
  });

  it('Shuffle button deals 13 cards to all players', () => {
    cy.get('[data-cy=cards]').find('li').should('have.length', 52);
  });

  /*
  it('Player passing turn changes game turn to next player', () => {
    cy.get('#span-player-turn').should('have.text', 'Your Turn.');
    cy.get('#btn-passTurn').click();
    cy.get('#span-player-turn').should('not.have.text', 'Your Turn.');
  });
  */
});

describe('Game function validateCombo', () => {
  beforeEach(() => {
    cy.mount(<Game />);
    cy.get('[data-cy=btnShuffle]').click();
  });

  it.only('Get PlayerTurn State', () => {
    cy.waitForReact(1000, '#root');
    cy.getReact('Game').getCurrentState().should('have.property', 'playerTurn', 0);
  })

  it.only('Playing one card when combination type is single causes game to pass if middle deck is empty', () => {
    cy.get('[data-player-turn=0]').find('select').select('Strength of Card');
    cy.get('[data-cy=select-combinations]').select('Single');
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

  it('Playing more than one card when combination type is single causes game to invalidate choice', () => {
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