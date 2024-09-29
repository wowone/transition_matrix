import React from 'react';
import TransitionMatrix from './components/matrix/index.tsx';
import { sampleData } from './data';

function App() {
  return (
    <div className="App">
      <TransitionMatrix data={sampleData} />
    </div>
  );
}

export default App;