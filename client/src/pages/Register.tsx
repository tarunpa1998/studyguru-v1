import React, { useEffect } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden">
        {/* Hero section - put it first on mobile, but it will be second on desktop */}
        <div className="w-full md:w-1/2 md:order-2 bg-gradient-to-br from-primary/90 via-primary to-primary/80 dark:from-primary/80 dark:via-primary/90 dark:to-primary p-8 md:p-12 text-primary-foreground flex items-center">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4">Start Your Global Education Journey</h2>
              <p className="mb-6 text-primary-foreground/90">
                Join thousands of students who have found their perfect educational path abroad with Study Guru.
              </p>
              <ul className="space-y-2">
                {['Create a personalized profile', 'Get matched with ideal programs', 'Receive scholarship alerts', 'Connect with alumni network'].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                  >
                    <svg className="h-5 w-5 mr-2 text-primary-foreground/80" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Form section - put it second on mobile, but first on desktop */}
        <div className="w-full md:w-1/2 md:order-1 p-8 md:p-12 bg-card text-card-foreground">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-center text-primary mb-2">Create an Account</h1>
              <p className="text-center text-muted-foreground mb-8">Join Study Guru and unlock your international education potential</p>
            </motion.div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


