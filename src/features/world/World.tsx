import React from 'react';
import { WorldCanvas } from './WorldCanvas';
import styles from './World.module.css';

export function World() {
  const canvasContainerId = 'world-canvas-container';
  const canvasId = 'world-canvas';

  return (
    <div id={ canvasContainerId } className={ styles.worldCanvasContainer }>
      <WorldCanvas
        canvasId={ canvasId }
        canvasContainerId={ canvasContainerId }
      />
    </div>
  );
}
