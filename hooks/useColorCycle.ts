import { useState, useEffect } from 'react';

type AccentColor = 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink';

const COLORS: AccentColor[] = ['cyan', 'emerald', 'violet', 'amber', 'pink'];
const CYCLE_INTERVAL = 5000; // 5 seconds

export const useColorCycle = (): AccentColor => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % COLORS.length);
    }, CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return COLORS[currentIndex];
};
