import {  React, useState } from "react";
import styles from "@/app/page.module.css";
import { convertedHand } from "@/components/utilities/card";

// Prop
// Need to check if allowed to shed a card or not.
export const Hand = (takeTurn) => {
  const [hand, setHand] = useState(convertedHand);
  const [combo, setCombo] = useState([]);
  
  // Remove 1 card.
  const removeCard = (removedCard, e) => {
    e.preventDefault();
    const newHand = hand.filter((card) => (card.suit != removedCard.suit || card.rank != removedCard.rank) ? true : false);
    setHand(newHand);
  }

  // Use a flag to indicated selected/nonselected.
  // Dictionary for combo actions.
  // Need logic to handle the combo being accepted or denied.
  // Set up cypress
  // Logic to manipulate combo state.
  const selectCard = (selectedCard, e) => {
    console.log(`SelectedCard: ${selectedCard.rank} ${selectedCard.suit}`)
    e.preventDefault();

    // if no card has been selected for a combo, we add the card to the combo array.
    if (combo.length === 0) {
      console.log('Combo array is empty');
      setHand(hand.map((card) => {
        if (card.rank === selectedCard.rank && card.suit === selectedCard.suit) {
          card.selected = true;
        }
        return card;
      }));
      setCombo([...combo, { rank: selectedCard.rank, suit: selectedCard.suit }]);
      return;
    } else {
      // in this conditional, we have a combo array that has some card objects.
      console.log('Combo Array is not empty');

      // We need to check...    
      // Is the selectedCard in the combo
      let removedSelected = false;

      const newCombo = combo.filter((card) => {
        if (card.rank === selectedCard.rank && card.suit === selectedCard.suit) {
          // remove card from the combo.
          removedSelected = true;
          return false;
        } else {
          return true;
        }
      });

      if (removedSelected) {
        setHand(hand.map((card) => {
          if (card.rank === selectedCard.rank && card.suit === selectedCard.suit) {
            card.selected = false;
          }
          return card;
        }));
        setCombo(newCombo);
      } else {
        setHand(hand.map((card) => {
          if (card.rank === selectedCard.rank && card.suit === selectedCard.suit) {
            card.selected = true;
          }
          return card;
        }));
        setCombo([...newCombo, { rank: selectedCard.rank, suit: selectedCard.suit, selected: true }]);
      }      
    }
  }


  console.log('Combo', combo);
  const listOfCards = hand.map((card, idx) => {
    return (
      <li key={idx}>
        <div className={`${styles.card} ${card.selected && styles.selected}`} onClick={(e) => selectCard(card, e)}>
          <div className={styles.cardTopLeft}>
            <span>{card.rank}</span>
            <span>{card.suit}</span>
          </div>

          <div className={styles.cardBottomRight}>
            <span>{card.suit}</span>
            <span>{card.rank}</span>
          </div>
        </div>
      </li>
    );
  });

  const finalizeTurn = (e) => {
    e.preventDefault();
    takeTurn(combo);
  }

  return (
    <div>
      <ul className={styles.hand}>{listOfCards}</ul>
    </div>
  );
}