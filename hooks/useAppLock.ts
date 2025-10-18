import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';


export function useAppLock(timeout = 10000) {
  const [locked, setLocked] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  
  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLocked(true), timeout);
  };

  // reset timer when user interacts
  useEffect(() => {
    resetTimer();
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
        setLocked(true);
      }
      appState.current = nextState;
    });
    return () => {
      if (timer.current) clearTimeout(timer.current);
      subscription.remove();
    };
  }, []);

  return { locked, setLocked, resetTimer };
  
}
