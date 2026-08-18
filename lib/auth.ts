"use server";

import { signIn } from "@/auth";
import { AuthCredentials } from "@/types";

export const signInWithCredentials = async (params: AuthCredentials) => {
  const { username, password } = params;

  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Invalid username/password" };
  }
};
