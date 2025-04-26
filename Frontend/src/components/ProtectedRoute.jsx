import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, redirectPath = "/dashboard" }) => {
  const isAuthenticated = localStorage.getItem('token'); // or from Redux
  // Disable back button functionality
  useEffect(() => {
    if (isAuthenticated) {
      // Prevent back navigation by pushing the current state into history
      window.history.pushState(null, '', window.location.href);

      // Listen for the popstate event (back navigation) and immediately push the same state
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href); // Push current page again
      };

      window.onpopstate = handlePopState; // Disable back button

      return () => {
        // Cleanup the event listener on unmount
        window.onpopstate = null;
      };
    }
  }, [isAuthenticated]);
  // Redirect logged-in users from login/signup pages
  if (isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
    return <Navigate to={redirectPath} />;
  }

  // Otherwise, allow access to the requested route if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
