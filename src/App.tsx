import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { EditorEnvironment } from './features/environment/editor/EditorEnvironment';
import { WorldEnvironment } from './features/environment/world/WorldEnvironment';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <EditorEnvironment />
        <WorldEnvironment />
      </header>
    </div>
  );
}

export default App;
