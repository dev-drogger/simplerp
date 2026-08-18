import SignInForm from "@/components/sign-in-form";
import { signInWithCredentials } from "@/lib/auth";
import Link from "next/link";
import { connection } from "next/server";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const Page = async () => {
  await connection();
  return (
    <section className="flex flex-col md:flex-row py-20 bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-4 container mx-auto">
        <div className="w-full md:w-[50%] py-10 md:px-20 px-6 bg-white rounded-xl">
          <div className="flex flex-col gap-6">
            <div className="flex-col-center gap-6">
              <h2 className="text-4xl md:text-6xl">Welcome to Simplerp</h2>
              <p className="text-muted-foreground">
                Access the site using this following credentials
                <br />
              </p>
              <span className="inline-block font-bold text-muted-foreground">
                Username: <span className="font-normal">visitor</span>
                <br />
                Password: <span className="font-normal">visitor</span>
              </span>
            </div>

            <SignInForm
              defaultValues={{
                username: "",
                password: "",
              }}
              onSubmit={signInWithCredentials}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
