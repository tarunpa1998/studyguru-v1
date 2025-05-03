import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the Google script is already loaded
    if (window.google?.accounts) {
      setGoogleScriptLoaded(true);
      return;
    }

    // Add the Google script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!googleScriptLoaded || !window.google?.accounts) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      callback: async (response: any) => {
        if (response.credential) {
          setLoading(true);
          try {
            const success = await googleLogin(response.credential);
            if (success) {
              navigate('/');
            }
          } catch (error) {
            console.error('Google login error:', error);
            toast({
              variant: 'destructive',
              title: 'Login failed',
              description: 'Failed to login with Google. Please try again.',
            });
          } finally {
            setLoading(false);
          }
        }
      },
      ux_mode: 'popup',
    });

    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      window.google.accounts.id.renderButton(buttonContainer, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: '100%',
      });
    }
  }, [googleScriptLoaded, googleLogin, navigate, toast]);

  return (
    <div className="w-full">
      {!googleScriptLoaded ? (
        <Button variant="outline" className="w-full" disabled>
          Loading Google Sign-In...
        </Button>
      ) : (
        <div 
          id="google-signin-button" 
          className="w-full flex justify-center"
        ></div>
      )}
    </div>
  );
};

export default GoogleLoginButton;