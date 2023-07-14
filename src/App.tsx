import React from 'react';
import './App.css';
import { Engine } from './features/engine/Engine';
import { EnvironmentManager } from './features/environment/EnvironmentManager';
import { EditorEnvironment } from './features/environment/editor/EditorEnvironment';
import { WorldEnvironment } from './features/environment/world/WorldEnvironment';
import * as dg from 'dis-gui-lifetoys';

function App() {
  return (
    <div className="App">
      <dg.GUI>
        <dg.Text label='Text' value='Hello world!'/>
      </dg.GUI>
      <Engine>
        <EnvironmentManager>
          <EditorEnvironment />
          <WorldEnvironment />
        </EnvironmentManager>
      </Engine>
    </div>
  );
}

export default App;
