import SignInForm from "@/components/sign-in-form";
import { signInWithCredentials } from "@/lib/auth";
import Link from "next/link";
import { connection } from "next/server";

const Page = async () => {
  await connection();
  return (
    <section className="flex flex-col md:flex-row py-20 bg-yellish">
      <div className="flex-1 flex items-center justify-center p-4 container mx-auto">
        <div className="w-full md:w-[50%] py-10 md:px-20 px-6 bg-light rounded-xl">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-tanker text-4xl md:text-5xl font-semibold">
                Welcome
              </h2>
              <p className="font-switzer text-muted-foreground">
                Access your account and continue your journey with us
              </p>
            </div>

            <SignInForm
              defaultValues={{
                username: "",
                password: "",
              }}
              onSubmit={signInWithCredentials}
            />

            <p className=" text-center text-sm font-switzer text-muted-foreground">
              New to our platform?{" "}
              <Link
                href="/sign-up"
                className="text-reddish hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
