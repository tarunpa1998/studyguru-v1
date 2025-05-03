import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Route, Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

/**
 * A wrapper around Route that redirects to the admin login page if the user is not authenticated as an admin
 */
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  path,
  component: Component,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  
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
        
        // Check if user is authenticated and is an admin
        const isAdmin = isAuthenticated() && user?.isAdmin === true;
        
        // Redirect to admin login if not authenticated as admin
        if (!isAdmin) {
          return <Redirect to="/admin/login" />;
        }
        
        // Render the protected component if authenticated as admin
        return <Component />;
      }}
    />
  );
};

export default AdminProtectedRoute;