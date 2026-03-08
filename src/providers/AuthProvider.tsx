"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    console.log("AuthProvider: Checking initial session...");
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔐 Initial session check:', { 
        hasSession: !!session, 
        user: session?.user?.email,
        error: error?.message 
      })
      if (session) {
        console.log("AuthProvider: Session found, setting user:", session.user.email);
        setUser(session.user);
      } else {
         console.log("AuthProvider: No session found initially.");
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event, {
        hasSession: !!session,
        user: session?.user?.email,
        timestamp: new Date().toISOString()
      })
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session) {
         console.log("AuthProvider: SIGNED_IN event received, setting user.");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    console.log('🚀 Starting Google OAuth...', {
      redirectTo: `${window.location.origin}/auth/callback`
    })
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error('❌ OAuth error:', error)
    } else {
      console.log('✅ OAuth initiated:', data)
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
