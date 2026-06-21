"use client";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import * as z from "zod";
import { useState } from "react";
import FormController from "./FormController";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password cannot exceed 100 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data);
  }

  const [user, setUser] = useState(null);
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
      {user ? (
        <div className="flex flex-col gap-4">{/* plaidLink */}</div>
      ) : (
        <>
          <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormController
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                form={form}
              />
              <FormController
                name="password"
                autoComplete="password"
                placeholder="Enter your password"
                form={form}
              />
            </FieldGroup>
            <Field orientation="horizontal" className="px-1! text-gray-900 font-semibold font-ibm-plex-serif py-5!">
              <Button type="submit" form="form-rhf-input" className="text-sm">
                Submit
              </Button>
            </Field>
          </form>
        </>
      )}
    </section>
  );
};

export default AuthForm;
