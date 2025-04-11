
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, nameUser, loading } = useAuth();
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Simple query to check if Supabase is connected
        console.log("Testing Supabase connection...");
        const { error } = await supabase.from('rooms').select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionError(true);
          toast.error('Could not connect to the database.');
        } else {
          console.log("Supabase connection successful!");
          setConnectionError(false);
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
        setConnectionError(true);
      } finally {
        setCheckingConnection(false);
      }
    };
    
    if (user || nameUser) {
      checkSupabaseConnection();
    } else {
      setCheckingConnection(false);
    }
  }, [user, nameUser]);
  
  // Display loading spinner while checking authentication or connection
  if (loading || (checkingConnection && !connectionError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Display connection error screen
  if (connectionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
        <p className="mb-6 text-red-600">
          Unable to connect to the database. Please refresh the page to try again.
        </p>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700"
            >
              Refresh Page
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/login'}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (user || nameUser) ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
