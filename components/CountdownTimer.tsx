import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, label }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="font-mono text-xs text-cyan-400/60 mb-2 uppercase tracking-widest">
        {label}
      </div>
      <div className="flex justify-center gap-4">
        {[
          { value: timeLeft.days, label: 'DAYS' },
          { value: timeLeft.hours, label: 'HRS' },
          { value: timeLeft.minutes, label: 'MIN' },
          { value: timeLeft.seconds, label: 'SEC' }
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div 
              className="font-mono text-3xl md:text-4xl font-bold tabular-nums"
              style={{ 
                color: '#06b6d4',
                textShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
              }}
            >
              {formatNumber(item.value)}
            </div>
            <div className="font-mono text-[10px] text-white/40 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CountdownTimer;