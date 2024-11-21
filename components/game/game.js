import gameStyles from './game.module.scss';
import styles from "@/app/page.module.css";
import { useState, useEffect } from 'react';
import Hand from "@/components/gameComponents/hand";
import Cards from "@/components/cards/cards";
import { dictionaryCombinations, highestValue } from '@/components/utilities/combination';
import { mapCard, icons } from '../utilities/card';

const Game = () => {
  const [shuffledDeck, setDeck] = useState([]);
  const [deckIsShuffled, shuffleDeck] = useState(false);
  const [introIsVisible, showIntro] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [hands, setHands] = useState([]);
  const [comboIsValid, setComboStatus] = useState(null);
  const [currentTurnCombo, setCurrentTurnCombo] = useState('single');
  const [previousPlayedCombo, setPreviousPlayedCombo] = useState([]);
  const [selectCombo, setComboSelect] = useState('single');
  const [endCycleClause, setEndCycleClause] = useState(null);
  const [newRound, setNewRound] = useState(false);

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
  }, [playerTurn]);

  useEffect(() => {
    if (hands.length) {
      aiToPlay();
    }
  }, [playerTurn, hands, newRound]);

  useEffect(() => {
    if (endCycleClause) {
      // Wait 5 seconds before starting new round
      setTimeout(() => restartRound(), 5000);
      // TODO: Logic for choosing next turn
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
    if (newRound) {
      console.log('\n\n***** A NEW ROUND HAS STARTED *****');
    } else {
      if (playerTurn !== 0) {
        const playerHasWonRound = hands.every((hand) => hand.skipped || hand.player === playerTurn);
        if (playerHasWonRound) {
          // FIXME: This is only reached when an AI wins.
          console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON ROUND! STARTING NEW ROUND IN 5 SECONDS...`);
        } else {
          let valueToBeat = previousPlayedCombo.length === 0 ? 0 : previousPlayedCombo[previousPlayedCombo.length - 1].value;
          const currHand = hands[playerTurn].hand;
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
    const tempHands = [
      {player: 0, hand: [], skipped: false},
      {player: 1, hand: [], skipped: false},
      {player: 2, hand: [], skipped: false},
      {player: 3, hand: [], skipped: false},
    ];
    shuffledDeck.forEach((card, idx) => {
      const player = idx % 4;
      tempHands[player].hand.push(card);
      /*
      if(card.number === 3 && card.suite === 'spades') {
        setPlayerTurn(player);
      };
      */
    });
    setPlayerTurn(0);
  
    if (tempHands[0].hand.length) {
      setHands(tempHands);
    }

    setTimeout(() => {
      showIntro(false);
    }, 3000);
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
    // TODO: A separate ticket to handle validating the combo move
    return dictionaryCombinations[combination].isValid(combo);
  }

  /**
   * @description Validates player's submitted combo. If valid, proceed. If invalid, return the combo to the player.
   * @param {Object[]} combo - Array of card objects
   */
  const requestCombo = (combo, combination) => {
    // Check if combo is valid
    if ((previousPlayedCombo.length === 0 && validateCombo(combo, combination))|| (validateCombo(combo, combination) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo))) {
      // Accept combo and set player turn
      console.log(`PLAYER ${playerTurn + 1} SUCCESSFULLY PLAYED: `, combo[0].number, 'of', combo[0].suite);
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
      console.log(`PLAYER ${playerTurn + 1} ATTEMPTED TO PLAY: `, combo[0].number, 'of', combo[0].suite);
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

      {hands.length !== 0 &&
        <div>
          <h2 className={gameStyles.turnIndicator}>
            {endCycleClause ? 
            <span>End of Turn Cycle...resetting...</span> : 
            <div>
              <span id="span-player-turn">{playerTurn === 0 ? 'Your' : `Player ${playerTurn + 1}'s`} turn.</span>
              {playerTurn !== 0 && <span> Thinking... <span className={gameStyles.loading}></span></span>}
            </div>}
          </h2>
          <ul data-cy='hands-ai'>{listAiHands}</ul>
          <h2>Select a combo thats fits {selectCombo}</h2>
          <h3>Your Hand:</h3>
          <Hand cards={hands[0].hand}
            playerTurn={playerTurn}
            comboIsValid={comboIsValid}
            requestCombo={requestCombo}
            currentTurnCombo={currentTurnCombo}
            passTurn={passTurn}
            player={0}
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
          {comboIsValid && <h2 className={gameStyles.validCombo}>Combo Choice is correct.</h2>}
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