'use client';

import dynamic from 'next/dynamic';
import styles from './game.module.css';

// Dynamically import the PhaserGame component with no SSR
const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false
});

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className={styles['game-wrapper']}>
        <PhaserGame />
      </div>
    </main>
  );
} 