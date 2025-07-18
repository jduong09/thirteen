import React from "react";
import PropTypes from "prop-types";
import cardStyles from "./cards.module.scss";
import { mapCard, icons } from "../utilities/card";

const Cards = ({ cards, selectCard }) => {
  const listOfCards = cards.map((card, idx) => {
    const cardDisplay = mapCard(card.number);
    const isRed = ['hearts', 'diamonds'].includes(card.suite); // NOTE: This is just temporary for now to visually distinguish red cards.
    return (
      <li key={idx}>
        <div className={`${cardStyles.card} ${card.selected && cardStyles.selected}`} onClick={(e) => selectCard(card, e)}>
          <div className={`${cardStyles.cardTopLeft} ${isRed && cardStyles.red}`}>
            <span>{cardDisplay}</span>
            <span>{icons[card.suite]}</span>
          </div>
          <div className={`${cardStyles.cardBottomRight} ${isRed && cardStyles.red}`}>
            <span>{icons[card.suite]}</span>
            <span>{cardDisplay}</span>
          </div>
        </div>
      </li>
    );
  });

  return (
    <ul className={cardStyles.hand}>
      {listOfCards}
    </ul>
  );
};

export default Cards;

Cards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      selected: PropTypes.bool,
      suite: PropTypes.string,
      rank: PropTypes.number,
    })
  ),
  selectCard: PropTypes.func
}