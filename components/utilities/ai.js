/* AI logic to play a double */
// Need to handle logic if there are 3/4 of a kind
// This leads to different combinations of doubles.
const double = (hand) => {
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
/** 
 * NOTE: This solution for if the number of duplicates is four seems severely need of refactoring.
*/
const triple = (hand) => {
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

/* AI logic to play double sequence */


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

const mergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

/*
'hearts': '♥',
'diamonds': '♦',
'spades': '♠',
'clubs': '♣',
*/

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

// Duplicates Object example
/*
 {
'6': [ 'hearts' ],
'7': [ 'clubs' ],
'8': [ 'diamonds' ],
'9': [ 'hearts', 'clubs' ],
'10': [ 'hearts' ],
'11': [ 'hearts' ],
'12': [ 'hearts' ],
'13': [ 'hearts' ],
'14': [ 'hearts' ],
'15': [ 'clubs', 'diamonds' ]
}
*/
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

// Example: 3 3 4 4 5 5 6 6
const doubleSequence = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const sortedHand = mergeSort(hand);
  const totalSequences = [];

  for (let i = 0; i < sortedHand.length; i++) {
    let startingNumber = sortedHand[i].number;

    if (dupesObject[startingNumber].length < 2) {
      continue;
    }

    for (let j = i + 1; j < sortedHand.length; j++) {
      const currentNumber = startingNumber + 1;
      if (!dupesObject[currentNumber]) {
        break;
      }
    }
  }
}

//const hand = [ { number: 11, suite: 'hearts', value: 36, selected: false }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false, copy: 1 }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false, copy: 1 }, { number: 13, suite: 'hearts', value: 44, selected: false }, { number: 15, suite: 'diamonds', value: 51, selected: false, copy: 2 }, { number: 12, suite: 'diamonds', value: 39, selected: false, copy: 2 } ];
const hand = [ { number: 12, suite: 'hearts', value: 36, selected: false, copy: 3 }, { number: 12, suite: 'hearts', value: 36, selected: false, copy: 4 }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false, copy: 1 }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false, copy: 1 }, { number: 13, suite: 'hearts', value: 44, selected: false }, { number: 15, suite: 'diamonds', value: 51, selected: false, copy: 2 }, { number: 12, suite: 'diamonds', value: 39, selected: false, copy: 2 } ];
// const hand = [ { number: 11, suite: 'hearts', value: 36, selected: false }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false }, { number: 13, suite: 'hearts', value: 44, selected: false }];

console.log(quartet(hand));