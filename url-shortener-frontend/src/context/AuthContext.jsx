
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/api";

// Share authentication state and actions across the application.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Access React Query's cache so user-specific data can be cleared on logout.
  const queryClient = useQueryClient();

  // Store the currently authenticated user and initial session-check status.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // A user is authenticated when their details are available.
  const isAuthenticated = user !== null;

   // Restore the user's session by requesting their current account details.
  const checkAuth = async () => {
    try {
      const response = await api.get("/api/users/me");
      setUser(response.data);
      return response.data;
    } catch {
      // Treat a failed session check as an unauthenticated session.
      setUser(null);
      return null;
    } finally {
      // Allow protected routes to proceed once the session check finishes.
      setLoading(false);
    }
  };

  // Check whether an existing session is valid when the provider mounts.
  useEffect(() => {
    void checkAuth();
  }, []);

  // Register a new user and return the server's response.
  const registerUser = useCallback(async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  }, []);

  // Authenticate the user and store the returned user details.
  const login = useCallback(async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    setUser(response.data);

    return response.data;
  }, []);

  // End the server session and clear local authentication and cached data.
  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      // Clear local state even if the logout request fails.
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  // Memoize the context value to avoid unnecessary updates for consumers
  // when the referenced state and callback functions have not changed.
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      registerUser,
      logout,
      checkAuth,
    }),
    [user, isAuthenticated, loading, login, registerUser, logout, checkAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Provide a convenient hook for accessing authentication context.
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Fail clearly if the hook is used outside its provider.
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};