import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem, Profile, ProfileStats } from "@/lib/types";

export async function getProfileBundle(
  by: { id: string } | { handle: string },
): Promise<{
  profile: Profile;
  items: PortfolioItem[];
  stats: ProfileStats;
} | null> {
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*");
  query =
    "id" in by
      ? query.eq("id", by.id)
      : query.ilike("handle", by.handle);
  const { data: profile } = await query.maybeSingle<Profile>();
  if (!profile) return null;

  const [{ data: items }, { data: stats }] = await Promise.all([
    supabase
      .from("portfolio_items")
      .select("*")
      .eq("profile_id", profile.id)
      .order("sort_order")
      .order("created_at"),
    supabase
      .from("profile_stats")
      .select("collabs_count, vouches_count")
      .eq("profile_id", profile.id)
      .maybeSingle<ProfileStats>(),
  ]);

  return {
    profile,
    items: items ?? [],
    stats: stats ?? { collabs_count: 0, vouches_count: 0 },
  };
}
