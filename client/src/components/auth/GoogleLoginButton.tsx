import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginButton: React.FC = () => {
  const { googleLogin } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Get the access token
      const accessToken = tokenResponse.access_token;
      setLoading(true);
      try {
        const success = await googleLogin(accessToken);
        if (success) {
          navigate('/');
        }
      } catch (error) {
        console.error('Google login error:', error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error('Google login failed');
      setLoading(false);
    },
  });

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center justify-center"
      onClick={() => login()}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
      )}
      {loading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleLoginButton;