import React, { useState } from 'react';
import './App.css';

function App() {
  const [context, setContext] = useState('');
  const [aperture, setAperture] = useState('');
  const [whiteBalance, setWhiteBalance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/getCameraSettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context }),
    });
    const data = await response.json();
    setAperture(data.aperture);
    setWhiteBalance(data.whiteBalance);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Camera Settings Demo</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label>
            Describe the photo-taking context:
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </label>
          <button type="submit">Get Settings</button>
        </form>
        <div>
          <h2>Recommended Settings</h2>
          <p>Aperture: {aperture}</p>
          <p>White Balance: {whiteBalance}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
