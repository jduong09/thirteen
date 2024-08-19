import gameStyles from './game.module.scss';
import { useState } from 'react';
import Hand from "@/components/gameComponents/hand.js";
import { dictionaryCombinations } from '@/components/utilities/combination.js';

const Game = () => {
  const [deckIsShuffled, shuffleDeck] = useState(false);
  const [introIsVisible, showIntro] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [hands, setHands] = useState(null);
  const [comboIsValid, setComboStatus] = useState(null);
  const [currentTurnCombo, setCurrentTurnCombo] = useState('single');

  const [selectCombo, setComboSelect] = useState('single');

  // Build Card Deck
  const suites = ['spades', 'clubs', 'diamonds', 'hearts'];
  const numbers = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  let value = 1; // 3 of spades is the lowest card
  const deck = numbers.map((number, idx) => suites.map((suite, i) => ({ number, suite, value: value++ }))).flat();

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
    }, 5000);

    // TODO: For testing purposes, set player 0 to be first player. Remove when done testing.
    setPlayerTurn(0);
  };

  /**
   * @description - Validates the submitted combo against the last combo played.
   * @param {Object[]} combo - Array of card objects
   * @returns {Boolean}
   */
  const validateCombo = (combo, combination) => {
    // TODO: A separate ticket to handle validating the combo move
    console.log(combo, combination);
    return dictionaryCombinations[combination].isValid(combo);
  }

  /**
   * @description Validates player's submitted combo. If valid, proceed. If invalid, return the combo to the player.
   * @param {Object[]} combo - Array of card objects
   */
  const requestCombo = (combo, combination) => {
    console.log(combination);
    console.log(combo);
    console.log(currentTurnCombo);
    // Check if combo is valid
    if(validateCombo(combo, combination)) {
      // Accept combo and set player turn
      console.log('valid combo');
      setComboStatus(true);

      setTimeout(() => {
        setComboStatus(null);
      }, 5000);
      // For purposes of Dictionary of Combinations PR, commenting out passTurn and infinitely looping comboChoiceLoop
      // passTurn();
      // TODO: Pass back updated hand to player
    } else {
      // Reject combo
      console.log('incorrect combo');
      setComboStatus(false);
    }
  }

  /**
   * @description Updates the player turn to the next player.
   */
  const passTurn = () => {
    setPlayerTurn(playerTurn === 3 ? 0 : playerTurn + 1);
    setComboStatus(true);
  }

  /**
   * @description Changes combo with updated user selected choice.
   */
  const changeCombo = (e) => {
    console.log('E.target.value', e.target.value);
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
          <h2 className={gameStyles.turnIndicator}>{playerTurn === 0 ? 'Your' : `Player ${playerTurn + 1}'s`} turn.</h2>
          <h2>{`Select a combo thats fits ${selectCombo}`}</h2>
          <h3>Your Hand:</h3>
          <Hand cards={hands[0].hand}
            playerTurn={playerTurn}
            comboIsValid={comboIsValid}
            requestCombo={requestCombo}
            currentTurnCombo={currentTurnCombo}
            passTurn={passTurn}
          />
          <button className={gameStyles.shuffleBtn} onClick={reshuffleDeck}>Reshuffle Deck</button>
          <form>
            <label htmlFor='select-combo'>Combination: </label>
            <select id='select-combo' name='select-combo' onChange={changeCombo}>
              <option value='single'>Single</option>
              <option value='pair'>Pair</option>
              <option value='triplet'>Triplet</option>
              <option value='quartet'>Quartet</option>
              <option value='sequence'>Sequenece</option>
              <option value='double sequence'>Double Sequence</option>
            </select>
          </form>

          {comboIsValid && <h2 className={gameStyles.validCombo}>Combo Choice is correct. Try making another combo or reshuffling the deck for new cards.</h2>}
        </div>
        
      }
    </game>
  );
};

export default Game;