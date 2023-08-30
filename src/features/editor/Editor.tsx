import React from 'react';
import { EditorCanvas } from './EditorCanvas';
import styles from './Editor.module.css';

export function Editor() {
  const canvasContainerId = 'editor-canvas-container';
  const canvasId = 'editor-canvas';

  return (
    <div id={ canvasContainerId } className={ styles.editorCanvasContainer }>
      <EditorCanvas
        canvasId={ canvasId }
        canvasContainerId={ canvasContainerId }
      />
    </div>
  );
}
