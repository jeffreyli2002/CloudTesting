import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import NewUserFormatted from './NewUserFormatted';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/new-user" element={<NewUserFormatted />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;