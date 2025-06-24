import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import CharacterGrid from './components/Characters/CharacterGrid';
import CharacterDetail from './components/Characters/CharacterDetail';
import LocationGrid from './components/Locations/LocationGrid';
import EpisodeGrid from './components/Episodes/EpisodeGrid';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CharacterGrid />} />
            <Route path="/character/:id" element={<CharacterDetail />} />
            <Route path="/locations" element={<LocationGrid />} />
            <Route path="/episodes" element={<EpisodeGrid />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;