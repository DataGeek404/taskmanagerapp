
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

/**
 * @interface AuthContextType
 * @description Type definition for the authentication context
 */
interface AuthContextType {
  /** Current user session */
  session: Session | null;
  /** Current authenticated user */
  user: User | null;
  /** Loading state for authentication operations */
  loading: boolean;
  /** Function to sign in a user */
  signIn: (email: string, password: string) => Promise<void>;
  /** Function to register a new user */
  signUp: (email: string, password: string, name: string) => Promise<void>;
  /** Function to sign out the current user */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @component AuthProvider
 * @description Provider component that wraps the application to provide authentication context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    /**
     * @function setData
     * @description Initialize the auth state by fetching the current session
     */
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error loading user:', error);
        toast({
          title: 'Error loading user',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    setData();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe();
  }, [toast]);

  /**
   * @function signIn
   * @description Signs in a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in',
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: 'Error signing in',
        description: error.message || 'Please check your credentials and try again',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * @function signUp
   * @description Registers a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} name - User's name
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account created!',
        description: 'Check your email for the confirmation link',
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error signing up',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * @function signOut
   * @description Signs out the current user
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error signing out',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * @function useAuth
 * @description Custom hook to access the authentication context
 * @returns {AuthContextType} Authentication context values and functions
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
