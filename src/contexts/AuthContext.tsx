import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

type UserRole = "athlete" | "coach";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
  const loadSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error loading session:", error);
    }
    setSession(data.session);
    setSupabaseUser(data.session?.user ?? null);
    setLoading(false); // Ensure loading ends
  };

  loadSession();
}, []);


  const fetchUserProfile = async () => {
  if (!supabaseUser) {
    setUser(null);
    setLoading(false);
    return;
  }

  const fullUser: User = {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: supabaseUser.user_metadata?.name || "User",
    role: supabaseUser.user_metadata?.role || "athlete",
    avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
  };

  setUser(fullUser);
  setLoading(false);
};


  // Fetch profile when supabaseUser changes
  useEffect(() => {
    fetchUserProfile();
  }, [supabaseUser]);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const authUser = session?.user ?? null;
        setSupabaseUser(authUser);

        if (authUser && event === "SIGNED_IN") {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", authUser.id)
            .single();

          if (!existingProfile) {
            const role = authUser.user_metadata?.role || "athlete";
            const { error } = await supabase
              .from("profiles")
              .insert({
                id: authUser.id,
                name: authUser.user_metadata?.name || "User",
                role,
                avatar_url: authUser.user_metadata?.avatar_url || null,
                email: authUser.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (!error) await fetchUserProfile();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Optional: Wait for user fetch
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setSupabaseUser(sessionData.session?.user ?? null);

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error("❌ SignIn error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("❌ SignUp error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Signed out", description: "You've been successfully signed out." });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({ title: "Sign out failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};