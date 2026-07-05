import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileStats } from "@/lib/types";
import { Chat, type ChatMessage } from "./Chat";

type ConversationRow = {
  id: string;
  participant_a: string;
  participant_b: string;
  job_id: string | null;
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, job_id")
    .eq("id", id)
    .maybeSingle<ConversationRow>();
  if (!convo) notFound();

  const otherId =
    convo.participant_a === user.id ? convo.participant_b : convo.participant_a;

  const [{ data: other }, { data: stats }, { data: messages }, jobTitle] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", otherId)
        .maybeSingle<Profile>(),
      supabase
        .from("profile_stats")
        .select("collabs_count, vouches_count")
        .eq("profile_id", otherId)
        .maybeSingle<ProfileStats>(),
      supabase
        .from("messages")
        .select("id, sender_id, body, created_at")
        .eq("conversation_id", convo.id)
        .order("created_at")
        .returns<ChatMessage[]>(),
      convo.job_id
        ? supabase
            .from("jobs")
            .select("title")
            .eq("id", convo.job_id)
            .maybeSingle<{ title: string }>()
            .then((r) => r.data?.title ?? null)
        : Promise.resolve(null),
    ]);
  if (!other) notFound();

  return (
    <Chat
      conversationId={convo.id}
      meId={user.id}
      other={{
        id: other.id,
        display_name: other.display_name,
        handle: other.handle,
        role_title: other.role_title,
        avatar_url: other.avatar_url,
      }}
      stats={stats ?? { collabs_count: 0, vouches_count: 0 }}
      jobTitle={jobTitle}
      initialMessages={messages ?? []}
    />
  );
}
