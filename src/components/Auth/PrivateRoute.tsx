
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingConnection, setCheckingConnection] = useState(true);
  
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Simple query to check if Supabase is connected
        const { error } = await supabase.from('rooms').select('count', { count: 'exact', head: true });
        
        if (error && error.message.includes('connection')) {
          toast.error('Could not connect to the database. Please check your environment variables.');
          console.error('Supabase connection error:', error);
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
      } finally {
        setCheckingConnection(false);
      }
    };
    
    if (user) {
      checkSupabaseConnection();
    } else {
      setCheckingConnection(false);
    }
  }, [user]);
  
  if (loading || checkingConnection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
