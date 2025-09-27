import React from 'react';
import MapContainer from './MapContainer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React에서 네이버 지도 Polyline 그리기</h1>
      </header>
      <main>
        <MapContainer />
      </main>
    </div>
  );
}

export default App;