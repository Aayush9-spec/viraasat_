'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    if (value === undefined) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-4 w-24">
        <span className="text-4xl font-bold text-primary font-mono">{String(value).padStart(2, '0')}</span>
        <span className="text-xs uppercase text-muted-foreground tracking-widest">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex gap-4">
      {timerComponents.length ? timerComponents : <span>Event is starting soon!</span>}
    </div>
  );
};

export default CountdownTimer;
