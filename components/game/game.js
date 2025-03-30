import React, { useRef, useState, useEffect } from "react";
import gameStyles from "./game.module.scss";
import handStyles from "../hand/hands.module.scss";
import Hand from "@/components/hand/hand";
import Cards from "@/components/cards/cards";
import { dictionaryCombinations, highestValue } from "@/components/utilities/combination";
import { aiMoves, aiPossibleCombinations, determineHardestMove } from "../utilities/ai";

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
  const [winnerClause, setWinnerClause] = useState(null);
  const [newRound, setNewRound] = useState(false);
  const [turnMessage, setTurnMessage] = useState('');
  const [gameOverClause, setGameOverClause] = useState(null);
  const [showQty, setShowQty] = useState(false);

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

    if (checkWinner.length === 1) {
      setGameOverClause(true);
      return;
    }

    /**
     * @description End logic if hand has no cards, declared winner (Up to 3 people can win, 1 person loses)
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
    let checkEndCycle = hands.filter(hand => hand.skipped !== true);
    if (endCycleClause) {
      setHands(hands.map(playerHand => {
        if (checkEndCycle[0].player === playerHand.player)  {
          return {
            ...playerHand,
            roundWin: true,
          }
        } else {
          return playerHand;
        }
      }));
      setTimeout(() => restartRound(), 5000);
      console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON ROUND! STARTING NEW ROUND IN 5 SECONDS...`);
    }
  }, [endCycleClause, previousPlayedCombo, currentTurnCombo, selectCombo]);

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
      let winner = hands.filter(player => player.winner === true);
      setTurnMessage(`Player ${winner[0].player + 1} wins!`);
    }
  }, [gameOverClause])

  useEffect(() => {
    if (winnerClause) {
      console.log(`\n\nPLAYER ${playerTurn + 1} HAS WON! STARTING NEW ROUND IN 7 SECONDS...`);
      setTimeout(() => {
        changeTurn();
        restartRound();
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
          skipped: true,
          roundWin: false,
        }
      } else {
        return {
          ...playerHand,
          skipped: false,
          roundWin: false,
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

    const tempHands = [
      {player: 0, hand: [], skipped: false, winner: false, roundWin: false},
      {player: 1, hand: [], skipped: false, winner: false, roundWin: false},
      {player: 2, hand: [], skipped: false, winner: false, roundWin: false},
      {player: 3, hand: [], skipped: false, winner: false, roundWin: false},
    ];
    shuffledDeck.forEach((card, idx) => {
      const player = idx % 4;
      tempHands[player].hand.push(card);

      setPlayerTurn(0);
      /*
      if (card.number === 3 && card.suite === 'spades') {
        setPlayerTurn(player);
        setTurnMessage(player === 0 ? 'Your Turn.' : `Player ${player + 1}'s Turn.`);
      };
      */
    });
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
    // Check if combo is valid
    if((previousPlayedCombo.length === 0 && validateCombo(combo, combination)) || (validateCombo(combo, combination) && compareCombo(previousPlayedCombo[previousPlayedCombo.length - 1].value, combo))) {
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

  const handleShowQty = () => {
    setShowQty(!showQty);
  }

  const handleRestartGame = () => {
    setDeck(shuffle(deck));
    shuffleDeck(false);
    showIntro(false);
    setPlayerTurn(0);
    setHands([]);
    setComboStatus(null);
    setCurrentTurnCombo('');
    setCurrentTurnLength(1);
    setPreviousPlayedCombo([]);
    setComboSelect('');
    setEndCycleClause(null);
    setWinnerClause(null);
    setNewRound(false);
    setTurnMessage('');
    setGameOverClause(null);
    setShowQty(false);
  }

  const shuffleBtn = deckIsShuffled ? null : <button className={gameStyles.shuffleBtn} onClick={onShuffleClick}>Shuffle Deck</button>;

  const listAiHands = hands.reduce((result, hand) => {
    if (hand.player !== 0) {
      result.push(hand);
    }
    return result;
  }, []).map((playerObj, idx) => {
    let roundMessage;
    if (playerObj.skipped) {
      roundMessage = 'PASSED!';
    } else if (playerObj.roundWin) {
      roundMessage = 'WINNER!';
    } else {
      roundMessage = '';
    }
    return (<li className={gameStyles.aiHand} key={idx}>
      <div className={playerObj.winner ? `${gameStyles.aiMobileHand} ${gameStyles.winner}` : gameStyles.aiMobileHand}>
        <h3>{`Player ${playerObj.player + 1}`}</h3>
        <div className={gameStyles.divMobileFaces}>
          <div className={showQty ? gameStyles.hide : gameStyles.cardFaceDown} onClick={handleShowQty}></div>
          <div className={showQty ? gameStyles.cardDisplay : gameStyles.hide} onClick={handleShowQty}>{playerObj.hand.length}</div>
        </div>
        {roundMessage &&
          <div className={gameStyles.roundMessage}>
            {playerObj.winner 
            ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className={gameStyles.star}><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
            : roundMessage}
          </div>}
      </div>
      {/*
      <div className={gameStyles.handContainer}>
        <div className={gameStyles.rotateDiv}>
          <h3>{`Player ${playerObj.player + 1}`}</h3>
          <div className={slackey.className}>{roundMessage}</div>
          <Hand cards={playerObj.hand} player={playerObj.player} passed={playerObj.skipped} />
        </div>
      </div>
      */}
    </li>);
  });

  let playerRoundMessage;

  if (hands.length && hands[0].skipped) {
    playerRoundMessage = 'PASSED!';
  } else if (hands.length && hands[0].roundWin) {
    playerRoundMessage = 'ROUND WINNER!';
  } else if (playerTurn === 0) {
    playerRoundMessage = 'Your Turn';
  } else {
    playerRoundMessage = '';
  }
  return (
    <div>
      {introIsVisible
        ? <div className={gameStyles.intro}>
          <p className={gameStyles.fade5}>Starting game.</p>
          <p className={gameStyles.fade10}>Shuffling deck...</p>
          <p className={gameStyles.showShuffle}>The deck has been shuffled and dealt. The first player to start is player {playerTurn + 1}</p>
        </div>
        : shuffleBtn}

      {deckIsShuffled &&
        <div className={gameStyles.gameDiv}>
          <div className={gameStyles.gameBoard}>
            <div className={gameStyles.middleDiv}>
              <div className={gameStyles.middlePile}>
                <h2>{currentTurnCombo && previousPlayedCombo.length ? `${currentTurnCombo}` : 'Middle Pile'}</h2>
                {previousPlayedCombo.length ?
                <Cards cards={previousPlayedCombo} /> :
                <div className={gameStyles.cardFaceDown}></div>}
              </div>
              {playerTurn !== 0 &&
              <h2 className={gameStyles.turnIndicator}>
                {endCycleClause || 
                <div>
                  <span>{turnMessage}</span>
                  {gameOverClause && <button className={gameStyles.btnPlayAgain} onClick={handleRestartGame}>Play Again?</button>}
                </div>}
              </h2>}
            </div>
            {listAiHands}
            <div className={gameStyles.containerUser}>
              {playerRoundMessage && <div className={handStyles.divYourTurn}>{playerRoundMessage}</div>}
              <Hand cards={hands[0].hand}
                playerTurn={playerTurn}
                comboIsValid={comboIsValid}
                requestCombo={requestCombo}
                currentTurnCombo={currentTurnCombo}
                passTurn={passTurn}
                changeCombo={changeCombo}
                middlePile={previousPlayedCombo}
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Game;