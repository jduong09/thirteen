'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { Hand } from '@/components/gameComponents/hand.js';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1>Hand</h1>
        <Hand />
      </div>
    </main>
  );
}
