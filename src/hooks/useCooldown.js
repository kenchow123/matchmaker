import { useState, useEffect, useRef, useCallback } from 'react';
import { COOLDOWN_SECS } from '../utils/constants';

const STORAGE_KEY = 'mm-last-submit';

export function useCooldown() {
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef(null);

  const calcRemaining = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return 0;
      const elapsed = Math.floor((Date.now() - parseInt(stored, 10)) / 1000);
      return Math.max(0, COOLDOWN_SECS - elapsed);
    } catch {
      return 0;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const r = calcRemaining();
    setRemaining(r);
    if (r <= 0) return;
    timerRef.current = setInterval(() => {
      const rem = calcRemaining();
      setRemaining(rem);
      if (rem <= 0) clearInterval(timerRef.current);
    }, 1000);
  }, [calcRemaining]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const trigger = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {}
    setRemaining(COOLDOWN_SECS);
    startTimer();
  }, [startTimer]);

  return [remaining, trigger];
}
