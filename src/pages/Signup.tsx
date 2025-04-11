
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/Auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Motel Manager</h1>
          <p className="text-gray-600">Create an account to store your motel data</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
