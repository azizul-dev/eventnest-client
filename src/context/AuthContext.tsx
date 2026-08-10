"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, ApiResponse } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInState: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 *
 * NOTE ON SECURITY TRADEOFF:
 * In this SPA + REST API setup, JWT token is stored in localStorage for seamless client-side API requests.
 * For maximum XSS protection in strict production setups, storing tokens in SameSite HttpOnly cookies
 * handled directly by the backend is recommended.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore session on mount
    const savedToken = localStorage.getItem("eventnest_token");
    const savedUser = localStorage.getItem("eventnest_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user from storage", e);
        localStorage.removeItem("eventnest_token");
        localStorage.removeItem("eventnest_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/login", { email, password });

    const { user: userData, token: jwtToken } = response.data.data;
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("eventnest_token", jwtToken);
    localStorage.setItem("eventnest_user", JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/register", { name, email, password });

    const { user: userData, token: jwtToken } = response.data.data;
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("eventnest_token", jwtToken);
    localStorage.setItem("eventnest_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("eventnest_token");
    localStorage.removeItem("eventnest_user");
  };

  const updateUserInState = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("eventnest_user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
    updateUserInState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
