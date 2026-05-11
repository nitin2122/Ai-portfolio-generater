import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    // If supabase client is null (missing/invalid credentials), skip auth init
    // and render the app in unauthenticated mode so the page is not blank.
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });

        return () => subscription?.unsubscribe();
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    if (!supabase) { const e = 'Auth not configured'; setError(e); throw new Error(e); }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    if (!supabase) { const e = 'Auth not configured'; setError(e); throw new Error(e); }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProStatus = async () => {
    if (!supabase) throw new Error('Auth not configured');
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { is_pro: true }
      });
      if (error) throw error;
      setUser(data.user);
    } catch (err) {
      console.error("Error updating pro status:", err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProStatus,
    isAuthenticated: !!user,
    isPro: user?.user_metadata?.is_pro === true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
