import React from 'react';
import { EditorEnvironmentCanvas } from '../editor/EditorEnvironmentCanvas';
import styles from './EditorEnvironment.module.css';

export function EditorEnvironment() {
  const canvasContainerId = 'editor-canvas-container';
  const canvasId = 'editor-canvas';

  return (
    <div id={ canvasContainerId } className={ styles.editorCanvasContainer }>
      <EditorEnvironmentCanvas
        canvasId={ canvasId }
        canvasContainerId={ canvasContainerId }
      />
    </div>
  );
}
