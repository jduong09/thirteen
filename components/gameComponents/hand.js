import {  React, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from "@/app/page.module.css";
import gameStyles from '../game/game.module.scss';
import Cards from "@/components/cards/cards";

const Hand = ({ cards, playerTurn, comboIsValid, requestCombo, currentTurnCombo, passTurn, passed }) => {
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
      console.log('Hand submitted nothing, combo not sent to game component.');
      return;
    }
    requestCombo(combo.map((card) => { return { number: card.number, suite: card.suite, value: card.value } }), currentTurnCombo);
    resetHand();
  }

  // Line 122: Removed sentence 'Try a different combo or pass' and replaced with 'Try a different combo or press Change Combo Type' for this PR specifically.
  return (
    <div className={gameStyles.divUserHand}>
      <h3>Me</h3>
      <div className={gameStyles.divSortBtns}>
        <button onClick={() => sortPlayerCards("groups")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8L32 224c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>
        </button>
        <button onClick={() => sortPlayerCards("value")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M160 32c9 0 17.5 3.8 23.6 10.4l88 96c11.9 13 11.1 33.3-2 45.2s-33.3 11.1-45.2-2L192 146.3 192 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-301.7L95.6 181.6c-11.9 13-32.2 13.9-45.2 2s-13.9-32.2-2-45.2l88-96C142.5 35.8 151 32 160 32zM450.7 294c8.3 6 13.3 15.7 13.3 26l0 96 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-48 0-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-51.6-5.9 2c-16.8 5.6-34.9-3.5-40.5-20.2s3.5-34.9 20.2-40.5l48-16c9.8-3.3 20.5-1.6 28.8 4.4zm-5-145.1A32 32 0 1 0 418.3 91a32 32 0 1 0 27.4 57.9zm-40.7 54.9C369.6 192.4 344 159.2 344 120c0-48.6 39.4-88 88-88s88 39.4 88 88c0 23.5-7.5 46.3-21.5 65.2L449.7 251c-10.5 14.2-30.6 17.2-44.8 6.7s-17.2-30.6-6.7-44.8l6.8-9.2z"/></svg>
        </button>
      </div>
      <div className={gameStyles.divHand}>
        <Cards cards={hand} selectCard={selectCard} />
        {comboIsValid === false && <div>Invalid Combo. Try a different combo or press Change Combo Type.</div>}
        {isMyTurn &&
        <div className={styles.handBtns}>
          <section className={styles.BtnsAction}>
            <button disabled={!isMyTurn} onClick={finalizeTurn}>Finalize Turn</button>
            <button disabled={!isMyTurn} onClick={() => passTurn(playerTurn)}>Pass Turn</button>
          </section>
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