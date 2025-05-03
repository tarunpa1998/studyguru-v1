import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <UserProfile />
    </div>
  );
};

export default Profile;