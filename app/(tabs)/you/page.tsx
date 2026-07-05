import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileBundle } from "@/lib/data/profiles";
import { AvatarCircle } from "@/components/Avatar";
import { StatCards } from "@/components/StatCards";
import { WorkGrid } from "@/components/portfolio/WorkGrid";
import { UploadWork } from "@/components/portfolio/UploadWork";
import { signOut } from "@/app/(auth)/actions";

export default async function YouPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bundle = await getProfileBundle({ id: user.id });
  if (!bundle) redirect("/onboarding");
  const { profile, items, stats } = bundle;

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto pb-10">
        <WorkGrid items={items} editable />

        {items.length === 0 && (
          <div className="text-center px-7 pt-12 pb-2">
            <div className="w-[60px] h-[60px] rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
              <span aria-hidden className="text-accent text-2xl">✦</span>
            </div>
            <h2 className="font-display text-[19px] font-extrabold tracking-[-0.01em]">
              Your work goes here
            </h2>
            <p className="font-sans text-[14.5px] text-muted leading-relaxed mt-2 mb-5">
              Your portfolio is your entry ticket — it’s what gets shared every
              time you respond to a job. Add a few favourites to start.
            </p>
          </div>
        )}

        <div className="px-5 pt-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
                {profile.display_name}
              </h1>
              <div className="font-sans text-sm text-muted mt-0.5">
                @{profile.handle}
              </div>
            </div>
            <AvatarCircle
              name={profile.display_name}
              seed={profile.id}
              imageUrl={profile.avatar_url}
              size={52}
            />
          </div>

          {profile.role_title && (
            <p className="font-sans text-[15px] font-semibold mt-3">
              {profile.role_title}
            </p>
          )}
          {(profile.area || profile.rate) && (
            <div className="font-sans text-[13.5px] text-muted font-semibold mt-1">
              {[profile.area, profile.rate].filter(Boolean).join(" · ")}
            </div>
          )}
          {profile.bio && (
            <p className="font-sans text-[15px] leading-relaxed mt-3">
              {profile.bio}
            </p>
          )}

          {profile.disciplines.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {profile.disciplines.map((d) => (
                <span
                  key={d}
                  className="font-sans text-[12.5px] font-semibold bg-chip px-2.5 py-1 rounded-[7px]"
                >
                  {d}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5">
            <StatCards
              collabs={stats.collabs_count}
              vouches={stats.vouches_count}
              ownProfile
            />
          </div>

          {stats.collabs_count === 0 && (
            <p className="font-sans text-[13px] text-faint text-center leading-relaxed mb-4">
              Day one, everyone starts at zero — including you. Respond to your
              first job to get moving.
            </p>
          )}

          <div className="flex flex-col gap-2.5">
            <UploadWork userId={user.id} itemCount={items.length} />
            <Link
              href="/you/edit"
              className="w-full text-center font-display text-[15px] font-bold py-3.5 rounded-panel border border-line bg-card text-ink"
            >
              Edit profile
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full font-sans text-[13px] font-semibold text-muted underline underline-offset-2 py-2"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
