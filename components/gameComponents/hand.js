import { useState } from 'react';
import styles from "@/app/page.module.css";
import { convertedHand } from '@/components/utilities/card';

export const Hand = () => {
  const [hand, setHand] = useState(convertedHand);

  const listOfCards = hand.map((card, idx) => {
    return (
      <li key={idx}>
        <div className={styles.card}>
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