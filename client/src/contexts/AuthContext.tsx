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
          console.log('No auth token found in localStorage');
          setLoading(false);
          return;
        }
        
        console.log('Auth token found, fetching user data');
        
        try {
          // Fetch current user data
          const userData = await authApi.getCurrentUser();
          
          if (!userData || !userData.id) {
            console.error('Received invalid user data from API:', userData);
            localStorage.removeItem('authToken');
            setLoading(false);
            return;
          }
          
          console.log('User data loaded successfully:', userData);
          setUser(userData);
        } catch (apiError: any) {
          console.error(
            'API error fetching user data:', 
            apiError?.response?.status, 
            apiError?.response?.data
          );
          
          // If we got a 401 Unauthorized response, clear the token
          if (apiError?.response?.status === 401) {
            localStorage.removeItem('authToken');
            toast({
              variant: 'destructive',
              title: 'Session Expired',
              description: 'Your session has expired. Please log in again.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to load user profile. Please try again.',
            });
          }
        }
      } catch (error: any) {
        console.error('Fatal error in loadUser:', error);
        localStorage.removeItem('authToken'); // Clear possibly corrupted token
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [toast]);

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
      console.log('AuthContext: Registering user:', {...data, password: '[REDACTED]'});
      
      try {
        const response = await authApi.register(data);
        console.log('AuthContext: Registration API response:', response);
        
        if (response && response.token) {
          console.log('AuthContext: Saving token to localStorage');
          localStorage.setItem('authToken', response.token);
          setUser(response.user);
          toast({
            title: 'Registration successful',
            description: `Welcome, ${response.user.fullName}!`,
          });
          return true;
        } else {
          console.error('AuthContext: Missing token in response:', response);
          toast({
            variant: 'destructive',
            title: 'Registration failed',
            description: 'Invalid server response. Please try again.',
          });
          return false;
        }
      } catch (apiError: any) {
        console.error('AuthContext: Registration error:', apiError);
        console.error('AuthContext: Error details:', apiError.response?.data);
        
        const message = apiError.response?.data?.message || 'Registration failed. Please try again.';
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: message,
        });
        return false;
      }
    } catch (error: any) {
      console.error('AuthContext: Unexpected error in register function:', error);
      toast({
        variant: 'destructive',
        title: 'Registration error',
        description: 'An unexpected error occurred. Please try again.',
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
    const token = localStorage.getItem('authToken');
    // We need both a token and a user object to be considered authenticated
    return !!token && !!user && !!user.id;
  };

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleLogin, updateProfile, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;