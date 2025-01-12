describe('Game Cycle', () => {
  before(() => {
    cy.visit('http://localhost:3000');
    cy.waitForReact();

    cy.get('button').contains('Shuffle Deck').click();
    cy.get('button').contains('Shuffle Deck').click();
  });

  /*
  it('Pressing pass removes player from turn cycle', { defaultCommandTimeout: 8000 }, () => {
    cy.get('#span-player-turn').contains('Your Turn.');

    cy.get('button:last').click();

    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 2's turn.");
    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 3's turn.");
    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 4's turn.");
    cy.get('#span-player-turn', { timeout: 3000 }).contains("Player 2's turn.");
  });
  */

  it('Returns props', () => {
    const deck = [{"number":3,"suite":"clubs","value":2},{"number":9,"suite":"spades","value":25},{"number":11,"suite":"spades","value":33},{"number":3,"suite":"spades","value":1},{"number":3,"suite":"hearts","value":4},{"number":3,"suite":"diamonds","value":3},{"number":11,"suite":"clubs","value":34},{"number":15,"suite":"diamonds","value":51},{"number":5,"suite":"diamonds","value":11},{"number":11,"suite":"hearts","value":36},{"number":10,"suite":"clubs","value":30},{"number":6,"suite":"diamonds","value":15},{"number":6,"suite":"hearts","value":16},{"number":9,"suite":"diamonds","value":27},{"number":12,"suite":"diamonds","value":39},{"number":10,"suite":"spades","value":29},{"number":10,"suite":"hearts","value":32},{"number":14,"suite":"diamonds","value":47},{"number":15,"suite":"spades","value":49},{"number":8,"suite":"spades","value":21},{"number":8,"suite":"diamonds","value":23},{"number":9,"suite":"clubs","value":26},{"number":5,"suite":"hearts","value":12},{"number":7,"suite":"diamonds","value":19},{"number":4,"suite":"hearts","value":8},{"number":5,"suite":"spades","value":9},{"number":15,"suite":"hearts","value":52},{"number":4,"suite":"clubs","value":6},{"number":15,"suite":"clubs","value":50},{"number":4,"suite":"diamonds","value":7},{"number":13,"suite":"clubs","value":42},{"number":9,"suite":"hearts","value":28},{"number":7,"suite":"spades","value":17},{"number":13,"suite":"hearts","value":44},{"number":12,"suite":"spades","value":37},{"number":7,"suite":"clubs","value":18},{"number":6,"suite":"spades","value":13},{"number":13,"suite":"diamonds","value":43},{"number":12,"suite":"hearts","value":40},{"number":14,"suite":"hearts","value":48},{"number":13,"suite":"spades","value":41},{"number":10,"suite":"diamonds","value":31},{"number":11,"suite":"diamonds","value":35},{"number":14,"suite":"clubs","value":46},{"number":6,"suite":"clubs","value":14},{"number":4,"suite":"spades","value":5},{"number":5,"suite":"clubs","value":10},{"number":14,"suite":"spades","value":45},{"number":8,"suite":"clubs","value":22},{"number":7,"suite":"hearts","value":20},{"number":8,"suite":"hearts","value":24},{"number":12,"suite":"clubs","value":38}];
    cy.getReact('Game', { state: {
      shuffledDeck: deck,
      playerTurn: 0,
    }})
      .getCurrentState() 
      .then((data) => cy.log(JSON.stringify(data)));
      
    cy.getReact('Hand')
      .nthNode(0)
      .getCurrentState()
      .then((data) => cy.log(JSON.stringify(data)));
  });

});