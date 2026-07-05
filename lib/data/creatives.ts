import { createClient } from "@/lib/supabase/server";

export type CreativeCard = {
  id: string;
  display_name: string;
  handle: string;
  role_title: string;
  area: string;
  disciplines: string[];
  avatar_url: string | null;
  thumbs: string[]; // up to 4 portfolio images
  collabs_count: number;
};

type Row = {
  id: string;
  display_name: string;
  handle: string;
  role_title: string;
  area: string;
  disciplines: string[];
  avatar_url: string | null;
  portfolio_items: { image_url: string; sort_order: number }[];
};

/**
 * Everyone with a role title or uploaded work counts as a creative in the
 * directory; pure hirers (e.g. a café owner with an empty profile) stay out.
 */
export async function listCreatives(
  excludeId?: string,
): Promise<CreativeCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, display_name, handle, role_title, area, disciplines, avatar_url, portfolio_items(image_url, sort_order)",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<Row[]>();

  const rows = (data ?? []).filter(
    (r) =>
      r.id !== excludeId &&
      (r.role_title.trim() !== "" || r.portfolio_items.length > 0),
  );

  const ids = rows.map((r) => r.id);
  const statsById = new Map<string, number>();
  if (ids.length > 0) {
    const { data: stats } = await supabase
      .from("profile_stats")
      .select("profile_id, collabs_count")
      .in("profile_id", ids)
      .returns<{ profile_id: string; collabs_count: number }[]>();
    for (const s of stats ?? []) statsById.set(s.profile_id, s.collabs_count);
  }

  return rows.map(({ portfolio_items, ...r }) => ({
    ...r,
    thumbs: [...portfolio_items]
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, 4)
      .map((p) => p.image_url),
    collabs_count: statsById.get(r.id) ?? 0,
  }));
}
