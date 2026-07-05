import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";

export type JobWithCount = Job & { response_count: number };

type JobRow = Job & { responses: { count: number }[] };

function withCount(rows: JobRow[] | null): JobWithCount[] {
  return (rows ?? []).map(({ responses, ...job }) => ({
    ...job,
    response_count: responses?.[0]?.count ?? 0,
  }));
}

export async function listOpenJobs(): Promise<JobWithCount[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, responses(count)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(100);
  return withCount(data as JobRow[] | null);
}

export async function listJobsByPoster(
  posterId: string,
): Promise<JobWithCount[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, responses(count)")
    .eq("poster_id", posterId)
    .order("created_at", { ascending: false });
  return withCount(data as JobRow[] | null);
}
