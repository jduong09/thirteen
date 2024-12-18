import gameStyles from './game.module.scss';
import styles from "@/app/page.module.css";
import { useState, useEffect } from 'react';
import Hand from "@/components/gameComponents/hand";
import Cards from "@/components/cards/cards";
import { dictionaryCombinations, highestValue } from '@/components/utilities/combination';
import { mapCard, icons } from '../utilities/card';
import { aiMoves, aiPossibleCombinations, determineHardestMove } from '../utilities/ai';

const Game = () => {
  const [shuffledDeck, setDeck] = useState([]);
  const [deckIsShuffled, shuffleDeck] = useState(false);
  const [introIsVisible, showIntro] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [hands, setHands] = useState([]);
  const [comboIsValid, setComboStatus] = useState(null);
  const [currentTurnCombo, setCurrentTurnCombo] = useState('');
  const [currentTurnLength, setCurrentTurnLength] = useState(1);
  const [previousPlayedCombo, setPreviousPlayedCombo] = useState([]);
  const [selectCombo, setComboSelect] = useState('');
  const [endCycleClause, setEndCycleClause] = useState(null);
  const [newRound, setNewRound] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');

  // Build Card Deck
  const suites = ['spades', 'clubs', 'diamonds', 'hearts'];
  // 3-10 are normal cards, 11 is Jack, 12 is Queen, 13 is King, 14 is Ace, 15 is 2.
  const numbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  let value = 1; // 3 of spades is the lowest card
  const deck = numbers.map((number, idx) => suites.map((suite, i) => ({ number, suite, value: value++ }))).flat();

  useEffect(() => {
    setDeck(shuffle(deck));
  }, [hands]);

  useEffect(() => {
    console.log('Inside use effect');
    if (!hands.length) {
      return;
    }
    /**
     * @description End logic if all hands have passed
     * NOTE: This logic is not complete and does not cater to all use cases.
     * NOTE: THIS IS STRICTLY FOR TESTING
     */
    let checkEndCycle = hands.filter(hand => hand.skipped !== true);

    // if checkEndCycle is true after checking all hands for skipped property
    // do not run AI logic.
    if (checkEndCycle.length === 1 && checkEndCycle[0].player === playerTurn) {
      setEndCycleClause(`Player ${checkEndCycle[0].player + 1} wins the round.`);
      return;
    }
    /**
    * @description Prompt ai logic
    * NOTE: This is logic for AI players
    */
   if (playerTurn !== 0) {
    aiToPlay();
   }    /*
     if (playerTurn !== 0) {
      let valueToBeat = previousPlayedCombo.length === 0 ? 0 : previousPlayedCombo[previousPlayedCombo.length - 1].value;

      const currHand = hands[playerTurn].hand;
  
      const possibleCombinations = aiMoves(currentTurnCombo, currHand, currentTurnLength);

      if (!possibleCombinations.length) {
        console.log(`PLAYER ${playerTurn + 1} passes.`);
        passTurn(playerTurn);
      }
      const lowestPlay = possibleCombinations.reduce((lowest, curr) => {
        if (curr[curr.length - 1].value < lowest[lowest.length - 1].value && curr[curr.length - 1].value > valueToBeat) {
          return curr;
        } else {
          return lowest;
        }
      }, [{ fake: true, value: 53}]);

      if (lowestPlay.length === 1 && lowestPlay[0].fake) {
        console.log(`PLAYER ${playerTurn + 1} passes.`);
        passTurn(playerTurn);
      } else {
        requestCombo(lowestPlay, currentTurnCombo);
      }
    }
    */
  }, [playerTurn, hands, newRound]);

  /*
  useEffect(() => {
    if (hands.length) {
      aiToPlay();
    }
  }, [playerTurn, hands, newRound]);
  */

  useEffect(() => {
    if (endCycleClause) {
      // Wait 5 seconds before starting new round
      setTimeout(() => restartRound(), 5000);
      // TODO: Logic for choosing next turn
      // setPlayerTurn(0);
      console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON ROUND! STARTING NEW ROUND IN 5 SECONDS...`);
      // setTurnMessage('Your Turn.');
    }
  }, [endCycleClause, previousPlayedCombo, currentTurnCombo, selectCombo, newRound, hands]);

  /**
   * @description Starts a new round
   */
  const restartRound = () => {
    setEndCycleClause(null);
    setPreviousPlayedCombo([]);
    setCurrentTurnCombo('');
    setComboSelect('');
    setNewRound(true);
    hands.forEach(hand => hand.skipped = false);
    setHands(hands);
    console.log('SHOULD SET ROUND...?', newRound);
  }

  /**
   * @description Prompt ai logic
   * NOTE: This is logic for AI players
   */
  const aiToPlay = () => {
    if (newRound && playerTurn !== 0) {
      console.log('\n\n***** A NEW ROUND HAS STARTED *****');
      const aiMoves = aiPossibleCombinations(hands[playerTurn].hand);

      const [combinationType, combination] = determineHardestMove(aiMoves);
      console.log(combinationType, combination);
      setCurrentTurnCombo(combinationType);
      setComboSelect(combinationType);
      requestCombo(combination, combinationType);
      setNewRound(false);
    } else {
      let valueToBeat = previousPlayedCombo.length === 0 ? 0 : previousPlayedCombo[previousPlayedCombo.length - 1].value;

      const currHand = hands[playerTurn].hand;
  
      const possibleCombinations = aiMoves(currentTurnCombo, currHand, currentTurnLength);

      if (!possibleCombinations.length) {
        console.log(`PLAYER ${playerTurn + 1} passes.`);
        passTurn(playerTurn);
      }
      const lowestPlay = possibleCombinations.reduce((lowest, curr) => {
        if (curr[curr.length - 1].value < lowest[lowest.length - 1].value && curr[curr.length - 1].value > valueToBeat) {
          return curr;
        } else {
          return lowest;
        }
      }, [{ fake: true, value: 53}]);

      if (lowestPlay.length === 1 && lowestPlay[0].fake) {
        console.log(`PLAYER ${playerTurn + 1} passes.`);
        passTurn(playerTurn);
      } else {
        requestCombo(lowestPlay, currentTurnCombo);
      }
    }
  }
      /*
      if (playerTurn !== 0) {
        const playerHasWonRound = hands.every((hand) => hand.skipped || hand.player === playerTurn);
        if (playerHasWonRound) {
          // FIXME: This is only reached when an AI wins.
          console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON ROUND! STARTING NEW ROUND IN 5 SECONDS...`);
          // returns [combinationType, arrayCombination]
          const aiMoves = aiPossibleCombinations(hands[playerTurn].hand);

          const [combinationType, combination] = determineHardestMove(aiMoves);
          console.log(combinationType, combination);
          requestCombo(combination, combinationType);
          setComboSelect(combinationType);
          setCurrentTurnCombo(combinationType);
        } else {
          let valueToBeat = previousPlayedCombo.length === 0 ? 0 : previousPlayedCombo[previousPlayedCombo.length - 1].value;

          const currHand = hands[playerTurn].hand;
      
          const possibleCombinations = aiMoves(currentTurnCombo, currHand, currentTurnLength);
    
          if (!possibleCombinations.length) {
            console.log(`PLAYER ${playerTurn + 1} passes.`);
            passTurn(playerTurn);
          }
          const lowestPlay = possibleCombinations.reduce((lowest, curr) => {
            if (curr[curr.length - 1].value < lowest[lowest.length - 1].value && curr[curr.length - 1].value > valueToBeat) {
              return curr;
            } else {
              return lowest;
            }
          }, [{ fake: true, value: 53}]);
    
          if (lowestPlay.length === 1 && lowestPlay[0].fake) {
            console.log(`PLAYER ${playerTurn + 1} passes.`);
            passTurn(playerTurn);
          } else {
            requestCombo(lowestPlay, currentTurnCombo);
          }
          /*
          const lowestCard = currHand.reduce((lowest, curr) => {
            if (curr.value < lowest && curr.value > valueToBeat) {
              return curr.value;
            }
            return lowest;
          }, 53);

          const cardToPlay = currHand.find((card) => card.value === lowestCard);
          if (cardToPlay) {
            requestCombo([cardToPlay], 'single');
          } else {
            // NOTE: Will cause endless cycle of passing until there is game logic to recognize next cycle.
            // Check if every player but playerTurn has passed
            passTurn(playerTurn);
          }

        }
      }
        */

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
      {player: 0, hand: [], skipped: false},
      {player: 1, hand: [], skipped: false},
      {player: 2, hand: [], skipped: false},
      {player: 3, hand: [], skipped: false},
    ];
    shuffledDeck.forEach((card, idx) => {
      const player = idx % 4;
      tempHands[player].hand.push(card);
      
      if(card.number === 3 && card.suite === 'spades') {
        setPlayerTurn(player);
      };
      
    });
    // setPlayerTurn(0);
    // setTurnMessage('Your Turn.');
    setHands(tempHands);
    setNewRound(true);

    setTimeout(() => {
      showIntro(false);
      shuffleDeck(true);
    }, 1000);
  };

  /**
   * @description Changes the player turn to the next player.
   * Goal is to find the player that has the key 'skipped' === false
   */
  const changeTurn = () => {
    let nextPlayer = playerTurn === 3 ? 0 : playerTurn + 1;
    while (nextPlayer !== playerTurn) {
      if (hands[nextPlayer]?.skipped) {
        nextPlayer = nextPlayer === 3 ? 0 : nextPlayer + 1;
      } else {
        break;
      }
    }

    setTurnMessage(nextPlayer === 0 ? 'Your Turn.' : `Player ${nextPlayer + 1}'s Turn.`);
    console.log(`SETTING NEXT PLAYER TO: ${nextPlayer + 1}`);
    setPlayerTurn(nextPlayer);
  }

  /**
   * @description Determines the combination type for the current turn based on the cards submitted
   * NOTE: This is currently unused. But will be once we have the logic in place for the AI moves (or if the user has the first turn)
   * @param {Object[]} combo - Array of card objects
   */
  const determineCombination = (combo) => {
    const [combination] = Object.entries(dictionaryCombinations).find(([key, val]) => val.isValid(combo)) || [];
    if (combination) {
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
    if (combination === '') {
      setTurnMessage('Your Turn: Set combination type before playing.');
      return;
    }
    return dictionaryCombinations[combination].isValid(combo);
  }

  /**
   * @description Validates player's submitted combo. If valid, proceed. If invalid, return the combo to the player.
   * @param {Object[]} combo - Array of card objects
   */
  const requestCombo = (combo, combination) => {
    console.log('Current Turn Combo:', currentTurnCombo);
    console.log('Combo: ', combo);
    console.log('Combination: ', combination);
    // Check if combo is valid
    if((previousPlayedCombo.length === 0 && validateCombo(combo, combination)) || (validateCombo(combo, combination) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo))) {

      if (previousPlayedCombo.length === 0) {
        console.log(`Current Turn Combo set: ${currentTurnCombo.toUpperCase()}.\n\n`);
      }
      // Accept combo and set player turn
      setComboStatus(true);
      console.log(`PLAYER ${playerTurn + 1} plays: ${combo.map((card) => `${card.number} of ${card.suite}`).join(", ")}\n\n`);
      setPreviousPlayedCombo(combo);
      setCurrentTurnLength(combo.length);
      setComboStatus(null);

      combo.forEach((card) => {
        hands[playerTurn].hand = hands[playerTurn].hand.filter((handCard) => handCard.value !== card.value);
      });
      setHands(hands);
      // TODO: Remove when done testing. This is just to simulate a fake game.
      setTimeout(() => changeTurn(), 10000);

    } else {
      // Reject combo
      console.log(`PLAYER ${playerTurn + 1} ATTEMPTED TO PLAY: ${combo.map((card) => `${card.number} of ${card.suite}`).join(", ")}`);
      setComboStatus(false);
    }
  }

  /**
   * @description Compares players submitted combo with previous played combo.
   * @param {integer} currentHighestValue - Highest integer of previous played combo
   * @param {object[]} combo - Array of card objects
   */
  const compareCombo = (currentHighestValue, combo) => {
    const highestValueOfCombo = highestValue(combo);
    return highestValueOfCombo.value > currentHighestValue;
  }

  /**
   * @description Updates the player turn to the next player.
   */
  const passTurn = (playerTurn) => {
    console.log(`***** PLAYER ${playerTurn + 1} PASSES. ******`);
    hands[playerTurn].skipped = true;
    setHands(hands);
    setComboStatus(true);
    changeTurn();
  }

  const changeCombo = (e) => {
    setComboSelect(e.target.value);
    setCurrentTurnCombo(e.target.value);
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
          <h2 className={gameStyles.turnIndicator}>{endCycleClause || <div><span>{turnMessage}</span></div>}</h2>
          <h2>{selectCombo ? `Select a combo that fits ${selectCombo}.` : 'Choose Combination Type'}</h2>
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
            <select id='select-combo' name='select-combo' className={gameStyles.selectCombo} onChange={changeCombo} value={currentTurnCombo}>
              <option value=''>--Please choose an option--</option>
              <option value='single'>Single</option>
              <option value='pair'>Pair</option>
              <option value='triplet'>Triplet</option>
              <option value='quartet'>Quartet</option>
              <option value='sequence'>Sequence</option>
              <option value='double sequence'>Double Sequence</option>
            </select>
          </form>
          <div className={gameStyles.middlePile}>
            <h2>Middle Pile</h2>
            <Cards cards={previousPlayedCombo} />
          </div>
        </div>
      }
    </game>
  );
};

export default Game;