import gameStyles from './game.module.scss';
import styles from "@/app/page.module.css";
import React, { useState, useEffect } from 'react';
import Hand from "@/components/gameComponents/hand";
import Cards from "@/components/cards/cards";
import { dictionaryCombinations, highestValue } from '@/components/utilities/combination';
import { mapCard, icons } from '../utilities/card';
import { aiMoves, aiPossibleCombinations, determineHardestMove } from '../utilities/ai';

/** 
 * For Testing Purposes on this branch specifically
 * @description variables used to manipulate previousPlayedCombo 
*/
ß
const Game = () => {
  const [shuffledDeck, setDeck] = useState([]);
  const [deckIsShuffled, shuffleDeck] = useState(false);
  const [introIsVisible, showIntro] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [hands, setHands] = useState([]);
  const [comboIsValid, setComboStatus] = useState(null);
  const [currentTurnCombo, setCurrentTurnCombo] = useState('');
  const [currentTurnLength, setCurrentTurnLength] = useState(null);
  const [previousPlayedCombo, setPreviousPlayedCombo] = useState([]);
  const [selectCombo, setComboSelect] = useState('');
  const [endCycleClause, setEndCycleClause] = useState(null);
  const [winnerClause, setWinnerClause] = useState(null);
  const [newRound, setNewRound] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');
  const [gameOverClause, setGameOverClause] = useState(null);

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
    if (!hands.length) {
      return;
    }

    /**
     * @description End logic if 3 hands have won, game over.
     * 
     */
    const checkWinner = hands.filter(player => player.hand.length === 0);

    if (checkWinner.length === 3) {
      setGameOverClause(true);
      return;
    }

    /**
     * @description End logic if hand has won 
     * 
     */
    if (checkWinner.length === 1 && checkWinner[0].winner === false) {
      setWinnerClause(checkWinner[0].player.toString());
      console.log(`Player ${checkWinner[0].player.toString()} wins!`);
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
   }
  }, [playerTurn, newRound]);

  useEffect(() => {
    if (endCycleClause) {
      setTimeout(() => restartRound(), 5000);
      console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON ROUND! STARTING NEW ROUND IN 5 SECONDS...`);
    }
  }, [endCycleClause, previousPlayedCombo, currentTurnCombo, selectCombo, hands]);

  useEffect(() => {
    if (winnerClause === null) {
      return;
    }

    const newHand = hands.map((curr, idx) => {
      if (parseInt(winnerClause) === idx) {
        return { player: curr.player,  hand: curr.hand, skipped: curr.skipped, winner: true }
      } else {
        return curr;
      }
    });
    setHands(newHand);
  }, [winnerClause]);

  useEffect(() => {
    if (gameOverClause) {
      let loser = hands.filter(player => player.winner === false);
      console.log(`Player ${loser[0].player + 1} loses!`);
      setTurnMessage(`Player ${loser[0].player + 1} loses!`);
    }
  }, [gameOverClause])

  useEffect(() => {
    if (winnerClause) {
      console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON! STARTING NEW ROUND IN 7 SECONDS...`);
      setTimeout(() => {
        changeTurn();
        restartRound()
      }, 7500);
    }
  }, [hands]);

  /**
   * @description Starts a new round
   */
  const restartRound = () => {
    setEndCycleClause(null);
    setPreviousPlayedCombo([]);
    setCurrentTurnCombo('');
    setComboSelect('');
    setHands(hands.map(playerHand => {
      if (playerHand.winner === true)  {
        return {
          ...playerHand,
          skipped: true
        }
      } else {
        return {
          ...playerHand,
          skipped: false
        }
      }
    }));
    setWinnerClause(null);
    setNewRound(true);
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

      // Slow down turn phase logic, simulate decision making from AI
      setTimeout(() => {
        setTurnMessage(`Player ${playerTurn + 1} is thinking...`);
        setCurrentTurnCombo(combinationType);
        setComboSelect(combinationType);
        requestCombo(combination, combinationType);
      }, 2500);
    } else {
      let valueToBeat = previousPlayedCombo.length === 0 ? 0 : previousPlayedCombo[previousPlayedCombo.length - 1].value;

      const currHand = hands[playerTurn].hand;
  
      const possibleCombinations = aiMoves(currentTurnCombo, currHand, currentTurnLength);

      if (!possibleCombinations.length) {
        passTurn(playerTurn);
        return;
      }
      const lowestPlay = possibleCombinations.reduce((lowest, curr) => {
        if (curr[curr.length - 1].value < lowest[lowest.length - 1].value && curr[curr.length - 1].value > valueToBeat) {
          return curr;
        } else {
          return lowest;
        }
      }, [{ fake: true, value: 53}]);

      if (lowestPlay.length === 1 && lowestPlay[0].fake) {
        passTurn(playerTurn);
      } else {
        setTimeout(() => {
          setTurnMessage(`Player ${playerTurn + 1} is thinking...`);
          requestCombo(lowestPlay, currentTurnCombo);
        }, 2500);
      }
    }
  }

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

    /*
    const tempHands = [
      {player: 0, hand: [], skipped: false, winner: false},
      {player: 1, hand: [], skipped: false, winner: false},
      {player: 2, hand: [], skipped: false, winner: false},
      {player: 3, hand: [], skipped: false, winner: false},
    ];
    shuffledDeck.forEach((card, idx) => {
      const player = idx % 4;
      tempHands[player].hand.push(card);
      
      if(card.number === 3 && card.suite === 'spades') {
        setPlayerTurn(player);
        setTurnMessage(player === 0 ? 'Your Turn.' : `Player ${player + 1}'s Turn.`);
      };
      
    });
    */

    // Created 4 hands, with user hand having 5+ pairs to utilize slams for testing.
    const tempHands = [
      {
        player: 0, 
        hand: [
          {number: 3, suite: 'spades', value: 1, selected: false},
          {number: 3, suite: 'hearts', value: 4, selected: false},
          {number: 3, suite: 'diamonds', value: 3, selected: false},
          {number: 4, suite: 'spades', value: 5, selected: false},
          {number: 6, suite: 'hearts', value: 16, selected: false},
          {number: 8, suite: 'diamonds', value: 23, selected: false},
          {number: 7, suite: 'clubs', value: 18, selected: false},
          {number: 6, suite: 'clubs', value: 14, selected: false},
          {number: 8, suite: 'clubs', value: 22, selected: false},
          {number: 7, suite: 'spades', value: 17, selected: false},
          {number: 4, suite: 'clubs', value: 6, selected: false},
          {number: 5, suite: 'clubs', value: 10, selected: false},
          {number: 5, suite: 'diamonds', value: 11, selected: false},
          {number: 3, suite: 'clubs', value: 2, selected: false},
        ],
        skipped: false, 
        winner: false},
      {
        player: 1, 
        hand: [
          {number: 14, suite: 'spades', value: 45, selected: false},
          {number: 13, suite: 'clubs', value: 42, selected: false},
          {number: 11, suite: 'clubs', value: 34, selected: false},
          {number: 10, suite: 'diamonds', value: 31, selected: false},
          {number: 10, suite: 'hearts', value: 32, selected: false},
          {number: 14, suite: 'spades', value: 45, selected: false},
          {number: 12, suite: 'diamonds', value: 39, selected: false},
          {number: 11, suite: 'spades', value: 33, selected: false},
          {number: 15, suite: 'hearts', value: 52, selected: false},
          {number: 12, suite: 'spades', value: 37, selected: false},
          {number: 10, suite: 'clubs', value: 30, selected: false},
          {number: 14, suite: 'spades', value: 45, selected: false},
          {number: 5, suite: 'hearts', value: 12, selected: false},
          {number: 13, suite: 'hearts', value: 44, selected: false},
        ], 
        skipped: false, 
        winner: false
      },
      {
        player: 2, 
        hand: [
          {number: 12, suite: 'hearts', value: 40, selected: false}, 
          {number: 13, suite: 'hearts', value: 44, selected: false},
          {number: 14, suite: 'diamonds', value: 47, selected: false},
          {number: 6, suite: 'spades', value: 13, selected: false},
          {number: 15, suite: 'spades', value: 49, selected: false},
          {number: 7, suite: 'hearts', value: 20, selected: false},
          {number: 5, suite: 'spades', value: 9, selected: false},
          {number: 9, suite: 'clubs', value: 26, selected: false},
          {number: 4, suite: 'hearts', value: 8, selected: false},
          {number: 14, suite: 'spades', value: 45, selected: false},
          {number: 14, suite: 'clubs', value: 46, selected: false},
          {number: 8, suite: 'spades', value: 21, selected: false},
          {number: 7, suite: 'diamonds', value: 19, selected: false}
        ], 
        skipped: false, 
        winner: false
      },
      {
        player: 3, 
        hand: [
          {number: 10, suite: 'spades', value: 29, selected: false},
          {number: 13, suite: 'diamonds', value: 43, selected: false},
          {number: 9, suite: 'spades', value: 25, selected: false},
          {number: 9, suite: 'hearts', value: 28, selected: false},
          {number: 9, suite: 'diamonds', value: 27, selected: false},
          {number: 9, suite: 'clubs', value: 26, selected: false},
          {number: 8, suite: 'hearts', value: 24, selected: false},
          {number: 15, suite: 'diamonds', value: 51, selected: false},
          {number: 3, suite: 'clubs', value: 2, selected: false},
          {number: 4, suite: 'diamonds', value: 7, selected: false},
          {number: 6, suite: 'diamonds', value: 15, selected: false},
          {number: 14, suite: 'hearts', value: 48, selected: false},
          {number: 13, suite: 'spades', value: 41, selected: false}
        ], 
        skipped: false, 
        winner: false
      },
    ];

    setPlayerTurn(0);
    setTurnMessage('Your Turn.');
    setHands(tempHands);
    // setNewRound(true);

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
      if (hands[nextPlayer].winner) {
        nextPlayer = nextPlayer === 3 ? 0 : nextPlayer + 1;
      } else  if (hands[nextPlayer]?.skipped) {
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
   * @description - Validates the submitted combo against the last combo played.
   * @param {Object[]} combo - Array of card objects
   * @returns {Boolean}
   */
  const validateCombo = (combo, combination) => {
    console.log('Combo', combo);
    console.log('Combination', combination);
    console.log('Previous:', previousPlayedCombo);
    if (combination === '') {
      setTurnMessage('Your Turn: Set combination type before playing.');
      return;
    } else if (combination === 'single' && previousPlayedCombo.length === 1 && previousPlayedCombo[0].number === 15) {
      if (dictionaryCombinations['double sequence'].isValid(combo) && combo.length >= 6) {
        setCurrentTurnCombo('double sequence');
        return true;
      } else if (dictionaryCombinations['quartet'].isValid(combo)) {
        setCurrentTurnCombo('quartet');
        return true;
      } else {
        return (dictionaryCombinations[combination].isValid(combo) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo));
      }
    } else if (combination === 'pair' && previousPlayedCombo.length === 2 && previousPlayedCombo.every((card) => card.number === 15)) {
      if (dictionaryCombinations['double sequence'].isValid(combo) && combo.length >= 8) {
        setCurrentTurnCombo('double sequence');
        return true;
      } else if (dictionaryCombinations['quartet'].isValid(combo)) {
        setCurrentTurnCombo('quartet');
        return true;
      } else {
        return (dictionaryCombinations[combination].isValid(combo) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo));
      }
    } else if (combination === 'triplet' && previousPlayedCombo.length === 3 && previousPlayedCombo.every((card) => card.number === 15)) {
      if (dictionaryCombinations['double sequence'].isValid(combo) && combo.length >= 10) {
        setCurrentTurnCombo('double sequence');
        return true;
      } else {
        return (dictionaryCombinations[combination].isValid(combo) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo));
      }
    } else {
      return dictionaryCombinations[combination].isValid(combo) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo);
    }
  }

  /**
   * @description Validates player's submitted combo. If valid, proceed. If invalid, return the combo to the player.
   * @param {Object[]} combo - Array of card objects
   */
  const requestCombo = (combo, combination) => {
    // Check if combo is valid
    if((previousPlayedCombo.length === 0 && validateCombo(combo, combination)) || (validateCombo(combo, combination))) {
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

      if (hands[playerTurn].hand.length === 0 && hands[playerTurn].winner === false) {
        setWinnerClause(hands[playerTurn].player.toString());
      } else {
        setTimeout(() => {
          changeTurn();
          if (previousPlayedCombo.length === 0) {
            // console.log(`Current Turn Combo set: ${currentTurnCombo.toUpperCase()}.\n\n`);
            setNewRound(false);
          }
        }, 2500);
      }

      /*
      // TODO: Remove when done testing. This is just to simulate a fake game.
      setTimeout(() => {
        changeTurn();
        if (previousPlayedCombo.length === 0) {
          // console.log(`Current Turn Combo set: ${currentTurnCombo.toUpperCase()}.\n\n`);
          setNewRound(false);
        }
      }, 2500);
      */

    } else {
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
    setTimeout(() => {
      changeTurn();
    }, 2500);
  }

  const changeCombo = (e) => {
    setComboSelect(e.target.value);
    setCurrentTurnCombo(e.target.value);
  }

  const shuffleBtn = deckIsShuffled ? null : <button className={gameStyles.shuffleBtn} onClick={onShuffleClick}>Shuffle Deck</button>;

  const listAiHands = hands.reduce((result, hand) => {
    if (hand.player !== 0) {
      result.push(hand);
    }
    return result;
  }, []).map((playerObj, idx) => {
    return (<li key={idx}>
      <h3>{`Player ${playerObj.player + 1} Hand:`}</h3>
      <Hand cards={playerObj.hand} player={playerObj.player} />
    </li>)
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
          <h2 className={gameStyles.turnIndicator}>{endCycleClause || <div><span>{turnMessage}</span></div>}</h2>
          <h2>{selectCombo ? `Select a combo that fits ${selectCombo}.` : 'Choose Combination Type'}</h2>
          {listAiHands}
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
