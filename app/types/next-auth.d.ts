import { DefaultSession } from "next-auth";

// Extend the default NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: "admin" | "user";
  }
}
