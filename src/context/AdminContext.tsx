import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminContextType = {
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // For now, any authenticated user is considered admin
      // Since we don't have a profiles table with roles
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ loading, isAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }
  return context;
}
