import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './components/pages/Main';
import Join from './components/pages/Join';
import Login from './components/pages/Login';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/join' element={<Join />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;
