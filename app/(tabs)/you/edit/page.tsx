import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { AvatarUpload } from "@/components/portfolio/AvatarUpload";
import { EditProfileForm } from "./EditProfileForm";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();
  if (!profile) redirect("/onboarding");

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto px-5 py-6 pb-12">
        <Link
          href="/you"
          className="font-sans text-sm font-semibold text-muted"
        >
          ← Back
        </Link>
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em] mt-3">
          Edit profile
        </h1>
        <div className="mt-5">
          <AvatarUpload
            userId={user.id}
            name={profile.display_name}
            avatarUrl={profile.avatar_url}
          />
        </div>
        <EditProfileForm profile={profile} />
      </div>
    </main>
  );
}
