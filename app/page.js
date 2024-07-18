"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Hand } from "@/components/gameComponents/hand.js";
import Game from '../components/game/game.js';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1>Hand</h1>
        <Hand />
      </div>
      <Game></Game>
    </main>
  );
}
