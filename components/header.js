'use client';
import React, { useState } from 'react';
import pageStyles from '../app/page.module.css';
import { icons } from '@/components/utilities/card';

const Header = () => {
  const [headerRules, setHeaderRules] = useState({ cardRank: false, suitRank: false, combinations: false, smashes: false });

  const handleClick = (type) => {
    setHeaderRules({
      ...headerRules,
      [type]: !headerRules[type],
    });
  }

  return (
    <header className={pageStyles.header}>
      <h1>Thirteen</h1>
      <nav>
        <ul>
          <li><button>Rules</button></li>
          <li><button>Dark Mode</button></li>
        </ul>
      </nav>
      <div className={pageStyles.rules}>
        <div className={pageStyles.cardRanks}>
          <div className={pageStyles.navHeaders}>
            <h2>Card Ranks (High - Low)</h2>
            <button className={headerRules.cardRank ? `${pageStyles.buttonCaret} ${pageStyles.divOpen}` : pageStyles.buttonCaret} onClick={e => handleClick('cardRank')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </button>
          </div>
          <div className={headerRules.cardRank ? pageStyles.listCardRank : pageStyles.hide}>2 A K Q J 10 9 8 7 6 5 4 3 2 1</div>
        </div>
        <div className={pageStyles.suitRanks}>
          <div className={pageStyles.navHeaders}>
            <h2>Suit Ranks (High - Low)</h2>
            <button className={headerRules.suitRank ? `${pageStyles.buttonCaret} ${pageStyles.divOpen}` : pageStyles.buttonCaret} onClick={e => handleClick('suitRank')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </button>
          </div>
          <div className={headerRules.suitRank ? pageStyles.listCardRank : pageStyles.hide}>Hearts - Diamonds - Clubs - Spades</div>
        </div>
        <div className={pageStyles.ruleCombinations}>
          <div className={pageStyles.navHeaders}>
            <h2>Valid Combinations</h2>
            <button className={headerRules.combinations ? `${pageStyles.buttonCaret} ${pageStyles.divOpen}` : pageStyles.buttonCaret} onClick={e => handleClick('combinations')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </button>
          </div>
          <div className={headerRules.combinations ? pageStyles.listCardRank : pageStyles.hide}>
            <div>Lead player will play valid combination, and subsequent players must follow combination or pass.</div>
            <ul className={pageStyles.listCombinations}>
              <li>
                <h3>Single</h3>
                <div>{`J ${icons['clubs']}`}</div>
              </li>
              <li>
                <h3>Pair</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`J ${icons['spades']}`}</li>
                    <li>{`J ${icons['hearts']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>Three of a Kind</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`3 ${icons['spades']}`}</li>
                    <li>{`3 ${icons['hearts']}`}</li>
                    <li>{`3 ${icons['clubs']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>Four of a Kind</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`4 ${icons['spades']}`}</li>
                    <li>{`4 ${icons['hearts']}`}</li>
                    <li>{`4 ${icons['clubs']}`}</li>
                    <li>{`4 ${icons['diamonds']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>Sequence (3 or More Cards)</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`3 ${icons['spades']}`}</li>
                    <li>{`4 ${icons['spades']}`}</li>
                    <li>{`5 ${icons['clubs']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>Double Sequence (3 or More Pairs of Cards)</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`7 ${icons['spades']}`}</li>
                    <li>{`7 ${icons['hearts']}`}</li>
                    <li>{`8 ${icons['clubs']}`}</li>
                    <li>{`3 ${icons['spades']}`}</li>
                    <li>{`9 ${icons['spades']}`}</li>
                    <li>{`9 ${icons['clubs']}`}</li>
                  </ul>
                </div>
              </li>
            </ul>
            <div>Note: To beat someone's combination, the highest card in challenger's combination must beat the previous played highest card.</div>
          </div>
        </div>
        <div className={pageStyles.smashes}>
          <div className={pageStyles.navHeaders}>
            <h2>Smashes</h2>
            <button className={headerRules.smashes ? `${pageStyles.buttonCaret} ${pageStyles.divOpen}` : pageStyles.buttonCaret} onClick={e => handleClick('smashes')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </button>
          </div>
          <div className={headerRules.smashes ? pageStyles.listCardRank : pageStyles.hide}>hello</div>
        </div>
      </div>
    </header>
  )
};

export default Header;