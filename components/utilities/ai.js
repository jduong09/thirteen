const merge = (left, right) => {
  let sortedArr = [];

  while (left.length && right.length) {
    if (left[0].value < right[0].value) {
      sortedArr.push(left.shift());
    } else {
      sortedArr.push(right.shift());
    }
  }

  return [...sortedArr, ...left, ...right];
};

const mergeUniqNoDupe = (left, right) => {
  let sortedArr = [];

  while (left.length && right.length) {
    if (left[0].value < right[0].value) {
      sortedArr.length && left[0].number === sortedArr[sortedArr.length - 1].number ? left.shift() : sortedArr.push(left.shift());
    } else {
      sortedArr.length && right[0].number === sortedArr[sortedArr.length - 1].number ? right.shift() : sortedArr.push(right.shift());
    }
  }

  while (left.length) {
    left[0].number === sortedArr[sortedArr.length - 1].number ? left.shift() : sortedArr.push(left.shift());
  }

  while (right.length) {
    right[0].number === sortedArr[sortedArr.length - 1].number ? right.shift() : sortedArr.push(right.shift())
  }

  return [...sortedArr];
};

const mergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
};

const mergeSortNoDupe = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return mergeUniqNoDupe(left, right);
};

const createDuplicatesObject = (array) => {
  const values = {};

  for (let i = 0; i < array.length; i++) {
    const number = array[i].number;
    if (!values[number]) {
      values[number] = [array[i]];
    } else {
      values[number].push(array[i]);
    }
  }
  return values;
};

/* AI logic to play a double */
const pair = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const combinations = [];

  for (const value in dupesObject) {
    if (dupesObject[value].length === 2) {
      combinations.push(dupesObject[value]);
    } else if (dupesObject[value].length > 2) {
      for (let i = 0; i < dupesObject[value].length; i++) {
        for (let j = i + 1; j < dupesObject[value].length; j++) {
          combinations.push([dupesObject[value][i], dupesObject[value][j]]);
        }
      }
    }
  }
  return combinations;
};

/* AI logic to play a triple */
const triplet = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const combinations = [];

  for (const value in dupesObject) {
    if (dupesObject[value].length === 3) {
      combinations.push(dupesObject[value]);
    } else if (dupesObject[value].length === 4) {
      for (let i = 0; i < dupesObject[value].length; i++) {
        for (let j = i + 1; j < dupesObject[value].length; j++) {
          if (dupesObject[value][j + 1]) {
            combinations.push([dupesObject[value][i], dupesObject[value][j], dupesObject[value][j + 1]]);
          }

          if (dupesObject[value][j + 2]) {
            combinations.push([dupesObject[value][i], dupesObject[value][j], dupesObject[value][j + 2]]);
          }
        }
      }
    }
  }
  return combinations;
};

/* AI logic to play a quartet */
const quartet = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const combinations = [];

  for (const value in dupesObject) {
    if (dupesObject[value].length === 4) {
      combinations.push(dupesObject[value]);
    }
  }
  return combinations;
};

/* AI logic to play a sequence */
const sequence = (hand, validLength) => {
  const dupesObject = createDuplicatesObject(hand);
  const sortedHand = mergeSort(hand);
  const totalSequences = [];

  for (let i = 0; i < sortedHand.length; i++) {
    let startingNumber = sortedHand[i].number;
    
    let sequences = [[sortedHand[i]]];

    for (let j = i + 1; j < sortedHand.length; j++) {
      const currentNumber = startingNumber + 1;
      if (!dupesObject[currentNumber]) {
        break;
      }

      // current iteration in sorted hand fits the condition of creating a positive sequence
      if (currentNumber - startingNumber === 1) {
        if (dupesObject[currentNumber].length > 1) {
          // Current iteration in sorted hands fits the condition of creating a positive sequence, and there are multiple numerical copies of it in the hand
          const newSequences = [];
          dupesObject[currentNumber].forEach((card) => {
            sequences.forEach((sequence) => {
              const appendedSequence = [...sequence, card];
              // When card is appended to previous sequence, if it fits the condition of 3 or more cards, add it to our final total sequences array.
              if (appendedSequence.length === validLength) {
                totalSequences.push(appendedSequence);
              }
              newSequences.push(appendedSequence);
            });
          });
          // set variable sequences to be the newSequences that have appended cards
          sequences = newSequences;
        } else {
          // Current iteration in sorted hands fits the condition of creating a positive sequence, and there is only 1 copy of it in the hand
          const newSequences = [];
          sequences.forEach((sequence) => {
            const appendedSequence = [...sequence, dupesObject[currentNumber][0]];
            if (appendedSequence.length == validLength) {
              totalSequences.push(appendedSequence);
            }
            newSequences.push(appendedSequence);
            sequences = newSequences;
          });
        }
      }
      startingNumber++;
    }
  }
  return totalSequences;
};

