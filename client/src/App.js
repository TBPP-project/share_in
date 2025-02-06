import React from 'react';
import HomePage from './pages/homepage';
import Login from './pages/login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';




function App() {
  
  return (
  
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
     


  );
}

export default App;
