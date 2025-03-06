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
    </header>
  )
};

export default Header;