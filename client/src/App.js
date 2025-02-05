import React from 'react';
import HomePage from './pages/homepage';
import Login from './pages/login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App() {
  
  return (
  
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
     


  );
}

export default App;
