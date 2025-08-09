import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RouterSet from './components/Routes/RouterSet'; // імпортуєш свій RouterSet
import './App.css';

function App() {
  return (
      <div className="App">
        <Header />
        <main className="main-content">
          <RouterSet /> 
        </main>
        <Footer />
      </div>
  );
}

export default App;
