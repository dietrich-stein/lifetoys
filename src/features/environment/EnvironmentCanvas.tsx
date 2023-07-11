import React, {
  //useState,
  //useEffect,
  //useRef
} from 'react';
//import { useAppDispatch } from '../../app/hooks';

export type EnvironmentCanvasProps = {
  canvasId: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

//export const EnvironmentCanvas: React.FC<EnvironmentCanvasProps> = props => {
export function EnvironmentCanvas(props: EnvironmentCanvasProps) {
  const {
    canvasId,
    canvasRef,
  } = props;
  //const canvasRef = useRef<HTMLCanvasElement>(null);

  /*const dispatch = useAppDispatch();
  useEffect(() => {
    if (canvasRef.current) {
      // @TODO: WorldEnvironmentCanvas and EditorEnvironmentCanvas
      if (canvasId === 'world-canvas') {
        dispatch(setWorldStatus({
          status: 'idle',
          canvasId
        }));
      } else if (canvasId === 'editor-canvas') {
        dispatch(setEditorStatus({
          status: 'idle',
          canvasId
        }));
      }
    }
  });*/

  return (
    <canvas id={canvasId} ref={canvasRef} />
  );
}