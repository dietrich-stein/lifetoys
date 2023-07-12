import React, { useRef } from 'react';
import { EnvironmentCanvas } from '../EnvironmentCanvas';
import { withWorldCanvasEffects } from './withWorldCanvasEffects';

const WorldEnvironmentCanvas = withWorldCanvasEffects(EnvironmentCanvas);

export function WorldEnvironment() {
  const canvasId = 'world-canvas';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <WorldEnvironmentCanvas
        canvasId={ canvasId }
        canvasRef={ canvasRef }
      />
    </div>
  );
}
