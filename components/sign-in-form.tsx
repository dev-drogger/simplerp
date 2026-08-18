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
import { EyeOff, Eye, ArrowRight, Loader2 } from "lucide-react";
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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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
                      className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center"
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
    </form>
  );
};

export default SignInForm;
