import React from 'react';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'wouter';

const Profile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;