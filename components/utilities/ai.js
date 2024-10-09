/* AI logic to play a double */
const double = (hand) => {
  const dupesObject = createDuplicatesObject(hand);
  const doubleArrays = [];

  for (const value in dupesObject) {
    if (dupesObject[value] === 2) {
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

}
/* AI logic to play a quartet */

/* AI logic to play a sequence */

/* AI logic to play double sequence */


const merge = (left, right) => {
  let sortedArr = [];

  while (left.length && right.length) {
    if (left[0].number < right[0].number) {
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
const hand = [{ number: 4, rank: '♥' }, { number: 3, rank: '♦' }, { number: 5, rank: '♦' }, { number: 12, rank: '♦' }, { number: 3, rank: '♥' }, { number: 3, rank: '♣'}];
//const hand = [{ number: 4, rank: '♥' }, { number: 3, rank: '♦' }, { number: 5, rank: '♦' }, { number: 12, rank: '♦' }];
//const hand = [{ number: 4, rank: '♥' }, { number: 3, rank: '♦' }, { number: 5, rank: '♦' }, { number: 12, rank: '♦' }, { number: 3, rank: '♥' }];
console.log(mergeSort(hand));

const createDuplicatesObject = (array) => {
  const values = {};

  for (let i = 0; i < array.length; i++) {
    const number = array[i].number;
    if (!values[number]) {
      values[number] = 1;
    } else {
      values[number]++;
    }
  }
  return values;
}

console.log(double(hand));