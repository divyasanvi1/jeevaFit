// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import NearestHospitalsPage from './pages/NearestHospitals';
import './index.css'

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/nearest-hospitals" element={<NearestHospitalsPage />} />
          {/* Add other routes for the dashboard or protected routes here */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
