import { createContext, useState, useEffect, ReactNode } from "react";
import { login } from "../services/authService";

interface AuthContextType {
  user: string | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Asegurar que `localStorage` solo se usa en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setUser("Usuario Autenticado"); // Aquí puedes obtener más datos del backend
      }
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setToken(result.token);
      setUser(email);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.token);
      }
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

