import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginService } from "../service/auth.service";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const user = await loginService(credentials);
          console.log("this is user in auth :", user);
          return user;
        } catch (error) {
          console.error("Internal Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      console.log("this is token :", token);
      return token;
    },
    session: async ({ session, token }) => {
      if (token && token.user) {
        session.user = token.user;
      }
      console.log("this is session : ", session);
      return session;
    },
  },
});