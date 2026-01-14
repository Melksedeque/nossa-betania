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

  if (!targetDate) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-xs font-mono text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Sem data limite
      </span>
    );
  }

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/60 bg-red-900/30 px-3 py-1 text-xs font-mono text-red-300">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Encerrado
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/60 bg-orange-900/40 px-3 py-1 text-xs font-mono text-orange-200 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
      <span title="Dias" className="hidden sm:inline">
        {timeLeft.days}d
      </span>
      <span title="Horas">{timeLeft.hours.toString().padStart(2, '0')}h</span>
      <span title="Minutos">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
      <span title="Segundos" className="hidden xs:inline">
        {timeLeft.seconds.toString().padStart(2, '0')}s
      </span>
    </div>
  );
}
