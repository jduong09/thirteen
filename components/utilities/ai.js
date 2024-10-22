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
}

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
}

const mergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

const mergeSortNoDupe = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return mergeUniqNoDupe(left, right);
}

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
}

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
}
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
}
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
}

/* AI logic to play a sequence */
const sequence = (hand) => {
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
              if (appendedSequence.length >= 3) {
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
            if (appendedSequence.length >= 3) {
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
}

/* AI logic to play double sequence */
const doubleSequence = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const sortedHand = mergeSortNoDupe(hand);
  const totalSequences = [];

  for (let i = 0; i < sortedHand.length; i++) {
    let startingNumber = sortedHand[i].number;
    let sequences = [];

    // if starting iteration does not containn two of its number, continue to next iteration.
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
                
                if (newSequence.length >= 6) {
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
            if (newSequence.length >= 6) {
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
}

export const aiMoves = (combinationType, hand) => {
  if (combinationType === 'single') {
    return hand;
  } else if (combinationType === 'pair') {
    return pair(hand);
  } else if (combinationType === 'triplet') {
    return triplet(hand);
  } else if (combinationType === 'quartet') {
    return quartet(hand);
  } else if (combinationType === 'sequence') {
    return sequence(hand);
  } else if (combinationType === 'double sequence') {
    return doubleSequence(hand);
  }
}
//const hand = [ { number: 11, suite: 'hearts', value: 36, selected: false }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false, copy: 1 }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false, copy: 1 }, { number: 13, suite: 'hearts', value: 44, selected: false }, { number: 15, suite: 'diamonds', value: 51, selected: false, copy: 2 }, { number: 12, suite: 'diamonds', value: 39, selected: false, copy: 2 } ];
//const hand = [ { number: 12, suite: 'hearts', value: 36, selected: false, copy: 3 }, { number: 12, suite: 'hearts', value: 36, selected: false, copy: 4 }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false, copy: 1 }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false, copy: 1 }, { number: 13, suite: 'hearts', value: 44, selected: false }, { number: 15, suite: 'diamonds', value: 51, selected: false, copy: 2 }, { number: 12, suite: 'diamonds', value: 39, selected: false, copy: 2 } ];
//const hand = [ { number: 11, suite: 'hearts', value: 36, selected: false }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false }, { number: 13, suite: 'hearts', value: 44, selected: false }];
const hand = [{ number: 6, suite: 'hearts', value: 16, selected: false }, { number: 14, suite: 'clubs', value: 46, selected: false, copy: 1 }, { number: 14, suite: 'diamonds', value: 47, selected: false, copy: 2 }, { number: 12, suite: 'hearts', value: 40, selected: false, copy: 1 }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false, copy: 1 }, { number: 13, suite: 'hearts', value: 44, selected: false, copy: 2 }, { number: 13, suite: 'diamonds', value: 43, selected: false, copy: 1 }, { number: 15, suite: 'diamonds', value: 51, selected: false, copy: 2 }, { number: 12, suite: 'diamonds', value: 39, selected: false, copy: 2 }, { number: 12, suite: 'spades', value: 37, selected: false, copy: 3 }];