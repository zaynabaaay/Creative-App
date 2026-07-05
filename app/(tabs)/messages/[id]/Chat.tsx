"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AvatarCircle } from "@/components/Avatar";

export type ChatMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Other = {
  id: string;
  display_name: string;
  handle: string;
  role_title: string;
  avatar_url: string | null;
};

export function Chat({
  conversationId,
  meId,
  other,
  stats,
  jobTitle,
  initialMessages,
}: {
  conversationId: string;
  meId: string;
  other: Other;
  stats: { collabs_count: number; vouches_count: number };
  jobTitle: string | null;
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef(createClient());

  const mergeIn = (incoming: ChatMessage[]) =>
    setMessages((cur) => {
      const seen = new Set(cur.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      if (fresh.length === 0) return cur;
      return [...cur, ...fresh].sort((a, b) =>
        a.created_at.localeCompare(b.created_at),
      );
    });

  // Realtime stream of new messages, with gentle polling as a safety net.
  useEffect(() => {
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => mergeIn([payload.new as ChatMessage]),
      )
      .subscribe();

    const poll = setInterval(async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, body, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at")
        .returns<ChatMessage[]>();
      if (data) mergeIn(data);
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const { data, error } = await supabaseRef.current
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: meId, body })
      .select("id, sender_id, body, created_at")
      .single<ChatMessage>();
    if (!error && data) {
      mergeIn([data]);
      setText("");
    }
    setSending(false);
  }

  return (
    <main className="flex-1 bg-paper flex flex-col min-h-0">
      <div className="max-w-[480px] mx-auto w-full flex flex-col flex-1 min-h-0">
        <div className="px-3 py-2.5 flex items-center gap-1 border-b border-line">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink text-xl"
          >
            ‹
          </button>
          <span className="font-display text-base font-bold truncate">
            {other.display_name}
          </span>
        </div>

        {/* Context card: the job + who you're talking to. A message here is
            a mini-application, not a bare "hi". */}
        <div className="px-4 pt-3 pb-1">
          <Link
            href={`/u/${other.handle}`}
            className="flex items-center gap-2.5 bg-accent-soft rounded-panel p-3"
          >
            <AvatarCircle
              name={other.display_name}
              seed={other.id}
              imageUrl={other.avatar_url}
              size={38}
            />
            <span className="min-w-0">
              {jobTitle && (
                <span className="block font-display text-[11px] font-bold uppercase tracking-[0.04em] text-accent truncate">
                  Re: {jobTitle}
                </span>
              )}
              <span className="block font-sans text-[13px] font-semibold text-ink truncate">
                {other.role_title || `@${other.handle}`}
                {stats.collabs_count > 0
                  ? ` · ${stats.collabs_count} collabs · vouched ${stats.vouches_count}×`
                  : " · new here"}
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 min-h-0">
          {messages.length === 0 && (
            <p className="font-sans text-[13.5px] text-faint text-center px-3 py-5 leading-relaxed">
              Say hello. A good first message says which job and what you’re
              offering.
            </p>
          )}
          {messages.map((m) => {
            const mine = m.sender_id === meId;
            return (
              <div
                key={m.id}
                className={`max-w-[78%] ${mine ? "self-end" : "self-start"}`}
              >
                <div
                  className={`font-sans text-[14.5px] leading-snug px-3.5 py-2.5 ${
                    mine
                      ? "bg-accent text-white rounded-[16px_16px_4px_16px]"
                      : "bg-card text-ink border border-line rounded-[16px_16px_16px_4px]"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="px-3 py-3 border-t border-line flex items-center gap-2 bg-paper">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
            placeholder={`Message ${other.display_name.split(" ")[0]}…`}
            aria-label={`Message ${other.display_name}`}
            className="flex-1 font-sans text-[14.5px] px-4 py-3 rounded-full border border-line bg-card outline-none placeholder:text-faint"
          />
          <button
            onClick={() => void send()}
            disabled={sending || !text.trim()}
            aria-label="Send"
            className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </main>
  );
}
