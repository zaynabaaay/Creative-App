"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "../actions";
import {
  FieldLabel,
  TextInput,
  PrimaryButton,
  FormError,
} from "@/components/forms";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signup,
    {},
  );

  if (state.sent) {
    return (
      <div className="text-center py-10">
        <div className="w-[60px] h-[60px] rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
          <span aria-hidden className="text-accent text-2xl">
            ✉️
          </span>
        </div>
        <h1 className="font-display text-[22px] font-extrabold tracking-[-0.01em]">
          Check your email
        </h1>
        <p className="font-sans text-[14.5px] text-muted leading-relaxed mt-2">
          We sent you a confirmation link. Tap it on this device and you’ll
          land right back here to finish setting up.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">
        Join your scene
      </h1>
      <p className="font-sans text-sm text-muted mt-1">
        One account for everything — post what you need, or find your next
        job.
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
        <FieldLabel htmlFor="password" hint="(at least 8 characters)">
          Password
        </FieldLabel>
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
        />
        <FormError>{state.error}</FormError>
        <div className="mt-6">
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </PrimaryButton>
        </div>
      </form>

      <p className="font-sans text-sm text-muted text-center mt-5">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Log in
        </Link>
      </p>
    </>
  );
}
