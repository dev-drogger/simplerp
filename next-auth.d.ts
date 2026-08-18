// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { UserType } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      username: string;
      type: UsesrType;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    username: string;
    type: UserType;
  }
}
