const Game = () => {
  // Build Card Deck
  const suites = ['spades', 'clubs', 'diamonds', 'hearts'];
  const numbers = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
  let value = 1; // 3 of spades is the lowest card
  const deck = numbers.map((number, idx) => suites.map((suite, i) => ({ number, suite, value: value++ }))).flat();

  // Shuffle Deck >> Fisher-Yates Shuffle
  const shuffle = (array) => {
    const arrCopy = JSON.parse(JSON.stringify(array));
    // While there remain elements to shuffle...
    let currIdx = arrCopy.length;
    while (currIdx != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currIdx);
      currIdx--;
      // And swap it with the current element.
      [arrCopy[currIdx], arrCopy[randomIndex]] = [arrCopy[randomIndex], arrCopy[currIdx]];
    }
    return arrCopy;
  };
  const shuffled = shuffle(deck);

  // Deal Cards
  let playerTurn;
  const hands = [
    {player: 0, hand: []},
    {player: 1, hand: []},
    {player: 2, hand: []},
    {player: 3, hand: []},
  ];
  shuffled.forEach((card, idx) => {
    const player = idx % 4;
    hands[player].hand.push(card);
    if(card.number === '3' && card.suite === 'spades') {
      playerTurn = player;
    };
  });

  return (
    <game>
      <div style={{margin: '2em'}}>
        <p>Starting game.</p>
        <p>Shuffling deck...</p>
        <p>The deck has been shuffled and dealt. The first player to start is player {playerTurn + 1}</p>
      </div>

      <div style={{border: '1px solid black', margin: '6px', padding: '6px'}}>
        <h3>This is just temporary to visualize the hands</h3>
        {hands.map((hand, idx) => (
          <div key={idx} style={{margin: '15px'}}>
            <h4 style={{marginBottom: '6px'}}>Player {hand.player + 1}:</h4>
            <div style={{display: 'flex', 'flex-wrap': 'wrap'}}>
              {hand.hand.map((card, i) => (
                <div key={i} style={{border: '1px solid black', padding: '3px', marginRight: '4px', marginBottom: '4px'}}>{card.number} of {card.suite}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </game>
  )
};

export default Game;