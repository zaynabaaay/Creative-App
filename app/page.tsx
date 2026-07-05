import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./(auth)/actions";

const MILESTONES: [string, boolean][] = [
  ["Foundation deployed", true],
  ["Sign up & log in", true],
  ["Your portfolio", false],
  ["Post a job & respond", false],
  ["Messages", false],
];

async function getViewer() {
  if (!isSupabaseConfigured()) return { configured: false as const };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true as const, user: null, profile: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, handle")
    .eq("id", user.id)
    .maybeSingle();
  return { configured: true as const, user, profile };
}

export default async function Home() {
  const viewer = await getViewer();

  return (
    <main className="flex-1 flex items-center justify-center bg-frame p-4">
      <div className="w-full max-w-[400px] bg-paper rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)] px-7 py-12 flex flex-col gap-6">
        <div>
          <span className="inline-block font-display text-[11px] font-bold uppercase tracking-[0.06em] text-accent bg-accent-soft px-2 py-1 rounded-md">
            It’s alive
          </span>
          <h1 className="font-display text-[34px] font-extrabold tracking-[-0.02em] leading-[1.08] mt-4">
            Creative Hub
          </h1>
          <p className="font-sans text-[15px] leading-relaxed text-muted mt-3">
            Post what you need — one person or a whole crew. A hiring hub for
            photographers, videographers, and the creatives around them.
          </p>
        </div>

        {viewer.configured && viewer.user ? (
          <div className="bg-accent-soft rounded-panel px-4 py-3.5">
            <p className="font-sans text-sm text-ink">
              You’re signed in as{" "}
              <span className="font-semibold">
                {viewer.profile
                  ? `${viewer.profile.display_name} (@${viewer.profile.handle})`
                  : "a brand-new account"}
              </span>
              .
            </p>
            {!viewer.profile && (
              <Link
                href="/onboarding"
                className="font-sans text-sm font-semibold text-accent mt-1 inline-block"
              >
                Finish setting up your profile →
              </Link>
            )}
            <form action={signOut} className="mt-2">
              <button
                type="submit"
                className="font-sans text-[13px] font-semibold text-muted underline underline-offset-2"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : viewer.configured ? (
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
        ) : null}

        <div className="border-t border-line pt-5 flex flex-col gap-3">
          <div className="font-display text-xs font-bold uppercase tracking-[0.05em] text-faint">
            Being built, step by step
          </div>
          <ul className="flex flex-col gap-2">
            {MILESTONES.map(([label, done]) => (
              <li key={label} className="flex items-center gap-2.5 font-sans text-sm">
                <span
                  className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] font-bold ${
                    done
                      ? "bg-accent text-white"
                      : "border border-line text-transparent"
                  }`}
                  aria-hidden
                >
                  ✓
                </span>
                <span className={done ? "text-ink font-semibold" : "text-muted"}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-sans text-[12.5px] text-faint leading-relaxed">
          {viewer.configured
            ? "Fresh from the workshop: accounts. Portfolios are next."
            : "You’re looking at the very first deploy — accounts switch on the moment the database is connected."}
        </p>
      </div>
    </main>
  );
}
