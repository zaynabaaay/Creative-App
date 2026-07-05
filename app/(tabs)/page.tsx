import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { listOpenJobs, listJobsByPoster } from "@/lib/data/jobs";
import { HomeScreen } from "./HomeScreen";

function Landing() {
  return (
    <main className="flex-1 flex items-center justify-center bg-frame p-4">
      <div className="w-full max-w-[400px] bg-paper rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)] px-7 py-12">
        <h1 className="font-display text-[34px] font-extrabold tracking-[-0.02em] leading-[1.08]">
          Creative Hub
        </h1>
        <p className="font-sans text-[15px] leading-relaxed text-muted mt-3 mb-7">
          Post what you need — one person or a whole crew. A hiring hub for
          photographers, videographers, and the creatives around them.
        </p>
        <div className="flex gap-3">
          <Link
            href="/signup"
            className="flex-1 text-center font-display text-[15px] font-bold py-3 rounded-panel bg-accent text-white"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="flex-1 text-center font-display text-[15px] font-bold py-3 rounded-panel border border-line bg-card text-ink"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function Home() {
  if (!isSupabaseConfigured()) return <Landing />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <Landing />;

  const { data: profile } = await supabase
    .from("profiles")
    .select("area")
    .eq("id", user.id)
    .maybeSingle<{ area: string }>();
  if (!profile) redirect("/onboarding");

  const [openJobs, myJobs] = await Promise.all([
    listOpenJobs(),
    listJobsByPoster(user.id),
  ]);

  return (
    <main className="flex-1 bg-paper">
      <HomeScreen openJobs={openJobs} myJobs={myJobs} area={profile.area} />
    </main>
  );
}
