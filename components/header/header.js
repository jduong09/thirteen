'use client';
import React, { useState } from 'react';
import headerStyles from '@/components/header/header.module.scss';
import { icons } from '@/components/utilities/card';
import NavHeader from '@/components/utilities/navHeader';

const Header = ({ changeTheme, darkMode }) => {
  const [headerRules, setHeaderRules] = useState({ cardRank: false, suitRank: false, combinations: false, smashes: false, gameplay: false });
  const [toggleRules, setToggleRules] = useState(false);

  const handleClick = (type) => {
    setHeaderRules({
      ...headerRules,
      [type]: !headerRules[type],
    });
  }

  const cardElem = ([num, suit], key) => {
    let elemClass = headerStyles.headerCard;
    if(['hearts', 'diamonds'].includes(suit)) {
      elemClass = `${headerStyles.red} ${headerStyles.headerCard}`;
    } else {
      elemClass = `${headerStyles.headerCard}`;
    }
    return <li key={key} className={elemClass}>{`${num} ${icons[suit]}`}</li>
  }

  const listPair = [['J', 'spades'], ['J', 'hearts']].map((ele, i) => cardElem(ele, i));
  const listTriplet = [['3', 'spades'], ['3', 'hearts'], ['3', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listQuartet = [['4', 'spades'], ['4', 'hearts'], ['4', 'clubs'], ['4', 'diamonds']].map((ele, i) => cardElem(ele, i));
  const listSequence = [['3', 'spades'], ['4', 'spades'], ['5', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listDoubleSequence = [['7', 'spades'], ['7', 'hearts'], ['8', 'clubs'], ['8', 'spades'], ['9', 'spades'], ['9', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listSmashOne = [['7', 'spades'], ['7', 'hearts'], ['8', 'clubs'], ['8', 'spades'], ['9', 'spades'], ['9', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listSmashTwo = [['7', 'spades'], ['7', 'hearts'], ['7', 'clubs'], ['7', 'diamonds']].map((ele, i) => cardElem(ele, i));
  const listSmashThree = [['10', 'spades'], ['10', 'hearts'], ['J', 'clubs'], ['J', 'spades'], ['Q', 'spades'], ['Q', 'clubs'], ['K', 'spades'], ['K', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listSmashFour = [['5', 'spades'], ['5', 'hearts'], ['5', 'clubs'], ['5', 'diamonds']].map((ele, i) => cardElem(ele, i));
  const listSmashFive = [['3', 'spades'], ['3', 'hearts'], ['4', 'clubs'], ['4', 'spades'], ['5', 'spades'], ['5', 'clubs'], ['6', 'spades'], ['6', 'clubs'], ['7', 'spades'], ['7', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listGameplayOne = [['5', 'spades'], ['5', 'hearts'], ['5', 'clubs']].map((ele, i) => cardElem(ele, i));
  const listGameplayTwo = [['3', 'spades'], ['3', 'hearts'], ['3', 'clubs']].map((ele, i) => cardElem(ele, i));

  return (
    <header className={`${darkMode ? headerStyles.themedark : headerStyles.themedefault} ${headerStyles.header}`}>
      <h1>Thirteen</h1>
      <nav>
        <ul>
          <li><button onClick={() => setToggleRules(true)}>Rules</button></li>
          <li><button onClick={() => changeTheme()}>Dark Mode</button></li>
        </ul>
      </nav>
      <div className={toggleRules ? headerStyles.rules : headerStyles.hide}>
        <div className={headerStyles.rulesHeader}>
          <h2>Rules</h2>
          <button onClick={() => setToggleRules(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </button>
        </div>
        <div className={headerStyles.cardRanks}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'cardRank'} />
          <div className={headerRules.cardRank ? `${headerStyles.listCardRank} ${headerStyles.ruleContent}` : headerStyles.hide}>2 A K Q J 10 9 8 7 6 5 4 3</div>
        </div>
        <div className={headerStyles.suitRanks}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'suitRank'} />
          <div className={headerRules.suitRank ? `${headerStyles.listCardRank} ${headerStyles.ruleContent}` : headerStyles.hide}>Hearts - Diamonds - Clubs - Spades</div>
        </div>
        <div className={headerStyles.ruleCombinations}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'combinations'} />
          <div className={headerRules.combinations ? `${headerStyles.listCardRank} ${headerStyles.ruleContent}` : headerStyles.hide}>
            <div>Lead player will play valid combination, and subsequent players must follow combination or pass.</div>
            <ul className={headerStyles.listCombinations}>
              <li>
                <h3>Single</h3>
                <div className={headerStyles.headerCard}>{`J ${icons['clubs']}`}</div>
              </li>
              <li>
                <h3>Pair</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listPair}</ul>
                </div>
              </li>
              <li>
                <h3>Three of a Kind</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listTriplet}</ul>
                </div>
              </li>
              <li>
                <h3>Four of a Kind</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listQuartet}</ul>
                </div>
              </li>
              <li>
                <h3>Sequence (3 or More Cards)</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listSequence}</ul>
                </div>
              </li>
              <li>
                <h3>Double Sequence (3 or More Pairs of Cards)</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listDoubleSequence}</ul>
                </div>
              </li>
            </ul>
            <div><b>NOTE:</b> To beat someone&apos;s combination, the highest card in challenger&apos;s combination must beat the previous played highest card.</div>
          </div>
        </div>
        <div className={headerStyles.smashes}>
          <NavHeader handleClick={handleClick} rules={headerRules} type={'smashes'} />
          <div className={headerRules.smashes ? `${headerStyles.listCardRank} ${headerStyles.ruleContent}` : headerStyles.hide}>
            <div>Smashes can be used when the previous player has played a single, pair or triplet of 2s.</div>
            <ul className={headerStyles.listSmashes}>
              <li>
                <h3>A single 2 can be beaten by a double sequence of 3+ pairs or a quartet</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listSmashOne}</ul>
                  <ul className={headerStyles.listHands}>{listSmashTwo}</ul>
                </div>
              </li>
              <li>
                <h3>A pair of 2s can be beaten by a double sequence of 4+ pairs or a quartet</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listSmashThree}</ul>
                  <ul className={headerStyles.listHands}>{listSmashFour}</ul>
                </div>
              </li>
              <li>
                <h3>A triplet of 2s can only be beaten by a double sequence of 5+ pairs</h3>
                <div>
                  <ul className={headerStyles.listHands}>{listSmashFive}</ul>
                </div>
              </li>
            </ul>
            <div><b>NOTE:</b> Once a smash has been played, its combination type becomes what needs to be beaten by the next player.</div>
          </div>
          </div>
          <div className={headerStyles.gameplay}>
            <NavHeader handleClick={handleClick} rules={headerRules} type={'gameplay'} />
            <div className={headerRules.gameplay ? `${headerStyles.listCardRank} ${headerStyles.ruleContent}` : headerStyles.hide}>
              <ul className={headerStyles.listGameplay}>
                <li>
                  <h3>Leading</h3>
                  <div>The first turn of the game will go to the player with the <span className={headerStyles.inlineCard}>{`J ${icons['clubs']}`}</span>. That player MUST play a hand containing the <span className={headerStyles.inlineCard}>{`J ${icons['clubs']}`}</span>. In following turns the player with lead can play any combination they choose.</div>
                </li>
                <li className={headerStyles.following}>
                  <h3>Following</h3>
                  <div>During a player&apos;s turn, they can pass or play, based on if they have a combination of cards that strictly match the combination type of the middle pile. The key is to match the combination type, and have the highest card of the hand be higher value than the middle pile&apos;s highest card.</div>
                  <div>The example below has the first hand beating the second because the <span className={headerStyles.inlineCard}>{`5 ${icons['hearts']}`}</span> is higher value than <span className={headerStyles.inlineCard}>{`3 ${icons['hearts']}`}</span>
                    <div className={headerStyles.followingComparison}>
                      <ul className={headerStyles.listHands}>{listGameplayOne}</ul> &gt; 
                      <ul className={headerStyles.listHands}>{listGameplayTwo}</ul>
                    </div>
                    <div className={headerStyles.followingComparison}>
                      <div className={`${headerStyles.red} ${headerStyles.headerCard}`}>{`5 ${icons['hearts']}`}</div> &gt;
                      <div className={`${headerStyles.red} ${headerStyles.headerCard}`}>{`3 ${icons['hearts']}`}</div>
                    </div>
                  </div>
                  <div><b>NOTE:</b> The exception to the strictly matching of combinations is the use of smashes.</div>
                </li>
                <li>
                  <h3>Round Over and Game Over</h3>
                  <div>A round is over when 3 players have passed, with the remaining player as the round winner. That player will lead the next round, with the combination of their choice. The game is over when 1 player has ran out of cards, effectively becoming the winner.</div>
                </li>
              </ul>
          </div>
        </div>
      </div>
      <div className={toggleRules ? headerStyles.background : headerStyles.hide}></div>
    </header>
  )
};

export default Header;