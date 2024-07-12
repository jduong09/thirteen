import {  useState } from 'react';
import styles from "@/app/page.module.css";
import { convertedHand } from '@/components/utilities/card';

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

  // Logic to manipulate combo state.
  const selectCard = (idx, e) => {
    e.preventDefault();
    const newCombo = (combo.length === 0 || !combo.includes(idx))
      ? [...combo, idx]
      : combo.filter((cardIdx) => cardIdx !== idx);

    setCombo(newCombo);
  }

  const listOfCards = hand.map((card, idx) => {
    return (
      <li key={idx}>
        <div className={`${styles.card} ${combo.includes(idx) && styles.selected}`} onClick={(e) => selectCard(idx, e)}>
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

  return (
    <div>
      <ul className={styles.hand}>{listOfCards}</ul>
      <div>
        <button>Finalize Turn</button>
        <button>Pass</button>
      </div>
    </div>
  );
}