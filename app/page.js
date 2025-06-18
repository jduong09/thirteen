"use client";
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/header/header.js';
import Game from '../components/game/game.js';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, []);

  if (!mounted) {
    return false;
  }
  
  return (
    <main>
      <Header changeTheme={setTheme} theme={theme} />
      <Game />
    </main>
  );
}