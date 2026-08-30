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

  // Restore authentication when application starts
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/api/users/me");
      setUser(response.data);
      console.log(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Register
  const registerUser = useCallback(async (userData) => {
    const resposne = await api.post("/api/auth/register", userData);
    return resposne.data;
  });
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
    }),
    [user, isAuthenticated, loading, login, registerUser, logout],
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
