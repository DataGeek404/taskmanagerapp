
/**
 * Authentication context module that manages user authentication state and operations.
 * Provides authentication functions and state to the application.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

/**
 * Authentication context interface containing authentication state and functions.
 */
interface AuthContextType {
  /** Current Supabase session */
  session: Session | null;
  /** Currently authenticated user */
  user: User | null;
  /** Whether authentication state is being loaded */
  loading: boolean;
  /** Function to sign in a user with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Function to sign up a new user */
  signUp: (email: string, password: string, name: string) => Promise<void>;
  /** Function to sign out the current user */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component that wraps the application and provides authentication context.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    /**
     * Fetches and sets the current authentication session from Supabase.
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

    // Subscribe to auth state changes//
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  /**
   * Signs in a user with email and password.
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @throws Will throw an error if authentication fails
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
   * Creates a new user account.
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} name - User's display name
   * @throws Will throw an error if registration fails
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
   * Signs out the current user.
   * 
   * @throws Will throw an error if sign out fails
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
 * Custom hook to access the authentication context.
 * 
 * @returns {AuthContextType} The authentication context values and functions
 * @throws Will throw an error if used outside of an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
