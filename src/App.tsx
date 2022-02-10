import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './components/pages/Main';
import Join from './components/pages/Join';
import Login from './components/pages/Login';
import Lecture from './components/pages/Lecture';
import Test from './components/pages/Test';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/join' element={<Join />} />
      <Route path='/login' element={<Login />} />
      <Route path='/lecture' element={<Lecture />} />
      <Route path='/test' element={<Test />} />
    </Routes>
  );
}

export default App;
