import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

/**
 * useAuth
 * -------
 * Tracks the current Supabase session and whether the user holds the
 * `admin` role (checked via the `has_role` security-definer function, so
 * the role check itself happens server-side and can't be spoofed from
 * the client).
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      const isAdmin = user ? await checkIsAdmin(user.id) : false;
      if (mounted) setState({ user, isAdmin, loading: false });
    }

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      const isAdmin = user ? await checkIsAdmin(user.id) : false;
      if (mounted) setState({ user, isAdmin, loading: false });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) {
    console.error("has_role check failed", error);
    return false;
  }
  return Boolean(data);
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string, fullName: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
