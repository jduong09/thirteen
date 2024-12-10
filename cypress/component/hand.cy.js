import React from 'react';
import Game from '../../components/game/game';
import Hand from '../../components/gameComponents/hand';

describe('<Hand />', () => {
  beforeEach(() => {
    const onRequestSpy = cy.spy().as('onRequestSpy');
    const onPassSpy = cy.spy().as('onPassSpy');
    const hand = [{number: 10, suite: 'spades', value: 29}, {number: 10, suite: 'clubs', value: 30}, {number: 6, suite: 'spades', value: 13}, {number: 8, suite: 'hearts', value: 24}, {number: 9, suite: 'hearts', value: 28}, {number: 3, suite: 'hearts', value: 4}, {number: 12, suite: 'diamonds', value: 39}, {number: 6, suite: 'hearts', value: 16}, {number: 7, suite: 'hearts', value: 20}, {number: 11, suite: 'diamonds', value: 35}, {number: 14, suite: 'diamonds', value: 47}, {number: 6, suite: 'clubs', value: 14}, {number: 13, suite: 'hearts', value: 44}];
    cy.mount(<Hand cards={hand} playerTurn={0} comboIsValid={false} requestCombo={onRequestSpy} currentTurnCombo={'single'} passTurn={onPassSpy} />)
    
  });

  it ('Finalizing turn fires a change event', () => {
    cy.get('[data-cy=cards]').find('li').first().click();
    cy.get('#btn-finalizeTurn').click();
    cy.get('@onRequestSpy').should('have.been.called');
  });

  it('Passing turn fires change event', () => {
    cy.get('#btn-passTurn').click();
    cy.get('@onPassSpy').should('have.been.called');
  });
});