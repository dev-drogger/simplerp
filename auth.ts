import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authConfig } from "./auth.config";
import { users } from "@/db/schema";
import { db } from "@/db/drizzle";

export interface MyUser {
  id: string;
  username: string;
  type: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) return null;

          const [activeUser] = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username.toString()))
            .limit(1);

          if (!activeUser) return null;

          const isPasswordValid = await compare(
            credentials.password.toString(),
            activeUser.password,
          );

          if (!isPasswordValid) return null;

          return {
            id: activeUser.userId.toString(),
            username: activeUser.username,
            type: activeUser.userType,
          } as MyUser;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
