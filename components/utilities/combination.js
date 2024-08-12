// Function that takes in a players turn of cards, and matches their intended combo to validate it is the correct combo.
// Example: player gives us 2 cards, we need to identify that it is a pair or not.

// Function validateCombo that takes in an array of cards which is the current players choice of cards, and matches it to the current cycles combination. 
const dictionary = {
  'single': {
    'length': 1,
    'sameNumber': true,
  },
  'pair': {
    'length': 2,
    'sameNumber': true,
  },
  'triplet': {
    'length': 3,
    'sameNumber': true,
  },
  'quartet': {
    'length': 4,
    'sameNumber': true,
  },
  'sequence': {
    'length': 3,
    'sameNumber': false,
  },
  'double sequence': {
    'sameNumber': true,
  }
}

// [{ suite: 'spades', number: '3'}]
const isSequence = (cards) => {
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

console.log(isStraight([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 13, suite: 'clubs', value: 26},]));

console.log(isStraight([{number: 9, suite: 'clubs', value: 26}, {number: 6, suite: 'diamonds', value: 47}, {number: 7, suite: 'spades', value: 45}, {number: 8, suite: 'clubs', value: 26},]));

console.log(isStraight([{number: '9', suite: 'clubs', value: 26}, {number: '5', suite: 'diamonds', value: 47}, {number: '4', suite: 'spades', value: 45}, {number: '5', suite: 'hearts', value: 47}]));
/*
const validateCombo = (cards, combination) => {
  if (combination === 'sequence' || combination === 'double sequence') {

  } else {
      if (dictionary[combination].length === cards.length) {
      
      }
  }
}
*/