"use client";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import * as z from "zod";
import { useState } from "react";
import FormController from "./FormController";
import { formSchema as authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.action";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "sign-up" && {
        firstName: "",
        lastName: "",
        address: "",
        state: "",
        pinCode: "",
        city: "",
        dateOfBirth: "",
        addharCardNumber: "",
      }),
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
      console.log("ERROR" + error);
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => setIsLoading(false), 2000);
  };

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href="/"
          className="cursor-pointer flex items-center gap-1 mt-7! ml-4!"
        >
          <Image src={"/icons/logo.svg"} width={34} height={34} alt={"logo"} />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            MMCB
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign in" : "Sign up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to MMCB"
                : "Create an account to get started"}
            </p>
          </h1>
        </div>
      </header>
      {true ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <FormController
                      name="firstName"
                      autoComplete="firstName"
                      placeholder="Enter your first name"
                      control={form.control}
                    />
                    <FormController
                      name="lastName"
                      autoComplete="lastName"
                      placeholder="Enter your last name"
                      control={form.control}
                    />
                  </div>
                  <FormController
                    name="address"
                    autoComplete="address"
                    placeholder="Enter your address"
                    control={form.control}
                  />
                  <div className="flex gap-4">
                    <FormController
                      name="state"
                      autoComplete="state"
                      placeholder="Enter your state(e.g UP)"
                      control={form.control}
                    />
                    <FormController
                      name="pinCode"
                      autoComplete="pinCode"
                      placeholder="Enter your pin code(e.g 123456)"
                      control={form.control}
                    />
                  </div>
                  <FormController
                    name="city"
                    autoComplete="city"
                    placeholder="Enter your city(e.g Mumbai)"
                    control={form.control}
                  />
                  <div className="flex gap-4">
                    <FormController
                      name="dateOfBirth"
                      type="date"
                      autoComplete="dob"
                      placeholder="YYYY-MM-DD(e.g 01-01-1999)"
                      control={form.control}
                    />
                    <FormController
                      name="addharCardNumber"
                      autoComplete="addharCardNumber"
                      placeholder="Enter your addharCardNumber(e.g 1234567890)"
                      control={form.control}
                    />
                  </div>
                </>
              )}
              <FormController
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                control={form.control}
              />
              <FormController
                name="password"
                autoComplete="password"
                type="password"
                placeholder="Enter your password"
                control={form.control}
              />
            </FieldGroup>
            <Field
              orientation="horizontal"
              className="px-1! text-gray-900 font-semibold font-ibm-plex-serif py-5!"
            >
              <div className="flex flex-col gap-4 w-full">
                <Button
                  type="submit"
                  form="form-rhf-input"
                  className="text-sm form-btn px-3! py-5!"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </Field>
          </form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
