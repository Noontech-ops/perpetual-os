'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    let subscription: { unsubscribe: () => void } | undefined;

    import('@/lib/supabase/client').then(async ({ createClient }) => {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      setLoading(false);

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = data.subscription;
    });

    return () => { subscription?.unsubscribe(); };
  }, []);

  async function signOut() {
    const { createClient } = await import('@/lib/supabase/client');
    await createClient().auth.signOut();
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
