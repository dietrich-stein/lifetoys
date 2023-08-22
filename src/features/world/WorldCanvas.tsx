import React, {
  useEffect,
  useRef,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectWorld, initWorld } from './WorldSlice';
import styles from './WorldCanvas.module.css';

export type WorldCanvasProps = {
  canvasId: string;
  canvasContainerId: string;
};

export function WorldCanvas(props: WorldCanvasProps) {
  const {
    canvasId,
    canvasContainerId,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const worldState = useAppSelector(selectWorld);

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(initWorld({
        ...worldState,
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
