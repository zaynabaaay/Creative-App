import { createClient } from "@/lib/supabase/server";

export type InboxEntry = {
  id: string;
  other: {
    id: string;
    display_name: string;
    handle: string;
    avatar_url: string | null;
  };
  lastMessage: { body: string; sender_id: string; created_at: string } | null;
};

type ConversationRow = {
  id: string;
  participant_a: string;
  participant_b: string;
  job_id: string | null;
  created_at: string;
};

export async function getInbox(userId: string): Promise<InboxEntry[]> {
  const supabase = await createClient();
  const { data: convos } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .returns<ConversationRow[]>();
  if (!convos || convos.length === 0) return [];

  const otherIds = convos.map((c) =>
    c.participant_a === userId ? c.participant_b : c.participant_a,
  );
  const convoIds = convos.map((c) => c.id);

  const [{ data: profiles }, { data: lastMessages }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, handle, avatar_url")
      .in("id", otherIds)
      .returns<InboxEntry["other"][]>(),
    supabase
      .from("messages")
      .select("conversation_id, body, sender_id, created_at")
      .in("conversation_id", convoIds)
      .order("created_at", { ascending: false })
      .limit(200)
      .returns<
        {
          conversation_id: string;
          body: string;
          sender_id: string;
          created_at: string;
        }[]
      >(),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const lastByConvo = new Map<string, InboxEntry["lastMessage"]>();
  for (const m of lastMessages ?? []) {
    if (!lastByConvo.has(m.conversation_id)) {
      lastByConvo.set(m.conversation_id, m);
    }
  }

  return convos
    .map((c) => {
      const otherId =
        c.participant_a === userId ? c.participant_b : c.participant_a;
      const other = profileById.get(otherId);
      if (!other) return null;
      return {
        id: c.id,
        other,
        lastMessage: lastByConvo.get(c.id) ?? null,
      };
    })
    .filter((e): e is InboxEntry => e !== null)
    .sort((x, y) => {
      const tx = x.lastMessage?.created_at ?? "";
      const ty = y.lastMessage?.created_at ?? "";
      return ty.localeCompare(tx);
    });
}
