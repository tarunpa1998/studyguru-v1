import React, { memo, useState, useEffect } from 'react';
import { Route, Redirect, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

/**
 * A wrapper around Route that redirects to the admin login page if the user is not authenticated as an admin
 * This uses a completely separate authentication mechanism from the regular user auth
 */
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = memo(({
  path,
  component: Component,
}) => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check admin authentication independently from user auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if admin token exists
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.log('No admin token found, redirecting to admin login');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // Verify token with backend
        try {
          const response = await fetch('/api/admin/auth/auth', {
            headers: {
              'x-auth-token': token
            }
          });
          
          if (!response.ok) {
            throw new Error('Admin authentication failed');
          }
          
          await response.json(); // Just to validate we got a proper response
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Admin token validation error:', err);
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Create a memoized render function to prevent infinite renders
  const renderComponent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Redirect to="/admin/login" />;
    }
    
    return <Component />;
  };
  
  return (
    <Route path={path} component={renderComponent} />
  );
});

export default AdminProtectedRoute;