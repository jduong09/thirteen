// Dictionary Logic.
// Need to
// At start of turn, play hardest combo to beat
// When following up, play highest value combo.
// double sequence (6 cards)
// 6 Sequence and above
// quartet
// three of a kind
// 5 sequeence straight
// 4 sequence straight
// pair
// 3 sequence straight
// high card
const difficulties = {
  "hard": {
    1: {
      name: 'Quartet',
    },
    2: {
      name: '5 Card Straight',
    },
    3: {
      name: '4 Card Straight',
    },
    4: {
      name: 'Triplet'
    },
    5: {
      name: '3 Card Straight',
    },
    6: {
      name: 'Pair'
    },
    7: {
      name: 'High Card'
    }

  },
  "easy": {

  },
  "random": {

  }
}