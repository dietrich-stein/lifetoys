import React, {
  useEffect,
  useRef,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectEditorEnvironment, setEditorStatus } from './editorEnvironmentSlice';
import styles from './EditorEnvironmentCanvas.module.css';

export type EditorEnvironmentCanvasProps = {
  canvasId: string;
  canvasContainerId: string;
};

export function EditorEnvironmentCanvas(props: EditorEnvironmentCanvasProps) {
  const {
    canvasId,
    canvasContainerId,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const editorEnvironmentState = useAppSelector(selectEditorEnvironment);

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(setEditorStatus({
        ...editorEnvironmentState,
        status: 'idle',
        canvasId,
        canvasContainerId,
      }));
    }
  });

  return (
    <canvas id={ canvasId } className={ styles.editorCanvas } ref={ canvasRef } />
  );
}
