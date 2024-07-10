// suit (string)
// rank (string)
export const makeCard = (suit, rank) => {
  return {
    suit,
    rank
  }
}


/* For Testing Hand Component */
const hand = ['A♥', '4♥', 'K♥', '5♥', '3♠', 'Q♠', '8♠', '4♦', 'J♦', '10♦', '3♦', 'K♦', '5♦'];

export const convertedHand = hand.map((str) => {
  const suit = str.slice(-1);
  const rank = str.slice(0, -1);
  return makeCard(suit, rank);
});