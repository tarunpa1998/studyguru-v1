import React, { memo } from 'react';
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
export const ProtectedRoute: React.FC<ProtectedRouteProps> = memo(({
  path,
  component: Component,
}) => {
  const { user, loading } = useAuth();
  
  // Create the render function outside of the return statement
  const renderComponent = () => {
    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      );
    }
    
    // Check if user is authenticated directly 
    // to avoid calling isAuthenticated() which might trigger renders
    const token = localStorage.getItem('authToken');
    const isAuthenticated = !!token && !!user && !!user.id;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    
    // Render the protected component if authenticated
    return <Component />;
  };
  
  return (
    <Route path={path} component={renderComponent} />
  );
});

export default ProtectedRoute;