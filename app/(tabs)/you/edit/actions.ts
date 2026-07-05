"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EditState = { error?: string };

export async function updateProfile(
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName = String(formData.get("display_name") ?? "").trim();
  if (!displayName) return { error: "Your name can’t be empty." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      role_title: String(formData.get("role_title") ?? "").trim(),
      bio: String(formData.get("bio") ?? "").trim(),
      area: String(formData.get("area") ?? "").trim(),
      rate: String(formData.get("rate") ?? "").trim(),
      disciplines: formData.getAll("disciplines").map(String),
      is_available: formData.get("is_available") === "on",
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  redirect("/you");
}
