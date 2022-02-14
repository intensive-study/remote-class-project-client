import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './components/pages/Main';
import Join from './components/pages/Join';
import Login from './components/pages/Login';
import Lecture from './components/pages/Lecture';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/join' element={<Join />} />
      <Route path='/login' element={<Login />} />
      <Route path='/lecture' element={<Lecture />} />
    </Routes>
  );
}

export default App;
