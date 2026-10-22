
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  // Get the user's authentication status and loading state.
  const { isAuthenticated, loading } = useAuth();

  // Store the requested location in case the user needs to log in first.
  const location = useLocation();

  // Wait until the authentication status has been determined.
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // Redirect unauthenticated users to login and preserve their intended destination.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Render the requested child route when the user is authenticated.
  return <Outlet />;
};

export default ProtectedRoute;