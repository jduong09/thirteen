"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/header/header.js';
import Game from '../components/game/game.js';

export default function Home() {
  const { theme, setTheme } = useTheme();
  console.log(theme);

  return (
    <main>
      <Header changeTheme={setTheme} theme={theme} />
      <Game />
    </main>
  );
}