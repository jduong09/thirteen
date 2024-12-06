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

const mergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
};

const determineMove =  (hand) => {
  const possibleCombinations = [];
  console.log(mergeSort(hand));
};

const currentPlays = {
  quartet: [],
  triplet: [],
  pair: [],
  straight: [],
  doubleSequence: [],
  highCard: []
}

 
const hand = [{number: 12, suite: 'clubs', value: 38, selected: false},  {number: 12, suite: 'diamonds', value: 39, selected: false}, {number: 15, suite: 'hearts', value: 52, selected: false}, {number: 3, suite: 'hearts', value: 4, selected: false}, {number: 5, suite: 'diamonds', value: 11, selected: false}, {number: 5, suite: 'hearts', value: 12, selected: false},  {number: 7, suite: 'clubs', value: 18, selected: false}, {number: 4, suite: 'hearts', value: 8, selected: false}, {number: 8, suite: 'spades', value: 21, selected: false}, {number: 3, suite: 'clubs', value: 2, selected: false}, {number: 4, suite: 'diamonds', value: 7, selected: false}, {number: 4, suite: 'clubs', value: 6, selected: false}, {number: 9, suite: 'spades', value: 25, selected: false}];
determineMove(hand);