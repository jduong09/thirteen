import gameStyles from './game.module.scss';
import { useState } from 'react';
import Hand from "@/components/gameComponents/hand.js";

const Game = () => {
  const [deckIsShuffled, shuffleDeck] = useState(false);
  const [introIsVisible, showIntro] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [hands, setHands] = useState(null);

  // Build Card Deck
  const suites = ['spades', 'clubs', 'diamonds', 'hearts'];
  const numbers = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
  let value = 1; // 3 of spades is the lowest card
  const deck = numbers.map((number, idx) => suites.map((suite, i) => ({ number, suite, value: value++ }))).flat();

  // Shuffle Deck >> Fisher-Yates Shuffle
  const shuffle = (array) => {
    const arrCopy = JSON.parse(JSON.stringify(array));
    // While there remain elements to shuffle...
    let currIdx = arrCopy.length;
    while (currIdx != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currIdx);
      currIdx--;
      // And swap it with the current element.
      [arrCopy[currIdx], arrCopy[randomIndex]] = [arrCopy[randomIndex], arrCopy[currIdx]];
    }
    return arrCopy;
  };
  const shuffled = shuffle(deck);

  /**
   * @description Randomly shuffles the card deck using the fisher-yates shuffle algorithm and deals 13 cards to each player. Established the first player.
   */
  const onShuffleClick = () => {
    showIntro(true);

    const tempHands = [
      {player: 0, hand: []},
      {player: 1, hand: []},
      {player: 2, hand: []},
      {player: 3, hand: []},
    ];

    shuffled.forEach((card, idx) => {
      const player = idx % 4;
      tempHands[player].hand.push(card);
      if(card.number === '3' && card.suite === 'spades') {
        setPlayerTurn(player);
      };
    });

    setHands(tempHands);

    setTimeout(() => {
      showIntro(false);
      shuffleDeck(true);
    }, 10000);
  };

  const requestCombo = (combo) => {
    console.log('Combo sent back to game component: ');
    console.log(combo);
  }

  const passTurn = () => {
    console.log('Pass Turn');
  }

  // Only show shuffle button at start or end of game
  const shuffleBtn = deckIsShuffled ? null : <button className={gameStyles.shuffleBtn} onClick={onShuffleClick}>Shuffle Deck</button>;
  return (
    <game>
      {introIsVisible
        ? <div className={gameStyles.intro}>
          <p className={gameStyles.fade5}>Starting game.</p>
          <p className={gameStyles.fade10}>Shuffling deck...</p>
          <p className={gameStyles.showShuffle}>The deck has been shuffled and dealt. The first player to start is player {playerTurn + 1}</p>
        </div>
        : shuffleBtn}

      {deckIsShuffled &&
        <div>
          <h3>Your Hand:</h3>
          <Hand cards={hands[0].hand} requestCombo={requestCombo} passTurn={passTurn} />
        </div>
      }
    </game>
  );
};

export default Game;