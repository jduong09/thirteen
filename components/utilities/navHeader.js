import React from 'react';
import pageStyles from '@/app/page.module.css';

const headers = {
  'cardRank': 'Card Ranks (High - Low)',
  'suitRank': 'Suit Ranks (High - Low)',
  'combinations': 'Valid Combinations',
  'smashes': 'Smashes',
  'gameplay': 'General Gameplay'
};

const NavHeader = ({ rules, handleClick, type }) => (
  <div className={pageStyles.navHeaders} onClick={() => handleClick(type)}>
    <h2>{headers[type]}</h2>
    <button className={rules.cardRank ? `${pageStyles.buttonCaret} ${pageStyles.divOpen}` : pageStyles.buttonCaret}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
    </button>
  </div>
)

export default NavHeader;