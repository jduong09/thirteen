import React from 'react';
import pageStyles from '../app/page.module.css';

const Header = () => {
  return (
    <header className={pageStyles.header}>
      <h1>Thirteen</h1>
      <nav>
        <ul>
          <li><button>Rules</button></li>
          <li><button>Dark Mode</button></li>
        </ul>
      </nav>
      <div>
        <div className={pageStyles.ruleRanks}>
          <h2>Card Ranks (High - Low)</h2>
          <div>2 A K Q J 10 9 8 7 6 5 4 3 2 1</div>
          <h2>Suit Ranks (High - Low)</h2>
          <div>Hearts - Diamonds - Clubs - Spades</div>
        </div>
        <div className={pageStyles.ruleCombinations}>
          <h2>Valid Combinations</h2>
          <div>Lead player will play valid combination, and subsequent players must follow combination or pass.</div>
          <ul>
            <li>
              <h3>Single</h3>
              <div>9 Clubs</div>
            </li>
            <li>
              <h3>Pair</h3>
              <div>
                <ul>
                  <li>Jack Spades</li>
                  <li>Jack Hearts</li>
                </ul>
              </div>
            </li>
            <li>
              <h3>Three of a Kind</h3>
              <div>
                <ul>
                  <li>3 Spades</li>
                  <li>3 Hearts</li>
                  <li>3 Clubs</li>
                </ul>
              </div>
            </li>
            <li>
              <h3>Four of a Kind</h3>
              <div>
                <ul>
                  <li>4 Spades</li>
                  <li>4 Hearts</li>
                  <li>4 Clubs</li>
                  <li>4 Diamonds</li>
                </ul>
              </div>
            </li>
            <li>
              <h3>Sequence (3 or More Cards)</h3>
              <div>
                <ul>
                  <li>3 Spades</li>
                  <li>4 Spades</li>
                  <li>5 Clubs</li>
                </ul>
              </div>
            </li>
            <li>
              <h3>Double Sequence (3 or More Pairs of Cards)</h3>
              <div>
                <ul>
                  <li>7 Spades</li>
                  <li>7 Hearts</li>
                  <li>8 Clubs</li>
                  <li>8 Spades</li>
                  <li>9 Spades</li>
                  <li>9 Clubs</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div>Note: To beat someones combination, the highest card in challenger's combination must beat the previous played highest card.</div>
      </div>
    </header>
  )
};

export default Header;