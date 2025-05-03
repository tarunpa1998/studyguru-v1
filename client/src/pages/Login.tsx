import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Login to StudyGlobal</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;