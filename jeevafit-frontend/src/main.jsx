import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import App from './App.jsx'
import enTranslation from '../src/locales/en/translation.json';
import hiTranslation from '../src/locales/hi/translation.json';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NearestHospitalsPage from './pages/NearestHospitals.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import LandingPage from "./pages/LandingPage.jsx";
import WeatherPage from './pages/WeatherPage';
import BookingPage from './components/BookingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import HealthLearningPage from './pages/HealthLearningPage.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import ProfilePage from './pages/ProfilePage';
import ResendVerification from './pages/ResendVerification.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import UploadsListPage from './pages/UploadsListPage.jsx';




if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')  // Path to your service worker file
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
i18next.init({
  lng: 'en',  // Default language
  fallbackLng: 'en',  // Fallback language if translation is missing
  resources: {
    en: {
      translation: enTranslation,
    },
    hi: {
      translation: hiTranslation,
    },
    // Add other languages as needed
  },
  interpolation: {
    escapeValue: false,  // React escapes by default
  },
});

const router = createBrowserRouter([
  
  {
    path: '/',
    element: <App />, // Shared layout for logged-in views
    children: [
      {
        path: '',
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'nearest-hospitals',
        element: (
          <ProtectedRoute>
            <NearestHospitalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'uploadList',
        element: (
          <ProtectedRoute>
            <UploadsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/health-learning',
        element: (
          <ProtectedRoute>
            <HealthLearningPage/>
          </ProtectedRoute>
        ),
      },
      {
        path: 'weather',
        element: (
          <ProtectedRoute>
            <WeatherPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/:userId',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: '/resendverification',
    element: (
      <PublicRoute>
        <ResendVerification />
      </PublicRoute>
    ),
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
    <I18nextProvider i18n={i18next}> 
    <LoadingProvider>
    <RouterProvider router={router} />
    </LoadingProvider>
    </I18nextProvider>
    </Provider>
  </StrictMode>,
)
