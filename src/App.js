import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import NewUserFormatted from './NewUserFormatted'

function App(){
  return(
    <div className="App">
      <NewUserFormatted />
    </div>
  )
}

export default App;
