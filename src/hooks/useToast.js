import { useState, useCallback, useRef } from 'react';

export function useToast(duration = 2800) {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef(null);

  const show = useCallback(
    (msg) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMessage(msg);
      timeoutRef.current = setTimeout(() => setMessage(''), duration);
    },
    [duration],
  );

  return [message, show];
}
