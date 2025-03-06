"use client";
import React from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Header from '@/components/header';
import Game from '../components/game/game.js';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header></Header>
      <Game></Game>
    </main>
  );
}
