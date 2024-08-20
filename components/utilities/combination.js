// Function validateCombo that takes in an array of cards which is the current players choice of cards, and matches it to the current cycles combination. 
export const dictionaryCombinations = {
  'single': {
    isValid: (cards) => cards.length === 1,
  },
  'pair': {
    isValid: (cards) => {
      const [{ number: cardNumber }] = cards;
      return cards.length === 2 && cards.every(({ number }) => number === cardNumber);
    },
  },
  'triplet': {
    isValid: (cards) => {
      const [{ number: cardNumber }] = cards;
      return cards.length === 3 && cards.every(({ number }) => number === cardNumber);
    }
  },
  'quartet': {
    isValid: (cards) => {
      const [{ number: cardNumber }] = cards;
      return cards.length === 4 && cards.every(({ number }) => number === cardNumber);    
    }
  },
  'sequence': {
    isValid: (cards) => {
      if (cards.length < 3) {
        return false;
      }

      const { uniqNumbers, containsDupe } = cards.reduce((acc, { number }) => {
        if (acc.uniqNumbers.includes(number)) {
          acc.containsDupe = true;
        } else {
          acc.uniqNumbers.push(number);
        }
        return acc;
      }, { uniqNumbers: [], containsDupe: false });
    
      if (containsDupe) {
        return false;
      } else {
        const sortedArray = uniqNumbers.sort((a, b) => {
          return a - b;
        });
    
        return sortedArray[sortedArray.length - 1] - sortedArray[0] + 1 === cards.length;
      }
    }
  },
  'double sequence': {
    isValid: (cards) => {
      if (cards.length < 6) {
        return false;
      }

      const mappedCards = cards.map((card) => card.number);
      const { uniqNumbers, failsDoubleIterations } = cards.reduce((acc, { number }) => {
        if (mappedCards.indexOf(number) === mappedCards.lastIndexOf(number)) {
          acc.failsDoubleIterations = true;
        } else {
          acc.uniqNumbers.push(number)
        }
        return acc;
      }, { uniqNumbers: [], failsDoubleIterations: false });

      if (failsDoubleIterations) {
        return false;
      } else {
        const sortedArray = uniqNumbers.sort((a, b) => {
          return a - b;
        });
    
        return (sortedArray[sortedArray.length - 1] - sortedArray[0] + 1) * 2 === cards.length;
      }
    }
  }
}

const validateCombo = (cards, combination) => dictionaryCombinations[combination].isValid(cards);
/* Console.log Tests */

console.log(' -- Testing One card for Single -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}], 'single'));

console.log(' -- Testing Two cards for Single -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}], 'single'));

console.log(' -- Testing Two card for Pair -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}], 'pair'));

console.log(' -- Testing Two non pair card for Pair -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}], 'pair'));

console.log(' -- Testing Three Card for Pair -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 9, suite: 'spades', value: 26}], 'pair'));

console.log(' -- Testing Two card for Triplet -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}], 'triplet'));

console.log(' -- Testing Three card for Triplet -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}, {number: 9, suite: 'spades', value: 26}], 'triplet'));

console.log(' -- Testing Three non triplet card for Triplet -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 9, suite: 'hearts', value: 26}], 'triplet'));

console.log(' -- Testing Two card for Quartet -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}], 'quartet'));

console.log(' -- Testing Four Card for Quartet -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}, {number: 9, suite: 'hearts', value: 26}, {number: 9, suite: 'spades', value: 26}], 'quartet'));

console.log(' -- Testing Four non quartet for Quartet -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}, {number: 4, suite: 'clubs', value: 26}, {number: 9, suite: 'clubs', value: 26}], 'quartet'));

console.log(' -- Testing NonSequence for Sequence -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 13, suite: 'clubs', value: 26}], 'sequence'));

console.log(' -- Testing Sequence for Sequence -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 6, suite: 'diamonds', value: 47}, {number: 7, suite: 'spades', value: 45}, {number: 8, suite: 'clubs', value: 26}], 'sequence'));

console.log(' -- Testing Two Sequence for Sequence -- ');
console.log(validateCombo([{number: '9', suite: 'clubs', value: 26}, {number: '8', suite: 'diamonds', value: 47}], 'sequence'));

console.log(' -- Testing Random cards for Double Sequence -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 13, suite: 'clubs', value: 26}, {number: 9, suite: 'spades', value: 26}], 'double sequence'));

console.log(' -- Testing 6 cards for Double Sequence -- ');
console.log(validateCombo([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'spades', value: 26}, {number: 7, suite: 'diamonds', value: 47}, {number: 7, suite: 'spades', value: 45}, {number: 8, suite: 'clubs', value: 26}, {number: 8, suite: 'hearts', value: 26}], 'double sequence'));

console.log(' -- Testing 4 cards for Double Sequence -- ');
console.log(validateCombo([{number: 3, suite: 'clubs', value: 26}, {number: 3, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 4, suite: 'clubs', value: 26}], 'double sequence'));

console.log(' -- Testing Sequence with 3 double cards for Double Sequence -- ');
console.log(validateCombo([{number: 3, suite: 'clubs', value: 26}, {number: 3, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 4, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 6, suite: 'spades', value: 45}, {number: 6, suite: 'clubs', value: 26}], 'double sequence'));

console.log(' -- Testing Sequence with 4 non sequence double cards for Double Sequence -- ');
console.log(validateCombo([{number: 3, suite: 'clubs', value: 26}, {number: 3, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 4, suite: 'clubs', value: 26}, {number: 8, suite: 'spades', value: 47}, {number: 8, suite: 'diamonds', value: 47}, {number: 6, suite: 'spades', value: 45}, {number: 6, suite: 'clubs', value: 26}], 'double sequence'));