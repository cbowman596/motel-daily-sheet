import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type NameUser = {
  id: string;
  name: string;
  created_at: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  nameUser: NameUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithName: (name: string) => Promise<void>;
  signUpWithName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [nameUser, setNameUser] = useState<NameUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchNameUser();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchNameUser();
      } else {
        setNameUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchNameUser = async () => {
    try {
      const storedUser = localStorage.getItem('nameUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setNameUser(parsedUser);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching name user:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Signed up successfully! Check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithName = async (name: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with name:', name);

      const { data, error } = await supabase
        .from('name_users')
        .select('*')
        .eq('name', name)
        .single();

      console.log('Name user lookup result:', { data, error });

      if (error || !data) {
        console.error('User not found error:', error);
        toast.error('User not found. Please ask an admin to create your account.');
        setLoading(false);
        return;
      }

      localStorage.setItem('nameUser', JSON.stringify(data));
      setNameUser(data as NameUser);
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: `${name.toLowerCase().replace(/\s+/g, '-')}@example.com`,
        password: 'password123'
      });
      
      if (authError) {
        console.log('Auth error, attempting signup:', authError);
        await signUpWithName(name);
        return;
      }

      toast.success(`Welcome, ${name}!`);
    } catch (error: any) {
      console.error('Error signing in with name:', error);
      toast.error(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithName = async (name: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign up with name:', name);

      const email = `${name.toLowerCase().replace(/\s+/g, '-')}@example.com`;
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: 'password123'
      });
      
      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      toast.success(`Welcome, ${name}! Your account has been created.`);
      
      const { data, error } = await supabase
        .from('name_users')
        .select('*')
        .eq('name', name)
        .single();
        
      if (data) {
        localStorage.setItem('nameUser', JSON.stringify(data));
        setNameUser(data as NameUser);
      }
    } catch (error: any) {
      console.error('Error signing up with name:', error);
      toast.error(error.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('nameUser');
      setNameUser(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    nameUser,
    signIn,
    signUp,
    signInWithName,
    signUpWithName,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
