import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Route, Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

/**
 * A wrapper around Route that redirects to the login page if the user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  component: Component,
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  return (
    <Route
      path={path}
      component={() => {
        // Show loading spinner while checking authentication
        if (loading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          );
        }
        
        // Redirect to login if not authenticated
        if (!isAuthenticated()) {
          return <Redirect to="/login" />;
        }
        
        // Render the protected component if authenticated
        return <Component />;
      }}
    />
  );
};

export default ProtectedRoute;