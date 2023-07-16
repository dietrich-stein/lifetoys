import React, {
  useEffect,
  useRef,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectWorldEnvironment, initWorldEnvironment } from './worldEnvironmentSlice';
import styles from './WorldEnvironmentCanvas.module.css';

export type EnvironmentCanvasProps = {
  canvasId: string;
  canvasContainerId: string;
};

export function WorldEnvironmentCanvas(props: EnvironmentCanvasProps) {
  const {
    canvasId,
    canvasContainerId,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const worldEnvironmentState = useAppSelector(selectWorldEnvironment);

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(initWorldEnvironment({
        ...worldEnvironmentState,
        status: 'idle',
        canvasId,
        canvasContainerId,
      }));
    }
  }, []);

  return (
    <canvas id={ canvasId } className={ styles.worldCanvas } ref={ canvasRef } />
  );
}
