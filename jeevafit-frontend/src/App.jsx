// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ProfilePage from './pages/ProfilePage';
import './index.css'
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignupPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NearestHospitalsPage = lazy(() => import('./pages/NearestHospitals'));
const BookingPage = lazy(() => import('./components/BookingPage'));
import WeatherPage from './pages/WeatherPage';


const App = () => {
  return (
    <Provider store={store}>
      <Router>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/nearest-hospitals" element={<NearestHospitalsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/weather" element={<WeatherPage />} />
            {/* Add other routes as needed */}
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
