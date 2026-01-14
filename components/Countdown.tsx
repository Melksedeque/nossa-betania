'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date | string | null;
  onExpire?: () => void;
}

export function Countdown({ targetDate, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        if (onExpire) onExpire();
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (!targetDate) return <span className="text-slate-500">Sem data limite</span>;
  if (!timeLeft) return <span className="text-red-500 font-bold">Encerrado</span>;

  return (
    <div className="flex gap-2 text-xs font-mono text-orange-400 bg-orange-900/20 px-2 py-1 rounded border border-orange-500/30">
      <span title="Dias">{timeLeft.days}d</span>
      <span title="Horas">{timeLeft.hours.toString().padStart(2, '0')}h</span>
      <span title="Minutos">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
      <span title="Segundos">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
    </div>
  );
}
