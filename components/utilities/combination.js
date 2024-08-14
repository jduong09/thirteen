// Function validateCombo that takes in an array of cards which is the current players choice of cards, and matches it to the current cycles combination. 
export const dictionaryCombinations = {
  'single': {
    // Can't be more than 1 card.
    isValid: (cards) => cards.length === 1,
  },
  'pair': {
    // Comprised of two cards, cards have the same number.
    isValid: (cards) => {
      if (cards.length !== 2) {
        return false;
      }
    
      return cards[0].number === cards[1].number;
    },
  },
  'triplet': {
    // Comprised of three cards, cards have the same number.
    isValid: (cards) => {
      if (cards.length !== 3) {
        return false;
      }
    
      return cards[0].number === cards[1].number && cards[0].number === cards[2].number;
    }
  },
  'quartet': {
    // Comprised of four cards, cards have the same number.
    isValid: (cards) => {
      if (cards.length !== 4) {
        return false;
      }
    
      return cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number;
    }
  },
  'sequence': {
    // Two important conditions
    // 1: length of 3 or more numbers
    // 2: cards in order.
    isValid: (cards) => {

      if (cards.length < 3) {
        return false;
      }
    
      let containsDupe = false;
      const uniqNumbers = {};
      for (let i = 0; i < cards.length; i++) {
        if (uniqNumbers[cards[i].number] === undefined) {
          uniqNumbers[cards[i].number] = true;
        } else {
          containsDupe = true;
        }
      }
    
      if (containsDupe) {
        return false;
      } else {
        const arrayUniq = [];
        for (const key in uniqNumbers) {
          arrayUniq.push(Number(key));
        }
    
        const sortedArray = arrayUniq.sort((a, b) => {
          return a - b;
        });
    
        return sortedArray[sortedArray.length - 1] - sortedArray[0] + 1 === cards.length;
      }
    }
  },
  'double sequence': {
    isValid: (cards) => {
      // double sequence fills two importants conditions
      // 1: sequence of 3 or more numbers
      // 2: each number in the sequence has two iterations of itself
      // 3: cards in order
    
      if (cards.length < 6) {
        return false;
      }
    
      let failsDoubleIterations = false;
    
      const obj = {};
    
      for (let i = 0; i < cards.length; i++) {
        if (obj[cards[i].number] === undefined) {
          obj[cards[i].number] = 1;
        } else {
          obj[cards[i].number]++;
        }
      }
    
      const array = [];
      for (const key in obj) {
        if (obj[key] === 2) {
          array.push(key);
        } else {
          failsDoubleIterations = true;
        }
      }
    
      if (failsDoubleIterations) {
        return false;
      } else {
        const sortedArray = array.sort((a, b) => {
          return a - b;
        });
    
        return (sortedArray[sortedArray.length - 1] - sortedArray[0] + 1) * 2 === cards.length;
      }
    }
  }
}

/* Console.log Tests */
const validateCombo = (cards, combination) => dictionaryCombinations[combination].isValid(cards);

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