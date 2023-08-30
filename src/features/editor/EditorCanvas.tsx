import React, {
  useEffect,
  useRef,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectEditor, initEditor } from './EditorSlice';
import styles from './EditorCanvas.module.css';

export type EditorCanvasProps = {
  canvasId: string;
  canvasContainerId: string;
};

export function EditorCanvas(props: EditorCanvasProps) {
  const {
    canvasId,
    canvasContainerId,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const editorState = useAppSelector(selectEditor);

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(initEditor({
        ...editorState,
        status: 'idle',
        canvasId,
        canvasContainerId,
      }));
    }
  }, []);

  return (
    <canvas id={ canvasId } className={ styles.editorCanvas } ref={ canvasRef } />
  );
}
