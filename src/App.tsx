import React from 'react';
import './App.css';
import { WorldManager } from './features/world/WorldManager';
import { Editor } from './features/editor/Editor';
import { World } from './features/world/World';
import { EditorManager } from './features/editor/EditorManager';

function App() {
  return (
    <div className="App">
      <WorldManager>
        <World />
      </WorldManager>
      <EditorManager>
        <Editor />
      </EditorManager>
    </div>
  );
}

export default App;
