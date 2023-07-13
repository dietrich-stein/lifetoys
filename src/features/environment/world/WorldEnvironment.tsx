import React from 'react';
import { WorldEnvironmentCanvas } from './WorldEnvironmentCanvas';
import styles from './WorldEnvironment.module.css';

export function WorldEnvironment() {
  const canvasContainerId = 'world-canvas-container';
  const canvasId = 'world-canvas';

  return (
    <div id={ canvasContainerId } className={ styles.worldCanvasContainer }>
      <WorldEnvironmentCanvas
        canvasId={ canvasId }
        canvasContainerId={ canvasContainerId }
      />
    </div>
  );
}
