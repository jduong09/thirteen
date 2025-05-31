"use client";
import React, { useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Header from '@/components/header/header.js';
import Game from '../components/game/game.js';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const changeTheme = () => {
    setDarkMode(!darkMode);
    console.log(darkMode);
  }

  return (
    <main className={`${(darkMode ? 'theme-dark' : 'theme-default')}`}>
      <Header changeTheme={changeTheme} darkMode={darkMode} />
      <Game />
    </main>
  );
}