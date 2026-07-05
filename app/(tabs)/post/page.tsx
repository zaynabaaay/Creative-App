import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostJobForm } from "./PostJobForm";

export default async function PostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/post");

  const [{ data: profile }, { count }] = await Promise.all([
    supabase
      .from("profiles")
      .select("area")
      .eq("id", user.id)
      .maybeSingle<{ area: string }>(),
    supabase
      .from("portfolio_items")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id),
  ]);
  if (!profile) redirect("/onboarding");

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto px-5 py-6 pb-12">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">
          Post a job
        </h1>
        <p className="font-sans text-sm text-muted mt-1">
          One person or a whole crew — the right creatives come to you.
        </p>
        <PostJobForm
          defaultArea={profile.area}
          defaultKind={(count ?? 0) > 0 ? "creative" : "client"}
        />
      </div>
    </main>
  );
}
