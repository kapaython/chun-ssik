import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

import Conversation01 from './components/Conversation01';
import Conversation02 from './components/Conversation02';
import Conversation03 from './components/Conversation03';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversation01" element={<Conversation01 />} />
        <Route path="/conversation02" element={<Conversation02 />} />
        <Route path="/conversation03" element={<Conversation03 />} />
      </Routes>
    </Router>
  );
}

export default App;
