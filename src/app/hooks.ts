import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useEffect, useRef, useState } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useStats() {
  const lastFpsValues = useRef<number[]>([]);
  const frames = useRef(0);
  const prevTime = useRef(performance.now());
  const animRef = useRef(0);
  const [fps, setFps] = useState<number[]>([]);

  const getFps = () => {
    const nowTime = performance.now();

    frames.current += 1;

    if (nowTime > prevTime.current + 100) {
      const elapsedTime = nowTime - prevTime.current;
      const currentFps = Math.round((frames.current * 1000) / elapsedTime);

      lastFpsValues.current = lastFpsValues.current.concat(currentFps);

      if (elapsedTime > 150) {
        for (let i = 1; i <= (elapsedTime - 1000) / 1000; i++) {
          lastFpsValues.current = lastFpsValues.current.concat(0);
        }
      }

      lastFpsValues.current = lastFpsValues.current.slice(Math.max(lastFpsValues.current.length - 100, 0));
      setFps(lastFpsValues.current);
      frames.current = 0;
      prevTime.current = performance.now();
    }

    animRef.current = requestAnimationFrame(getFps);
  };

  useEffect(() => {
    animRef.current = requestAnimationFrame(getFps);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const nowFps = (fps.length) ? Math.min(fps[fps.length - 1], 60) : 0;
  const avgFps = (fps.length) ? Math.min(parseInt((fps.reduce((a, b) => a + b, 0) / fps.length).toFixed(2)), 60) : 0;
  const maxFps = (fps.length) ? Math.min(Math.max.apply(Math.max, fps), 60) : 0;

  return { nowFps, avgFps, maxFps };
}
