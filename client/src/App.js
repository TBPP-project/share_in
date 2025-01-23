import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/homepage';
import Login from './pages/login';

import './style/Homepage.css';
import './style/Login.css';



function App() {
  return (
    
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    
  );
}

export default App;
