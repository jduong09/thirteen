import {  React, useState } from "react";
import styles from "@/app/page.module.css";

const icons = {
  'hearts': '♥',
  'diamonds': '♦',
  'spades': '♠',
  'clubs': '♣',
}

// Prop
// Need to check if allowed to shed a card or not.
const Hand = ({ cards, playerTurn, comboIsValid, requestCombo, passTurn }) => {
  const [hand, setHand] = useState(cards);
  const [combo, setCombo] = useState([]);
  const [hasReset, resetCombo] = useState(false);
  const isMyTurn = playerTurn === 0;

  // FIXME: I don't love that I had to use a dumb hasReset flag to get this to work...
  if(!isMyTurn && !hasReset) {
    // Reset selected cards
    hand.forEach(card => card.selected = false);
    setCombo([]);
    resetCombo(true);
  }
  
  // Remove 1 card.
  const removeCard = (removedCard, e) => {
    e.preventDefault();
    const newHand = hand.filter((card) => (card.value != removedCard.value) ? true : false);
    setHand(newHand);
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

    requestCombo(combo.map((card) => { return { number: card.number, suite: card.suite, value: card.value } }));
  } 

  const listOfCards = hand.map((card, idx) => {
    return (
      <li key={idx}>
        <div className={`${styles.card} ${card.selected && styles.selected}`} onClick={(e) => selectCard(card, e)}>
          <div className={styles.cardTopLeft}>
            <span>{card.number}</span>
            <span>{icons[card.suite]}</span>
          </div>
          <div className={styles.cardBottomRight}>
            <span>{icons[card.suite]}</span>
            <span>{card.number}</span>
          </div>
        </div>
      </li>
    );
  });

  return (
    <div>
      <ul className={styles.hand}>{listOfCards}</ul>
      {comboIsValid === false && <div>Invalid Combo. Try a different combo or pass.</div>}
      <div className={styles.handBtns}>
        <button disabled={!isMyTurn} onClick={finalizeTurn}>Finalize Turn</button>
        <button disabled={!isMyTurn} onClick={() => passTurn()}>Pass Turn</button>
      </div>
    </div>
  );
}

export default Hand;