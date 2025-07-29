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
};

/**
 * @description Returns card object with highest value from array of card objects
 * @param {object[]} combo - Array of card objects 
 */
export const highestValue = (combo) => {
  const result = combo.reduce((acc, cardObj) => {
    if (cardObj.value > acc.value) {
      return cardObj;
    } else {
      return acc;
    }
  });
  return result;
};

export const determineCombination = (hand) => {
  console.log(hand);
  if (hand.length === 13 || hand.length === 11 || hand.length === 9 || hand.length === 7 || hand.length === 5) {
    if (dictionaryCombinations['sequence'].isValid(hand)) {
      return 'sequence';
    } else {
      false;
    }
  } else if (hand.length === 12 || hand.length === 10 || hand.length === 8 || hand.length === 6) {
    if (dictionaryCombinations['sequence'].isValid(hand)) {
      return 'sequence';
    } else if (dictionaryCombinations['double sequence'].isValid(hand)) {
      return 'double sequence';
    } else {
      return false;
    }
  } else if (hand.length === 4) {
    if (dictionaryCombinations['sequence'].isValid(hand)) {
      return 'sequence';
    } else if (dictionaryCombinations['quartet'].isValid(hand)) {
      return 'quartet';
    } else {
      return false;
    }
  } else if (hand.length === 3) {
    if (dictionaryCombinations['sequence'].isValid(hand)) {
      return 'sequence';
    } else if (dictionaryCombinations['triplet'].isValid(hand)) {
      return 'triplet';
    } else {
      return false;
    }
  } else if (hand.length === 2) {
    if (dictionaryCombinations['pair'].isValid(hand)) {
      return 'pair'
    } else {
      return false;
    }
  } else {
    return 'single';
  }
}

