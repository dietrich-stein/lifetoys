import React, {
  //useState,
  useEffect,
  useRef
} from 'react';
import { useAppDispatch } from '../../../app/hooks';
import {
  //EditorEnvironmentState,
  setEditorStatus
} from './editorEnvironmentSlice';

export function EditorEnvironment() {
  const canvasId = 'editor-canvas';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  /*const [statusState, setStatusState] = useState<EditorEnvironmentState>({
    status: 'loading',
    canvasId: null
  });*/

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(setEditorStatus({
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