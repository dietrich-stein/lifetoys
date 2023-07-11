import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { EnvironmentManager } from './features/environment/EnvironmentManager';
import { EditorEnvironment } from './features/environment/editor/EditorEnvironment';
import { WorldEnvironment } from './features/environment/world/WorldEnvironment';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <EnvironmentManager>
          <EditorEnvironment />
          <WorldEnvironment />
        </EnvironmentManager>
      </header>
    </div>
  );
}

export default App;
