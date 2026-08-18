"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  DefaultValues,
  SubmitHandler,
  FieldValues,
  Path,
  Controller,
} from "react-hook-form";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { AUTH_FORM_FIELD } from "@/lib";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeOff, Eye, ArrowRight, House, Loader2 } from "lucide-react";
import { signInSchema } from "@/lib/validation";
import { AuthCredentials } from "@/types";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "./ui/field";

interface Props<T extends FieldValues> {
  defaultValues: T;
  onSubmit: (
    data: AuthCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
}

const SignInForm = <T extends FieldValues>({
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<AuthCredentials>({
    resolver: zodResolver(signInSchema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<AuthCredentials> = async (data) => {
    setLoading(true);
    const result = await onSubmit(data);

    if (result.success) {
      toast.success("You have successfully signed in");

      window.location.replace("/");
    } else {
      setLoading(false);
      toast.error("Oops something went wrong", {
        description: result.error,
      });
    }
  };

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5 font-switzer"
    >
      <FieldGroup>
        {Object.keys(defaultValues).map((field) => (
          <Controller
            key={field}
            control={form.control}
            name={field as Path<AuthCredentials>}
            render={({ field }) => (
              <Field>
                <FieldLabel className=" font-semibold text-m text-muted-foreground">
                  {
                    AUTH_FORM_FIELD.SIGN_IN.names[
                      field.name as keyof typeof AUTH_FORM_FIELD.SIGN_IN.names
                    ]
                  }
                </FieldLabel>
                {field.name === "password" ? (
                  <div className="relative">
                    <Input
                      className="px-4 py-6 rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors pr-10"
                      required
                      placeholder={
                        AUTH_FORM_FIELD.SIGN_IN.placeholders[
                          field.name as keyof typeof AUTH_FORM_FIELD.SIGN_IN.placeholders
                        ]
                      }
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 mt-3 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                ) : (
                  <Input
                    className="px-4 py-6 rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors"
                    required
                    placeholder={
                      AUTH_FORM_FIELD.SIGN_IN.placeholders[
                        field.name as keyof typeof AUTH_FORM_FIELD.SIGN_IN.placeholders
                      ]
                    }
                    type={
                      AUTH_FORM_FIELD.SIGN_IN.types[
                        field.name as keyof typeof AUTH_FORM_FIELD.SIGN_IN.types
                      ]
                    }
                    {...field}
                  />
                )}
              </Field>
            )}
          />
        ))}
      </FieldGroup>
      <div className="flex items-center justify-between text-sm">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="hover:underline text-reddish transition-colors"
        >
          Reset password
        </a>
      </div>

      <Button
        type="submit"
        size={"lg"}
        className="text-white bg-black rounded-2xl py-7 transition-colors font-medium text-[16px] hover:bg-note-muted w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <>Sign In</>
            <ArrowRight />
          </>
        )}
      </Button>

      <Button
        size={"lg"}
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
        className=" text-black bg-yellish hover:bg-yellish-muted transition-colors rounded-2xl py-7  font-medium text-[16px] w-full"
      >
        Back to Home Page
        <House />
      </Button>
    </form>
  );
};

export default SignInForm;
