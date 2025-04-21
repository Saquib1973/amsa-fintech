import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { x: 0.5, y: 0.6 }
    });

  }, []);

  return null;
}