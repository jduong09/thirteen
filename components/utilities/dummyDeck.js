import { makeCard } from './card.js';

const suits = ['♥', '♦', '♠', '♣'];

const deckOf52 = [];

for (let i = 0; i < suits.length; i++) {
  const suit = suits[i];
  for (let k = 1; k <= 13; k++) {
    // k === 1, Ace
    if (k === 1) {
      deckOf52.push(makeCard(suit, 'A'));
    } else if (k === 11) {
      // Jack
      deckOf52.push(makeCard(suit, 'J'));
    } else if (k === 12) {
      // Queen
      deckOf52.push(makeCard(suit, 'Q'));
    } else if (k === 13) {
      // King
      deckOf52.push(makeCard(suit, 'K'));
    } else {
      // K is rank (2, 3, 4, 5, 6, 7, 8, 9, 10)
      deckOf52.push(makeCard(suit, k));
    }
  }
}
console.log(deckOf52);
console.log(`Number of cards in deck: ${deckOf52.length}`);
console.log(`First card is: ${deckOf52[0].rank} of ${deckOf52[0].suit}s`);
console.log(`Nineteenth card is: ${deckOf52[19].rank} of ${deckOf52[19].suit}s`);