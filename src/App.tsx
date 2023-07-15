import React from 'react';
import './App.css';
import { EnvironmentManager } from './features/environment/EnvironmentManager';
import { EditorEnvironment } from './features/environment/editor/EditorEnvironment';
import { WorldEnvironment } from './features/environment/world/WorldEnvironment';

function App() {
  return (
    <div className="App">
      <EnvironmentManager>
        <EditorEnvironment />
        <WorldEnvironment />
      </EnvironmentManager>
    </div>
  );
}

export default App;
