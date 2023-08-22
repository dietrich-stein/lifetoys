import React from 'react';
import './App.css';
import { WorldManager } from './features/world/WorldManager';
import { EditorEnvironment } from './features/editor/EditorEnvironment';
import { World } from './features/world/World';
import { EditorManager } from './features/editor/EditorManager';

function App() {
  return (
    <div className="App">
      <WorldManager>
        <World />
      </WorldManager>
      <EditorManager>
        <EditorEnvironment />
      </EditorManager>
    </div>
  );
}

export default App;
