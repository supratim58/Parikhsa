'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/exam-utils';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isSubmitting?: boolean;
}

export function ExamTimer({ durationMinutes, onTimeUp, isSubmitting = false }: ExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (isSubmitting) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }

        // Warning at 5 minutes
        if (newTime === 5 * 60) {
          setIsWarning(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, isSubmitting]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div
      className={`p-4 rounded-lg font-mono text-lg font-bold text-center ${
        isWarning ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
      }`}
    >
      Time Remaining: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      {isWarning && <div className="text-sm mt-1">⚠️ 5 minutes remaining!</div>}
    </div>
  );
}
