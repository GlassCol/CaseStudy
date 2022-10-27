import React from 'react';
import Home from './Home';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
    <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Home' element={<Home />} />
    </Routes>
  </Router>
  );
}

export default App;