"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { disciplinesForRoles } from "@/lib/jobs";

export type PostJobState = { error?: string };

export async function postJob(
  _prev: PostJobState,
  formData: FormData,
): Promise<PostJobState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const roles = formData.getAll("roles").map(String);
  const area = String(formData.get("area") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();
  const posterKind =
    formData.get("poster_kind") === "creative" ? "creative" : "client";

  if (title.length < 3) return { error: "Give it a short title." };
  if (roles.length === 0) return { error: "Pick who you need — at least one." };
  if (!area) return { error: "Where is this happening?" };

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      poster_id: user.id,
      title,
      brief,
      area,
      budget: budget || null,
      date: date || null,
      poster_kind: posterKind,
      roles,
      disciplines: disciplinesForRoles(roles),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  redirect(`/jobs/${data.id}?posted=1`);
}
