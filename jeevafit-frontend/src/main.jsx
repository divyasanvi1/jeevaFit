import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import NearestHospitalsPage from './pages/NearestHospitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Shared layout for logged-in views
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
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
