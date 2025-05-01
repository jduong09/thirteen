import {  React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import handStyles from "@/components/hand/hands.module.scss";
import Cards from "@/components/cards/cards";
import { determineCombination } from "../utilities/combination";

const Hand = ({ skipped, player, cards, playerTurn, comboIsValid, requestCombo, passTurn, changeCombo, setTurnMessage, firstTurnClause }) => {
  const [hand, setHand] = useState(cards);
  const [combo, setCombo] = useState([]);
  const [hasReset, resetCombo] = useState(false);
  const [sortType, setSortType] = useState(null);
  const isMyTurn = playerTurn === 0;

  const resetHand = () => {
    hand.forEach(card => card.selected = false);
    setCombo([]);
    resetCombo(true);
  }

  // Update hand after changes.
  useEffect(() => {
    setHand(cards);
  }, [cards])

  /**
   * @description Sorts the player's hand by groups (quadruplet, triplet, double) or by strength of card.
   * @param {'groups'|'value'} sortType
   */
  const sortPlayerCards = (sortType) => {
    if (sortType === 'groups') {
      // Group by quadruplets, triplets, and double first
      const cardGrouping = hand.reduce((acc, card) => {
        if (acc[card.number]) {
          acc[card.number].push(card);
        } else {
          acc[card.number] = [card];
        }
        return acc;
      }, {});
      // Assign values 4, 3, 2, 1 to groups for primary sort
      Object.values(cardGrouping).forEach(group => group.forEach(card => card.group = group.length));
      // Secondary sort by value
      hand.sort((a, b) => a.group === b.group ? b.value - a.value : b.group - a.group);
    } else if (sortType === 'value') {
      hand.sort((a, b) => b.value - a.value);
    }
    setSortType(sortType);
    setHand(hand);
  }

  // FIXME: I don't love that I had to use a dumb hasReset flag to get this to work...
  if (!isMyTurn && !hasReset) {
    // Reset selected cards
    resetHand();
  }
  
  // Use a flag to indicated selected/nonselected.
  // Dictionary for combo actions.
  // Need logic to handle the combo being accepted or denied.
  // Set up cypress
  // Logic to manipulate combo state.
  // Game send function to hand to ask for combo.
  const selectCard = (selectedCard, e) => {
    e.preventDefault();

    // if no card has been selected for a combo, we add the card to the combo array.
    if (combo.length === 0) {
      setHand(hand.map((card) => {
        if (card.value === selectedCard.value) {
          card.selected = true;
        }
        return card;
      }));
      setCombo([...combo, { number: selectedCard.number, suite: selectedCard.suite, value: selectedCard.value  }]);
      return;
    } else {
      // in this conditional, we have a combo array that has some card objects.
      // We need to check...    
      // Is the selectedCard in the combo
      let removedSelected = false;

      const newCombo = combo.filter((card) => {
        if (card.value === selectedCard.value) {
          // remove card from the combo.
          removedSelected = true;
          return false;
        } else {
          return true;
        }
      });

      if (removedSelected) {
        setHand(hand.map((card) => {
          if (card.value === selectedCard.value) {
            card.selected = false;
          }
          return card;
        }));
        setCombo(newCombo);
      } else {
        setHand(hand.map((card) => {
          if (card.value === selectedCard.value) {
            card.selected = true;
          }
          return card;
        }));
        setCombo([...newCombo, { number: selectedCard.number, suite: selectedCard.suite, value: selectedCard.value, selected: true }]);
      }
    }
  }

  const finalizeTurn = (e) => {
    e.preventDefault();

    if (!combo.length) {
      setTurnMessage('User submitted nothing. Invalid Combo.');
      return;
    }

    // Commented Out so we can test that determineCombination function is working.
    if (firstTurnClause && !combo.filter((card) => card.value === 1).length) {
      setTurnMessage('Combo must contain 3 of Spades. Invalid Combo.');
      return;
    }

    const validCombo = determineCombination(combo);
    if (validCombo) {
      changeCombo(validCombo);
      requestCombo(combo.map((card) => { return { number: card.number, suite: card.suite, value: card.value } }), validCombo);
    } else {
      return;
    }
    resetHand();
  }

  return (
    <div className={handStyles.divUserHand}>
      <div className={handStyles.handHeader}>
        <h3>Your Hand</h3>
        {(playerTurn !== player && skipped) && <div className={handStyles.badgePassed}>P</div>}
        <select disabled={!isMyTurn} onChange={(e) => {sortPlayerCards(e.target.value)}} className={handStyles.select} defaultValue={'default'}>
          <option value="default" disabled>Sort...</option>
          <option value="groups">Groups</option>
          <option value="value">Strength</option>
        </select>
      </div>
      <div className={handStyles.divHand}>
        <Cards cards={hand} selectCard={selectCard} />
        {comboIsValid === false && <div className={handStyles.invalidCombo}>Invalid Combo. Try a different combo or press Change Combo Type.</div>}
        {isMyTurn &&
        <div className={handStyles.handBtns}>
          <button disabled={!isMyTurn} onClick={() => passTurn(playerTurn)}>Pass</button>
          <button disabled={!isMyTurn} onClick={finalizeTurn}>Play</button>
        </div>}
      </div>
    </div>
  );
}

export default Hand;

Hand.propTypes = {
  cards: PropTypes.array,
  playerTurn: PropTypes.number,
  comboIsValid: PropTypes.func,
  requestCombo: PropTypes.func,
  currentTurnCombo: PropTypes.string,
  passTurn: PropTypes.func,
};