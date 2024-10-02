import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Component } from 'react';
import Button from './Button';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      message: 'hello world :)'
    };
  }
  render(){
    return(
      <div>
        <h1>{this.state.message}</h1>
        <p>Hello world!</p>
        <Button name="hi"></Button>
      </div>
    );
  }
}

export default App;
