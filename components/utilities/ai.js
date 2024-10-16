/* AI logic to play a double */
// Need to handle logic if there are 3/4 of a kind
// This leads to different combinations of doubles.
const double = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const doubleArrays = [];

  for (const value in dupesObject) {
    if (dupesObject[value].length === 2) {
      doubleArrays.push(value);
    }
  }

  if (doubleArrays.length) {
    return hand.filter((card) => card.number === Number(doubleArrays[0]));
  } else {
    return [];
  }
}
/* AI logic to play a triple */
const triple = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const tripleArrays = [];

  for (const value in dupesObject) {
    if (dupesObject[value] === 3) {
      tripleArrays.push(value);
    }
  }

  if (tripleArrays.length) {
    return hand.filter((card) => card.number === Number(tripleArrays[0]));
  } else {
    return [];
  }
}
/* AI logic to play a quartet */
const quartet = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const quartetArrays = [];

  for (const value in dupesObject) {
    if (dupesObject[value] === 4) {
      quartetArrays.push(value);
    }
  }

  if (quartetArrays.length) {
    return hand.filter((card) => card.number === Number(quartetArrays[0]));
  } else {
    return [];
  }
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
// 
const hand = [ { number: 11, suite: 'hearts', value: 36, selected: false }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false, copy: 1 }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false, copy: 1 }, { number: 13, suite: 'hearts', value: 44, selected: false }, { number: 15, suite: 'diamonds', value: 51, selected: false, copy: 2 }, { number: 12, suite: 'diamonds', value: 39, selected: false, copy: 2 } ];
// const hand = [ { number: 11, suite: 'hearts', value: 36, selected: false }, { number: 6, suite: 'hearts', value: 16, selected: false },  { number: 14, suite: 'hearts', value: 48, selected: false }, { number: 12, suite: 'hearts', value: 40, selected: false }, { number: 8, suite: 'diamonds', value: 23, selected: false }, { number: 9, suite: 'hearts', value: 28, selected: false }, { number: 15, suite: 'clubs', value: 50, selected: false }, { number: 13, suite: 'hearts', value: 44, selected: false }];

console.log(double(hand));