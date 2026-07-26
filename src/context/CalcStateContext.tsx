import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { APP_STATE_KEY } from '../lib/constants';

type CalcStateContextValue = {
  cleanRate: number;
  setCleanRate: (n: number) => void;
};

const CalcStateContext = createContext<CalcStateContextValue | null>(null);

function loadCleanRate() {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    return typeof data.cleanRate === 'number' ? data.cleanRate : 0;
  } catch {
    return 0;
  }
}

export function CalcStateProvider({ children }: { children: ReactNode }) {
  const [cleanRate, setCleanRateState] = useState(loadCleanRate);

  const setCleanRate = useCallback((n: number) => {
    setCleanRateState(n);
    try {
      const raw = localStorage.getItem(APP_STATE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      data.cleanRate = n;
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.__ampedGetCleanRate = () => cleanRate;
    window.__ampedSetCleanRate = setCleanRate;
    return () => {
      delete window.__ampedGetCleanRate;
      delete window.__ampedSetCleanRate;
    };
  }, [cleanRate, setCleanRate]);

  const value = useMemo(
    () => ({ cleanRate, setCleanRate }),
    [cleanRate, setCleanRate],
  );

  return (
    <CalcStateContext.Provider value={value}>{children}</CalcStateContext.Provider>
  );
}

export function useCalcState() {
  const ctx = useContext(CalcStateContext);
  if (!ctx) throw new Error('useCalcState must be used within CalcStateProvider');
  return ctx;
}
