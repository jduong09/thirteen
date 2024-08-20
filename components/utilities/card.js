// suit (string)
// rank (string)

export const mapCard = (number) => {
  if (number === '11') {
    return 'J';
  } else if (number === '12') {
    return 'Q';
  } else if (number === '13') {
    return 'K';
  } else if (number === '14') {
    return 'A';
  } else if (number === '15') {
    return '2';
  } else {
    return number;
  }
}

export const makeCard = (suit, rank) => {
  return {
    suit,
    rank
  }
}