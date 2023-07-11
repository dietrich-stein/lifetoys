import React, {
  //useState,
  useEffect,
  useRef
} from 'react';
import { useAppDispatch } from '../../../app/hooks';
import {
  //WorldEnvironmentState,
  setWorldStatus
} from './worldEnvironmentSlice';

export function WorldEnvironment() {
  const canvasId = 'world-canvas';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  /*const [statusState, setStatusState] = useState<WorldEnvironmentState>({
    status: 'loading',
    canvasId: null
  });*/

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(setWorldStatus({
        status: 'idle',
        canvasId
      }));
    }
  }, /*[]*/);

  return (
    <div>
      <canvas id={canvasId} ref={canvasRef}></canvas>
    </div>
  );
}