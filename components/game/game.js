import gameStyles from './game.module.scss';
import styles from "@/app/page.module.css";
import { useState, useEffect } from 'react';
import Hand from "@/components/gameComponents/hand.js";
import { dictionaryCombinations, highestValue } from '@/components/utilities/combination.js';
import { mapCard } from '../utilities/card';

const icons = {
  'hearts': '♥',
  'diamonds': '♦',
  'spades': '♠',
  'clubs': '♣',
}

const Game = () => {
  const [shuffledDeck, setDeck] = useState([]);
  const [deckIsShuffled, shuffleDeck] = useState(false);
  const [introIsVisible, showIntro] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [hands, setHands] = useState(null);
  const [comboIsValid, setComboStatus] = useState(null);
  const [currentTurnCombo, setCurrentTurnCombo] = useState('single');
  const [previousPlayedCombo, setPreviousPlayedCombo] = useState([]);

  const [selectCombo, setComboSelect] = useState('single');
  // Build Card Deck
  const suites = ['spades', 'clubs', 'diamonds', 'hearts'];
  // 3-10 are normal cards, 11 is Jack, 12 is Queen, 13 is King, 14 is Ace, 15 is 2.
  const numbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  let value = 1; // 3 of spades is the lowest card
  const deck = numbers.map((number, idx) => suites.map((suite, i) => ({ number, suite, value: value++ }))).flat();

  useEffect(() => {
    setDeck(shuffle(deck));
  }, []);

  useEffect(() => {
     /**
     * @description Prompt ai logic
     * NOTE: This is logic for AI players
     */

    if (playerTurn !== 0) {
      let valueToBeat;
      if (previousPlayedCombo.length === 0) {
        valueToBeat = 0;
      } else {
        valueToBeat = previousPlayedCombo[previousPlayedCombo.length - 1].value;
      }

      const currHand = hands[playerTurn].hand;
      const lowestCard = currHand.reduce((lowest, curr) => {
        if(curr.value < lowest && curr.value > valueToBeat) {
          return curr.value;
        }
        return lowest;
      }, 53);
      console.log(`Player ${playerTurn + 1} plays: ${currHand.find((card) => card.value === lowestCard).number} of ${currHand.find((card) => card.value === lowestCard).suite}`);
      requestCombo([currHand.find((card) => card.value === lowestCard)], 'single');
    }
  }, [playerTurn]);

  /**
   * @description Randomly shuffles the card deck using the Fisher-Yates Shuffle algorithm.
   * @param {Object[]} array - Array of card objects
   * @returns {Object[]} - Shuffled array of card objects
   */
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
    shuffledDeck.forEach((card, idx) => {
      const player = idx % 4;
      tempHands[player].hand.push(card);
      if(card.number === 3 && card.suite === 'spades') {
        setPlayerTurn(player);
      };
    });

    setHands(tempHands);

    setTimeout(() => {
      showIntro(false);
      shuffleDeck(true);
    }, 1000);
  };


  /**
   * @description Changes the player turn to the next player.
   */
  const changeTurn = () => {
    console.log('Changing Players Turn');
    setPlayerTurn(playerTurn === 3 ? 0 : playerTurn + 1);
  }

  /**
   * @description Determines the combination type for the current turn based on the cards submitted
   * NOTE: This is currently unused. But will be once we have the logic in place for the AI moves (or if the user has the first turn)
   * @param {Object[]} combo - Array of card objects
   */
  const determineCombination = (combo) => {
    const [combination] = Object.entries(dictionaryCombinations).find(([key, val]) => val.isValid(combo)) || [];
    if(combination) {
      setCurrentTurnCombo(combination);
    } else {
      // Invalid combination --> reject combo
      setComboStatus(false);
    }
  }
  /**
   * @description - Validates the submitted combo against the last combo played.
   * @param {Object[]} combo - Array of card objects
   * @returns {Boolean}
   */
  const validateCombo = (combo, combination) => {
    // TODO: A separate ticket to handle validating the combo move
    return dictionaryCombinations[combination].isValid(combo);
  }

  /**
   * @description Validates player's submitted combo. If valid, proceed. If invalid, return the combo to the player.
   * @param {Object[]} combo - Array of card objects
   */
  const requestCombo = (combo, combination) => {
    // Check if combo is valid
    if(previousPlayedCombo.length === 0 || (validateCombo(combo, combination) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo))) {
      // Accept combo and set player turn
      setComboStatus(true);
      setPreviousPlayedCombo(combo);
      setComboStatus(null);

      combo.forEach((card) => {
        hands[playerTurn].hand = hands[playerTurn].hand.filter((handCard) => handCard.value !== card.value);
      });
      setHands(hands);
      // TODO: Remove when done testing. This is just to simulate a fake game.
      setTimeout(() => changeTurn(), 3000);

    } else {
      // Reject combo
      setComboStatus(false);
    }
  }

  /**
   * @description Compares players submitted combo with previous played combo.
   * @param {integer} currentHighestValue - Highest integer of previous played combo
   * @param {combo} combo - Array of card objects
   */
  const compareCombo = (currentHighestValue, combo) => {
    const highestValueOfCombo = highestValue(combo);
    return highestValueOfCombo.value > currentHighestValue;
  }

  /**
   * @description Updates the player turn to the next player.
   */
  const passTurn = () => {
    changeTurn();
    setComboStatus(true);
  }

  const changeCombo = (e) => {
    setComboSelect(e.target.value);
    setCurrentTurnCombo(e.target.value);
  }

  /**
   * @description Reshuffle deck to test combos.
   */
  const reshuffleDeck = () => {
    shuffleDeck(false);
    setComboStatus(null);
    onShuffleClick();
  }

  // Only show shuffle button at start or end of game
  const shuffleBtn = deckIsShuffled ? null : <button className={gameStyles.shuffleBtn} onClick={onShuffleClick}>Shuffle Deck</button>;
 
  const listOfCards = previousPlayedCombo.map((card, idx) => {
    const cardDisplay = mapCard(card.number);
    return (
      <li key={idx}>
        <div className={`${styles.card} ${card.selected && styles.selected}`} onClick={(e) => selectCard(card, e)}>
          <div className={styles.cardTopLeft}>
            <span>{cardDisplay}</span>
            <span>{icons[card.suite]}</span>
          </div>
          <div className={styles.cardBottomRight}>
            <span>{icons[card.suite]}</span>
            <span>{cardDisplay}</span>
          </div>
        </div>
      </li>
    );
  });

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
          <h2 className={gameStyles.turnIndicator}>
            <span>{playerTurn === 0 ? 'Your' : `Player ${playerTurn + 1}'s`} turn.</span>
            {playerTurn !== 0 && <span> Thinking... <span className={gameStyles.loading}></span></span>}
          </h2>
          <h2>Select a combo thats fits {selectCombo}</h2>
          <h3>Your Hand:</h3>
          <Hand cards={hands[0].hand}
            playerTurn={playerTurn}
            comboIsValid={comboIsValid}
            requestCombo={requestCombo}
            currentTurnCombo={currentTurnCombo}
            passTurn={passTurn}
          />
          <form>
            <label htmlFor='select-combo'>Combination: </label>
            <select id='select-combo' name='select-combo' className={gameStyles.selectCombo} onChange={changeCombo}>
              <option value='single'>Single</option>
              <option value='pair'>Pair</option>
              <option value='triplet'>Triplet</option>
              <option value='quartet'>Quartet</option>
              <option value='sequence'>Sequence</option>
              <option value='double sequence'>Double Sequence</option>
            </select>
          </form>
          {comboIsValid && <h2 className={gameStyles.validCombo}>Combo Choice is correct. Try making another combo or reshuffling the deck for new cards.</h2>}

          <h2>Previous Played Combo: <ul>{listOfCards}</ul></h2>
        </div>
        
      }
    </game>
  );
};

export default Game;