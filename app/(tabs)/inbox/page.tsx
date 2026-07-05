import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInbox } from "@/lib/data/conversations";
import { AvatarCircle } from "@/components/Avatar";

export default async function InboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const entries = await getInbox(user.id);

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto w-full px-5 pt-4 pb-6">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em] mb-4">
          Inbox
        </h1>

        {entries.length === 0 ? (
          <div className="text-center px-7 py-12">
            <div className="w-[60px] h-[60px] rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
              <span aria-hidden className="text-accent text-2xl">✉</span>
            </div>
            <h3 className="font-display text-[19px] font-extrabold tracking-[-0.01em] mb-2">
              No messages yet
            </h3>
            <p className="font-sans text-[14.5px] text-muted leading-relaxed">
              Open a portfolio and reach out, or respond to a job.
              Conversations you start show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {entries.map((e) => (
              <Link
                key={e.id}
                href={`/messages/${e.id}`}
                className="flex items-center gap-3 bg-card border border-line rounded-2xl p-3"
              >
                <AvatarCircle
                  name={e.other.display_name}
                  seed={e.other.id}
                  imageUrl={e.other.avatar_url}
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-sans text-[14.5px] font-bold">
                    {e.other.display_name}
                  </span>
                  <span className="block font-sans text-[13px] text-muted truncate">
                    {e.lastMessage
                      ? (e.lastMessage.sender_id === user.id ? "You: " : "") +
                        e.lastMessage.body
                      : "Say hello"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
