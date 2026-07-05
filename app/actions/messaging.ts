"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Find or create the 1:1 conversation with another person, then open it.
 * The pair is stored normalized (smaller uuid first) so the same two people
 * can never end up with two conversations. A job id, when present, becomes
 * the conversation's context ("Re: {job}") the first time it's created.
 */
export async function openConversation(otherId: string, jobId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.id === otherId) redirect("/you");

  const [a, b] = [user.id, otherId].sort();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("participant_a", a)
    .eq("participant_b", b)
    .maybeSingle<{ id: string }>();

  if (existing) redirect(`/messages/${existing.id}`);

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ participant_a: a, participant_b: b, job_id: jobId ?? null })
    .select("id")
    .single<{ id: string }>();

  if (error || !created) {
    // Lost a race with the other participant creating it — look it up again.
    const { data: raced } = await supabase
      .from("conversations")
      .select("id")
      .eq("participant_a", a)
      .eq("participant_b", b)
      .maybeSingle<{ id: string }>();
    if (raced) redirect(`/messages/${raced.id}`);
    redirect("/inbox");
  }

  redirect(`/messages/${created.id}`);
}
