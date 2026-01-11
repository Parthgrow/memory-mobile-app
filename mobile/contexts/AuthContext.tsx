import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";
import { authStorage, type User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = await authStorage.getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.verify(token);
      if (response.data?.valid && response.data.user) {
        setUser(response.data.user);
        await authStorage.setUser(response.data.user);
      } else {
        await authStorage.clear();
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await authStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        await authStorage.setToken(response.data.token);
        await authStorage.setUser(response.data.user);
        setUser(response.data.user);
        return { success: true };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await api.register(email, password);
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        await authStorage.setToken(response.data.token);
        await authStorage.setUser(response.data.user);
        setUser(response.data.user);
        return { success: true };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = async () => {
    await authStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
