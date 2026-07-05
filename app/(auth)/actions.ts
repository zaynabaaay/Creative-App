"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; sent?: boolean };

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.code === "invalid_credentials"
          ? "That email and password don’t match."
          : error.message,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user!.id)
    .maybeSingle();

  redirect(profile ? "/" : "/onboarding");
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email) return { error: "Enter your email." };
  if (password.length < 8)
    return { error: "Password needs at least 8 characters." };

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) return { error: error.message };

  // Supabase quirk: signing up with an email that already has an account
  // returns a user with no identities instead of an error.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "That email already has an account — log in instead." };
  }

  // If email confirmation is disabled in Supabase, we get a live session
  // immediately and can go straight to onboarding.
  if (data.session) redirect("/onboarding");

  return { sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const HANDLE_RE = /^[a-z0-9._]{3,30}$/;

export type OnboardingState = { error?: string };

export async function createProfile(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const handle = String(formData.get("handle") ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
  const roleTitle = String(formData.get("role_title") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();

  if (!displayName) return { error: "Tell us your name." };
  if (!HANDLE_RE.test(handle)) {
    return {
      error:
        "Handles are 3–30 characters: lowercase letters, numbers, dots or underscores.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    display_name: displayName,
    handle,
    role_title: roleTitle,
    area,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "That handle is taken — try another." };
    return { error: error.message };
  }

  redirect("/");
}
