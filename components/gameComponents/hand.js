import { useState } from 'react';
import styles from "@/app/page.module.css";
import { convertedHand } from '@/components/utilities/card';

// Prop
// Need to check if allowed to shed a card or not.
export const Hand = () => {
  const [hand, setHand] = useState(convertedHand);

  // Remove 1 card.
  const removeCard = (removedCard, e) => {
    e.preventDefault();
    const newHand = hand.filter((card) => (card.suit != removedCard.suit || card.rank != removedCard.rank) ? true : false);
    setHand(newHand);
  }

  // Need logic to remove combos.
  // State to accumulate users turn.

  const listOfCards = hand.map((card, idx) => {
    return (
      <li key={idx}>
        <div className={styles.card} onClick={(e) => removeCard(card, e)}>
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
    )
  });

  return <ul className={styles.hand}>{listOfCards}</ul>;
}