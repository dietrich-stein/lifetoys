import React from 'react';
import './App.css';
import { EnvironmentManager } from './features/environment/EnvironmentManager';
import { EditorEnvironment } from './features/environment/editor/EditorEnvironment';
import { WorldEnvironment } from './features/environment/world/WorldEnvironment';
import * as dg from 'dis-gui-lifetoys';

function App() {
  return (
    <div className="App">
      <EnvironmentManager>
        <EditorEnvironment />
        <WorldEnvironment />
      </EnvironmentManager>
      <dg.GUI>
        <dg.Text label='Text' value='Hello world!'/>
      </dg.GUI>
    </div>
  );
}

export default App;
