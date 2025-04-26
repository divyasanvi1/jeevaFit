import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NearestHospitalsPage from './pages/NearestHospitals.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import LandingPage from "./pages/LandingPage.jsx";
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Shared layout for logged-in views
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: 'dashboard',
        element: <HomePage />,
      },
      {
        path: 'nearest-hospitals',
        element: <NearestHospitalsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
