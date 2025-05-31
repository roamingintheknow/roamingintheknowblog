import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const userSession = await getSession();
      setSession(userSession);
      setIsAdmin(userSession?.user?.role === "admin");
      setLoading(false);
    }
    checkAdmin();
  }, []);

  return { isAdmin, session, loading };
}
