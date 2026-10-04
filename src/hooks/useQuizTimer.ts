import { useState, useEffect, useRef } from 'react';

interface UseQuizTimerProps {
  durationHours: number;
  onExpire?: () => void;
  isActive: boolean;
}

export function useQuizTimer({ durationHours, onExpire, isActive }: UseQuizTimerProps) {
  const totalSeconds = Math.max(1, Math.round(durationHours * 3600));
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          if (onExpireRef.current) {
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, totalSeconds]);

  const timeTakenSeconds = totalSeconds - remainingSeconds;

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  return {
    remainingSeconds,
    formattedTime,
    timeTakenSeconds,
    totalSeconds,
    isExpired: remainingSeconds === 0,
  };
}
