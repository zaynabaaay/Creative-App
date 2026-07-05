"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthState } from "../actions";
import {
  FieldLabel,
  TextInput,
  PrimaryButton,
  FormError,
} from "@/components/forms";

function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    login,
    {},
  );
  const params = useSearchParams();
  const confirmFailed = params.get("error") === "confirm";

  return (
    <>
      <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">
        Welcome back
      </h1>
      <p className="font-sans text-sm text-muted mt-1">
        Log in to see what’s open in your scene.
      </p>

      <form action={formAction} className="mt-4">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        <FormError>
          {state.error ??
            (confirmFailed
              ? "That confirmation link didn’t work — it may have expired. Try logging in, or sign up again."
              : null)}
        </FormError>
        <div className="mt-6">
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </PrimaryButton>
        </div>
      </form>

      <p className="font-sans text-sm text-muted text-center mt-5">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-accent">
          Create an account
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
