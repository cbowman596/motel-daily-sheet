
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Create a new table to manage users by name
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
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Try to fetch the name user
        fetchNameUser();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
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
      // For name-based users, we'll check the local storage first
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

      // For simplicity, we'll create a simple API to look up users by name
      // This should be replaced with a proper backend implementation in production
      const { data, error } = await supabase
        .from('name_users')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        toast.error('User not found. Please create an account.');
        return;
      }

      // Store the user data in local storage
      localStorage.setItem('nameUser', JSON.stringify(data));
      setNameUser(data as NameUser);
      
      // Use Supabase anonymous session for authentication
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: `${name.toLowerCase().replace(/\s+/g, '-')}@example.com`,
        password: 'password' // This is a dummy password as we're simplifying authentication
      });
      
      if (authError) {
        // If the user doesn't exist in Supabase Auth, create them
        await signUpWithName(name);
        return;
      }

      toast.success(`Welcome, ${name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Error signing in with name:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithName = async (name: string) => {
    try {
      setLoading(true);

      // Check if user already exists
      const { data: existingUser, error: lookupError } = await supabase
        .from('name_users')
        .select('*')
        .eq('name', name)
        .single();

      if (existingUser) {
        toast.error('This name is already taken. Please choose another name.');
        return;
      }

      // Create the user in the name_users table
      const { data, error } = await supabase
        .from('name_users')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;

      // Store the user data in local storage
      localStorage.setItem('nameUser', JSON.stringify(data));
      setNameUser(data as NameUser);
      
      // Use Supabase anonymous session for authentication
      const email = `${name.toLowerCase().replace(/\s+/g, '-')}@example.com`;
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: 'password' // This is a dummy password as we're simplifying authentication
      });
      
      if (authError) throw authError;

      toast.success(`Welcome, ${name}! Your account has been created.`);
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
      console.error('Error signing up with name:', error);
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
