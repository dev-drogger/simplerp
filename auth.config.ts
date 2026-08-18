import type { NextAuthConfig } from "next-auth";
export const authConfig = {
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.username = (user as any).username;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.type = (user as any).type;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.type = token.type as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
