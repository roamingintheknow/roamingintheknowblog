import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("roaming-blog-db");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await client.connect();
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user || !user.isAdmin) return null; // Reject non-admins

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return { id: user._id.toString(), email: user.email, role: "admin" };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {

    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          id: token.sub as string,  // Ensure user ID is correctly typed
          email: token.email as string,
          role: token.role as string,
        };
      }
      console.log("Session:", session);
      console.log("Session token:", token);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      console.log("JWT Token:", token);
      return token;
    }
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 1 year in seconds
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 1 year in seconds
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // false in dev
      },
    },
  },
  debug: true,
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
  
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" }
};

export default NextAuth(authOptions);




// import NextAuth from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';
// import FacebookProvider from 'next-auth/providers/facebook';
// // import TwitterProvider from 'next-auth/providers/twitter';

// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     // FacebookProvider({
//     //   clientId: process.env.FACEBOOK_CLIENT_ID,
//     //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     // }),
//     // GitHubProvider({
//     //   clientId: process.env.GITHUB_ID,
//     //   clientSecret: process.env.GITHUB_SECRET,
//     // }),
//     // TwitterProvider({
//     //   clientId: process.env.TWITTER_CLIENT_ID,
//     //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
//     // }),
//     // Add other providers here
//   ],
// };

// export default NextAuth(authOptions);
