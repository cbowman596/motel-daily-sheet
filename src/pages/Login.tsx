
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/Auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Motel Manager</h1>
            <p className="text-gray-600">Sign in with your pre-created username</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Login;
