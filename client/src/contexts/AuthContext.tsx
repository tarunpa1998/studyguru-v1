import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, AuthUser, LoginData, RegisterData } from '../lib/authApi';
import { useToast } from '@/hooks/use-toast';

// Define auth context types
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  googleLogin: (token: string) => Promise<boolean>;
  updateProfile: (data: { fullName?: string; profileImage?: string }) => Promise<boolean>;
  isAuthenticated: () => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  googleLogin: async () => false,
  updateProfile: async () => false,
  isAuthenticated: () => false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch current user
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('authToken'); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await authApi.login(data);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.user.fullName}!`,
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      toast({
        title: 'Registration successful',
        description: `Welcome, ${response.user.fullName}!`,
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const googleLogin = async (token: string) => {
    try {
      setLoading(true);
      const response = await authApi.googleLogin(token);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      toast({
        title: 'Login successful',
        description: `Welcome, ${response.user.fullName}!`,
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google login failed';
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  // Update profile function
  const updateProfile = async (data: { fullName?: string; profileImage?: string }) => {
    try {
      setLoading(true);
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleLogin, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;