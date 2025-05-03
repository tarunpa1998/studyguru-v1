import React, { memo } from 'react';
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
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = memo(({
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
    
    // Check if user is authenticated and is an admin
    // Instead of calling isAuthenticated() which triggers a render,
    // directly check for token existence and user.isAdmin
    const token = localStorage.getItem('authToken');
    const isAdmin = !!token && !!user && user.isAdmin === true;
    
    // Redirect to admin login if not authenticated as admin
    if (!isAdmin) {
      return <Redirect to="/admin/login" />;
    }
    
    // Render the protected component if authenticated as admin
    return <Component />;
  };
  
  return (
    <Route path={path} component={renderComponent} />
  );
});

export default AdminProtectedRoute;