/* AI logic to play double sequence */
const doubleSequence = (hand, validLength) => {
  const dupesObject = createDuplicatesObject(hand);
  const sortedHand = mergeSortNoDupe(hand);
  const totalSequences = [];

  for (let i = 0; i < sortedHand.length; i++) {
    let startingNumber = sortedHand[i].number;
    let sequences = [];

    // if starting iteration does not contain two of its number, continue to next iteration.
    if (dupesObject[startingNumber].length < 2) {
      continue;
    }

    // if starting iteration has more than two of its number. 
    if (dupesObject[startingNumber].length > 2) {
      for (let a = 0; a < dupesObject[startingNumber].length; a++) {
        for (let b = a + 1; b < dupesObject[startingNumber].length; b++) {
          sequences.push([dupesObject[startingNumber][a], dupesObject[startingNumber][b]]);
        }
      }
    } else {
      sequences = [[dupesObject[startingNumber][0], dupesObject[startingNumber][1]]];
    }

    for (let j = i + 1; j < sortedHand.length; j++) {
      const currentNumber = startingNumber + 1;
      if (!dupesObject[currentNumber]) {
        break;
      }

      if (currentNumber - startingNumber === 1) {
        if (dupesObject[currentNumber].length < 2) {
          break;
        }

        // Current iteration in sorted hands has more than 2 cards of its number, so we need to create multiple sequences of it.
        if (dupesObject[currentNumber].length > 2) {
          const newSequences = [];
          sequences.forEach((sequence) => {
            for (let a = 0; a < dupesObject[currentNumber].length; a++) {
              for (let b = a + 1; b < dupesObject[currentNumber].length; b++) {
                const newSequence = [...sequence, dupesObject[currentNumber][a], dupesObject[currentNumber][b]];
                
                if (newSequence.length === validLength) {
                  totalSequences.push(newSequence);
                }
                newSequences.push(newSequence);
              }
            }
          });
          sequences = newSequences;
        } else {
          // Current iteration in sorted hands has 2 cards of its number, so just append the two cards
          const newSequences = [];
          sequences.forEach((sequence) => {
            const newSequence = [...sequence, dupesObject[currentNumber][0], dupesObject[currentNumber][1]];
            if (newSequence.length ===validLength) {
              totalSequences.push(newSequence);
            }
            newSequences.push(newSequence);
          });
          sequences = newSequences;
        }
      }
      startingNumber++;
    }
  }
  return totalSequences;
};

export const aiMoves = (combinationType, hand, validLength) => {
  if (combinationType === 'single') {
    return hand.map((card) => { return [card]});
  } else if (combinationType === 'pair') {
    return pair(hand);
  } else if (combinationType === 'triplet') {
    return triplet(hand);
  } else if (combinationType === 'quartet') {
    return quartet(hand);
  } else if (combinationType === 'sequence') {
    return sequence(hand, validLength);
  } else if (combinationType === 'double sequence') {
    return doubleSequence(hand, validLength);
  }
};

// Build Object of available plays categorized by combination type.
// Get probabilities of hardest to play
// Play highest value.
// sequence of 13 cards
// sequence of 12 cards
// sequence of 11 cards
// sequence of 10 cards
// sequence of 9 cards
// sequence of 8 cards
// sequence of 7 cards
// sequence of 6 cards
// sequence of 5 cards
// sequence of 4 cards
// sequence of 3 cards
// double sequence of 12 cards
// double sequence of 10 cards
// double sequence of 8 cards
// double sequence of 6 cards
// quartet
// triplet
// pair

