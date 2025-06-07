import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
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
