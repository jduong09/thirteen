import Image from "next/image";
import styles from "./page.module.css";
import Game from '../components/game.js';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>Main Page.</div>
      <Game></Game>
    </main>
  );
}
