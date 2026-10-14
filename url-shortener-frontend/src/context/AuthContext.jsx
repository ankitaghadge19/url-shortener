import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Restore the user's session when the application starts
  const checkAuth = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/users/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Register
  const registerUser = useCallback(async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    setUser(response.data);

    return response.data;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      // Always clear the frontend authentication state
      setUser(null);
    }
  }, []);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
