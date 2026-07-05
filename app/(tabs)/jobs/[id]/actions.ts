"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type RespondState = {
  error?: string;
  needsPortfolio?: boolean;
  done?: boolean;
};

export async function respondToJob(jobId: string): Promise<RespondState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/jobs/${jobId}`);

  // Portfolios are the price of entry: you can't respond without work to show.
  const { count } = await supabase
    .from("portfolio_items")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id);
  if (!count) return { needsPortfolio: true };

  const { error } = await supabase.from("responses").insert({
    job_id: jobId,
    responder_id: user.id,
  });
  if (error && error.code !== "23505") {
    // 23505 = already responded; treat as success
    return { error: error.message };
  }

  revalidatePath(`/jobs/${jobId}`);
  return { done: true };
}
