
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("finance_user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("finance_user");
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate credentials against an API
      if (email && password) {
        // Mock user data for demo
        const mockUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0]
        };
        
        setUser(mockUser);
        localStorage.setItem("finance_user", JSON.stringify(mockUser));
        toast.success("Login successful");
        setIsLoading(false);
        return true;
      } else {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      setIsLoading(false);
      return false;
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, register user through an API
      if (email && password && name) {
        const mockUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name
        };
        
        setUser(mockUser);
        localStorage.setItem("finance_user", JSON.stringify(mockUser));
        toast.success("Registration successful");
        setIsLoading(false);
        return true;
      } else {
        toast.error("Invalid registration details");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Registration failed. Please try again.");
      setIsLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("finance_user");
    toast.success("Logged out successfully");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
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
