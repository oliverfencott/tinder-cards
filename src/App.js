import React, { Component } from 'react';

import CardStackContainer from './components/CardStackContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <div className="phone-container">
          <CardStackContainer />
        </div>
      </div>
    );
  }
}

export default App;
