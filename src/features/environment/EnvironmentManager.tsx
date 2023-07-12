//import { EditorEnvironment } from "./editor/EditorEnvironment";
//import { WorldEnvironment } from "./world/WorldEnvironment";
//world: ReturnType<typeof WorldEnvironment>,
//editor: ReturnType<typeof EditorEnvironment
//import React, { useEffect } from 'react'; // useRef
import React from 'react'; // useRef

type EnvironmentManagerProps = {
  children?: React.ReactNode
  //worldEl?: HTMLElement;
  //setWorldEl: React.Dispatch<React.SetStateAction<HTMLElement>>;
  //editorEl?: HTMLElement;
  //setEditorEl: React.Dispatch<React.SetStateAction<HTMLElement>>;
};

export function EnvironmentManager(props: EnvironmentManagerProps) {
  //const [worldEl, setWorldEl] = React.useState<null | HTMLElement>(null);
  //const [editorEl, setEditorEl] = React.useState<null | HTMLElement>(null);
  //setWorldEl();
  //setEditorEl();
  const {
    //worldEl,
    //setWorldEl,
    //editorEl,
    //setEditorEl,
    children,
  } = props;

  /*function initReadyEnvironments(

    worldCanvasId: string,
    editorCanvasId: string
  ) => {
    //HTMLCanvasElement

    const worldCanvasRef = useRef<HTMLCanvasElement>(null);
    const editorCanvasRef = useRef<HTMLCanvasElement>(null);
    //const worldCanvas: //<document.getElementById(worldCanvasId);
    //const editorCanvas = document.getElementById(editorCanvasId);
    //const context = canvasRef.current?.getContext('2d')
    //if (context) {
    //  context.beginPath();
    //  context.arc(50, 50, 50, 0, 2 * Math.PI);
    //  context.fill();
    //}

    if (worldCanvasRef.current) {
      console.log(worldCanvasRef.current);
    }

    if (editorCanvasRef.current) {
      console.log(worldCanvasRef.current);
    }

    //console.log("weee!", worldCanvas, editorCanvas);
  }*/

  //useEffect(() => {
    //console.log('EnvironmentManager!', children)
    /*if (canvasRef.current) {
      const canvasId = 'editor-canvas';
      //const canvas = canvasRef.current;
      //console.log('EE', canvas);
      dispatch(setEditorStatus({
        status: 'idle',
        canvasId
      }));
    }*/
  //}, []);

  return (
    <>
      { children }
    </>
  );
}
