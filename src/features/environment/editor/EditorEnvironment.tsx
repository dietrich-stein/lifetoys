import React, { useRef } from 'react';
import { EnvironmentCanvas } from '../EnvironmentCanvas';
import { withEditorCanvasEffects } from './withEditorCanvasEffects';

const EditorEnvironmentCanvas = withEditorCanvasEffects(EnvironmentCanvas);

export function EditorEnvironment() {
  const canvasId = 'editor-canvas';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <EditorEnvironmentCanvas
        canvasId={ canvasId }
        canvasRef={ canvasRef }
      />
    </div>
  );
}
