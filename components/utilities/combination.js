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