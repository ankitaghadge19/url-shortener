import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace // Prevents going back to the previous page using the Back button
        state={{ from: location }} // Saves the requested page location so the user can be redirected there after login
      />
    );
  }

  // If authenticated, displays the matching child route (e.g., Dashboard or AnalyticsPage)
  return <Outlet />;
};

export default ProtectedRoute;
