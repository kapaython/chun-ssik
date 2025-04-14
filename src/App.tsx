import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

import Conversation01 from './components/Conversation01';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversation01" element={<Conversation01 />} />
      </Routes>
    </Router>
  );
}

export default App;
