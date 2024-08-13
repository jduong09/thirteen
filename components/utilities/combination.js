// Function that takes in a players turn of cards, and matches their intended combo to validate it is the correct combo.
// Example: player gives us 2 cards, we need to identify that it is a pair or not.

const isSingle = (cards) => cards.length === 1;

const isPair = (cards) => {
  if (cards.length !== 2) {
    return false;
  }

  return cards[0].number === cards[1].number;
}

const isTriplet = (cards) => {
  if (cards.length !== 3) {
    return false;
  }

  return cards[0].number === cards[1].number && cards[0].number === cards[2].number;
}

const isQuartet = (cards) => {
  if (cards.length !== 4) {
    return false;
  }

  return cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number;
}

console.log(' -- Testing One card for Single -- ');
console.log(isSingle([{number: 9, suite: 'clubs', value: 26}]));
console.log(' -- Testing Two cards for Single -- ');
console.log(isSingle([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}]));
console.log(' -- Testing Two card for Pair -- ');
console.log(isPair([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}]));
console.log(' -- Testing Two non pair card for Pair -- ');
console.log(isPair([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}]));
console.log(' -- Testing Three Card for Pair -- ');
console.log(isPair([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 9, suite: 'spades', value: 26},]));
console.log(' -- Testing Two card for Triplet -- ');
console.log(isTriplet([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}]));
console.log(' -- Testing Three card for Triplet -- ');
console.log(isTriplet([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}, {number: 9, suite: 'spades', value: 26}]));
console.log(' -- Testing Three non triplet card for Triplet -- ');
console.log(isSingle([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 9, suite: 'hearts', value: 26}]));
console.log(' -- Testing Two card for Quartet -- ');
console.log(isQuartet([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}]));
console.log(' -- Testing Four Card for Quartet -- ');
console.log(isQuartet([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}, {number: 9, suite: 'hearts', value: 26}, {number: 9, suite: 'spades', value: 26}]));
console.log(' -- Testing Four non quartet for Quartet -- ');
console.log(isQuartet([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'diamonds', value: 47}, {number: 4, suite: 'clubs', value: 26}, {number: 9, suite: 'clubs', value: 26}]));

const isSequence = (cards) => {

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

/*
console.log(isStraight([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 13, suite: 'clubs', value: 26},]));

console.log(isStraight([{number: 9, suite: 'clubs', value: 26}, {number: 6, suite: 'diamonds', value: 47}, {number: 7, suite: 'spades', value: 45}, {number: 8, suite: 'clubs', value: 26},]));

console.log(isStraight([{number: '9', suite: 'clubs', value: 26}, {number: '5', suite: 'diamonds', value: 47}, {number: '4', suite: 'spades', value: 45}, {number: '5', suite: 'hearts', value: 47}]));
*/

const isDoubleSequence = (cards) => {
  // double sequence fills two importants conditions
  // 1: sequence of 3 or more numbers
  // 2: each number in the sequence has two iterations of itself

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

/*
console.log(isDoubleSequence([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 13, suite: 'clubs', value: 26}, {number: 9, suite: 'spades', value: 26}]));

console.log(isDoubleSequence([{number: 9, suite: 'clubs', value: 26}, {number: 9, suite: 'spades', value: 26}, {number: 7, suite: 'diamonds', value: 47}, {number: 7, suite: 'spades', value: 45}, {number: 8, suite: 'clubs', value: 26}, {number: 8, suite: 'hearts', value: 26}]));

console.log(isDoubleSequence([{number: 9, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 13, suite: 'clubs', value: 26},]));

console.log(isDoubleSequence([{number: 3, suite: 'clubs', value: 26}, {number: 3, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 4, suite: 'clubs', value: 26},]));

console.log(isDoubleSequence([{number: 3, suite: 'clubs', value: 26}, {number: 3, suite: 'diamonds', value: 47}, {number: 4, suite: 'spades', value: 45}, {number: 4, suite: 'clubs', value: 26}, {number: 5, suite: 'clubs', value: 26}, {number: 5, suite: 'diamonds', value: 47}, {number: 6, suite: 'spades', value: 45}, {number: 6, suite: 'clubs', value: 26}]));
*/
/*
const validateCombo = (cards, combination) => {
  if (combination === 'sequence' || combination === 'double sequence') {

  } else {
      if (dictionary[combination].length === cards.length) {
      
      }
  }
}
*/

// Function validateCombo that takes in an array of cards which is the current players choice of cards, and matches it to the current cycles combination. 
const dictionary = {
  'single': {
    isValid: (cards) => cards.length === 1,
  },
  'pair': {
    isValid: (cards) => {
      if (cards.length !== 2) {
        return false;
      }
    
      return cards[0].number === cards[1].number;
    },
  },
  'triplet': {
    isValid: (cards) => {
      if (cards.length !== 3) {
        return false;
      }
    
      return cards[0].number === cards[1].number && cards[0].number === cards[2].number;
    }
  },
  'quartet': {
    isValid: (cards) => {
      if (cards.length !== 4) {
        return false;
      }
    
      return cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number;
    }
  },
  'sequence': {
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