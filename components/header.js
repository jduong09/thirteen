'use client';
import React, { useState } from 'react';
import pageStyles from '../app/page.module.css';
import { icons } from '@/components/utilities/card';
import NavHeader from './utilities/navHeader';

const Header = () => {
  const [headerRules, setHeaderRules] = useState({ cardRank: false, suitRank: false, combinations: false, smashes: false, gameplay: false });
  const [toggleRules, setToggleRules] = useState(false);

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
          <li><button onClick={() => setToggleRules(true)}>Rules</button></li>
          <li><button>Dark Mode</button></li>
        </ul>
      </nav>
      <div className={toggleRules ? pageStyles.rules : pageStyles.hide}>
        <div className={pageStyles.rulesHeader}>
          <h2>Rules</h2>
          <button onClick={() => setToggleRules(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </button>
        </div>
        <div className={pageStyles.cardRanks}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'cardRank'} />
          <div className={headerRules.cardRank ? `${pageStyles.listCardRank} ${pageStyles.ruleContent}` : pageStyles.hide}>2 A K Q J 10 9 8 7 6 5 4 3 2 1</div>
        </div>
        <div className={pageStyles.suitRanks}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'suitRank'} />
          <div className={headerRules.suitRank ? `${pageStyles.listCardRank} ${pageStyles.ruleContent}` : pageStyles.hide}>Hearts - Diamonds - Clubs - Spades</div>
        </div>
        <div className={pageStyles.ruleCombinations}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'combinations'} />
          <div className={headerRules.combinations ? `${pageStyles.listCardRank} ${pageStyles.ruleContent}` : pageStyles.hide}>
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
                    <li className={pageStyles.red}>{`J ${icons['hearts']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>Three of a Kind</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`3 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`3 ${icons['hearts']}`}</li>
                    <li>{`3 ${icons['clubs']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>Four of a Kind</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`4 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`4 ${icons['hearts']}`}</li>
                    <li>{`4 ${icons['clubs']}`}</li>
                    <li className={pageStyles.red}>{`4 ${icons['diamonds']}`}</li>
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
                    <li>{`8 ${icons['spades']}`}</li>
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
          <NavHeader handleClick={handleClick} rules={headerRules} type={'smashes'} />
          <div className={headerRules.smashes ? `${pageStyles.listCardRank} ${pageStyles.ruleContent}` : pageStyles.hide}>
            <div>Smashes can be used when the previous player has played a single, pair or triplet of 2s.</div>
            <ul className={pageStyles.listSmashes}>
              <li>
                <h3>A single 2 can be beaten by a double sequence of 3+ pairs or a quartet</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`7 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`7 ${icons['hearts']}`}</li>
                    <li>{`8 ${icons['clubs']}`}</li>
                    <li>{`8 ${icons['spades']}`}</li>
                    <li>{`9 ${icons['spades']}`}</li>
                    <li>{`9 ${icons['clubs']}`}</li>
                  </ul>
                  <ul className={pageStyles.listHands}>
                    <li>{`7 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`7 ${icons['hearts']}`}</li>
                    <li>{`7 ${icons['clubs']}`}</li>
                    <li className={pageStyles.red}>{`7 ${icons['diamonds']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>A pair of 2s can be beaten by a double sequence of 4+ pairs or a quartet</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`10 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`10 ${icons['hearts']}`}</li>
                    <li>{`J ${icons['clubs']}`}</li>
                    <li>{`J ${icons['spades']}`}</li>
                    <li>{`Q ${icons['spades']}`}</li>
                    <li>{`Q ${icons['clubs']}`}</li>
                    <li>{`K ${icons['spades']}`}</li>
                    <li>{`K ${icons['clubs']}`}</li>
                  </ul>
                  <ul className={pageStyles.listHands}>
                    <li>{`5 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`5 ${icons['hearts']}`}</li>
                    <li>{`5 ${icons['clubs']}`}</li>
                    <li className={pageStyles.red}>{`5 ${icons['diamonds']}`}</li>
                  </ul>
                </div>
              </li>
              <li>
                <h3>A triplet of 2s can only be beaten by a double sequence of 5+ pairs</h3>
                <div>
                  <ul className={pageStyles.listHands}>
                    <li>{`3 ${icons['spades']}`}</li>
                    <li className={pageStyles.red}>{`3 ${icons['hearts']}`}</li>
                    <li>{`4 ${icons['clubs']}`}</li>
                    <li>{`4 ${icons['spades']}`}</li>
                    <li>{`5 ${icons['spades']}`}</li>
                    <li>{`5 ${icons['clubs']}`}</li>
                    <li>{`6 ${icons['spades']}`}</li>
                    <li>{`6 ${icons['clubs']}`}</li>
                    <li>{`7 ${icons['spades']}`}</li>
                    <li>{`7 ${icons['clubs']}`}</li>
                  </ul>
                </div>
              </li>
            </ul>
            <div>NOTE: Once a smash has been played, its combination type becomes what needs to be beaten by the next player.</div>
          </div>
          </div>
          <div className={pageStyles.gameplay}>
            <NavHeader handleClick={handleClick} rules={headerRules} type={'gameplay'} />
            <div className={headerRules.gameplay ? `${pageStyles.listCardRank} ${pageStyles.ruleContent}` : pageStyles.hide}>
              <ul className={pageStyles.listGameplay}>
                <li>
                  <h3>Leading</h3>
                  <div>The first turn of the game will go to the player with the 3 of Spades. That player MUST play a hand containing the 3 of Spades. In following hands, the player with lead can play any combination they choose.</div>
                </li>
                <li>
                  <h3>Following</h3>
                  <div>During a player's turn, they can pass or play, based on if they have a combination of cards that strictly match the combination type of the middle pile. The key is to match the combination type, and have the highest card of the hand be higher value than the middle pile's highest card.</div>
                  <div>A triplet can only be beaten by a triplet, where <ul className={pageStyles.listHands}><li>{`5 ${icons['spades']}`}</li><li>{`5 ${icons['hearts']}`}</li><li>{`5 ${icons['clubs']}`}</li></ul> beats <ul className={pageStyles.listHands}><li>{`3 ${icons['spades']}`}</li><li>{`3 ${icons['hearts']}`}</li><li>{`3 ${icons['clubs']}`}</li></ul></div> because <div>{`5 ${icons['hearts']}`}</div> &gt; <div>{`3 ${icons['hearts']}`}</div>
                  <div>The exception to the strictly matching of combinations is the use of smashes.</div>
                </li>
                <li>
                  <h3>Round Over and Game Over</h3>
                  <div>A round is over when 3 players have passed, with the remaining player as the round winner. That player will lead the next round, with the combination of their choice. The game is over when 1 player has ran out of cards, effectively becoming the winner.</div>
                </li>
              </ul>
          </div>
        </div>
      </div>
      <div className={toggleRules ? pageStyles.background : pageStyles.hide}></div>
    </header>
  )
};

export default Header;