const findDoubleSequences = (hand) => {
  const args = [6, 8, 10, 12];
  const res = [];
  for (let i = 0; i < args.length; i++) {
    if (doubleSequence(hand, args[i]).length) {
      res.push(doubleSequence(hand, args[i]));
    }
  }
  return res.flat();
}

const findSequences = (hand) => {
  const res = [];
  for (let i = 3; i < 14; i++) {
    if (sequence(hand, i).length) {
      res.push(sequence(hand, i));
    }
  }
  return res.flat();
}

const aiPossibleCombinations =  (hand) => {
  const possibleCombinations = {};
  possibleCombinations['DS'] = findDoubleSequences(hand);
  possibleCombinations['S'] = findSequences(hand);
  possibleCombinations['Q'] = quartet(hand);
  possibleCombinations['T'] = triplet(hand);
  possibleCombinations['P'] = pair(hand);
  return possibleCombinations;
};
 
const hand = [{number: 12, suite: 'clubs', value: 38, selected: false},  {number: 12, suite: 'diamonds', value: 39, selected: false}, {number: 15, suite: 'hearts', value: 52, selected: false}, {number: 3, suite: 'hearts', value: 4, selected: false}, {number: 5, suite: 'diamonds', value: 11, selected: false}, {number: 5, suite: 'hearts', value: 12, selected: false},  {number: 7, suite: 'clubs', value: 18, selected: false}, {number: 4, suite: 'hearts', value: 8, selected: false}, {number: 8, suite: 'spades', value: 21, selected: false}, {number: 3, suite: 'clubs', value: 2, selected: false}, {number: 4, suite: 'diamonds', value: 7, selected: false}, {number: 4, suite: 'clubs', value: 6, selected: false}, {number: 9, suite: 'spades', value: 25, selected: false}];
aiPossibleCombinations(hand);


// double sequence (6 cards)
// 6 Sequence and above
// quartet
// three of a kind
// 5 sequeence straight
// 4 sequence straight
// pair
// 3 sequence straight
// high card
const determineHardestMove = (possibleCombinations) => {
  if (possibleCombinations['DS'].length) {
    // Either combination that has lowest value for highest card
    const hardest = possibleCombinations['DS'].reduce((combination, curr) => {
      if (curr[curr.length-1].value < combination[combination.length - 1].value) {
        return curr;
      } else if (curr[curr.length - 1].value === combination[combination.length - 1].value) {
        const totalValueCurr = curr.reduce((value, curr) => {
          return value + curr.value;
        }, 0);

        const totalValueComb = combination.reduce((value, curr) => {
          return value + curr.value;
        }, 0);

        return totalValueCurr < totalValueComb ? curr : combination;
      }
    }, possibleCombinations['DS'][0]);
    // or if there is more one combination that share lowest value for highest card, then we need lowest combination value.
  } else if (possibleCombinations['S'].length && possibleCombinations['S'].filter((arr) => arr.length >= 6).length) {
    console.log(possibleCombinations['S'].filter((arr) => arr.length >= 6).length)
  } else if (possibleCombinations['Q'].length) {
    console.log(possibleCombinations['Q']);
  } else if (possibleCombinations['T'].length) {
    console.log(possibleCombinations['T']);
  } else if (possibleCombinations['S'].length && possibleCombinations['S'].filter((arr) => arr.length === 5).length) {
    console.log(possibleCombinations['S'].filter((arr) => arr.length >= 5).length)    
  } else if (possibleCombinations['S'].length && possibleCombinations['S'].filter((arr) => arr.length === 4).length) {
    console.log(possibleCombinations['S'].filter((arr) => arr.length >= 4).length)
  } else if (possibleCombinations['P'].length) {
    console.log('P');
  } else if (possibleCombinations['S'].length && possibleCombinations['S'].filter((arr) => arr.length === 3).length) {
    console.log(possibleCombinations['S'].filter((arr) => arr.length >= 3).length)
  } else {
    console.log('hi');
  }
}

const combs = aiPossibleCombinations(hand);
determineHardestMove(combs);