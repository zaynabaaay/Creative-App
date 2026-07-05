import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";

function formatDate(iso: string | null) {
  if (!iso) return "Date TBC";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    day: "numeric",
    month: "short",
  });
}

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string }>;
}) {
  const [{ id }, { posted }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle<Job>();
  if (!job) notFound();

  const [{ data: poster }, { count: responseCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, handle")
      .eq("id", job.poster_id)
      .maybeSingle<{ display_name: string; handle: string }>(),
    supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("job_id", job.id),
  ]);

  const mine = user?.id === job.poster_id;
  const kindLabel = mine
    ? "Your posting"
    : job.poster_kind === "client"
      ? "Client posting"
      : "Creative posting";

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto px-5 pb-12">
        <div className="py-2.5 -mx-2 flex items-center gap-1">
          <Link
            href="/"
            aria-label="Back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink text-xl"
          >
            ‹
          </Link>
          <span className="font-display text-base font-bold">Job</span>
        </div>

        {posted && (
          <div className="bg-[#E8F3EC] text-[#2E7D48] font-sans text-sm font-semibold rounded-panel px-4 py-3 mb-4">
            ✓ Job posted — creatives can respond now.
          </div>
        )}

        <span
          className={`inline-block font-display text-[11px] font-bold uppercase tracking-[0.04em] px-2 py-1 rounded-md ${
            job.poster_kind === "client" && !mine
              ? "text-[#9C7A2E] bg-[#FBF3DD]"
              : "text-accent bg-accent-soft"
          }`}
        >
          {kindLabel}
        </span>

        <h1 className="font-display text-[25px] font-extrabold tracking-[-0.02em] leading-[1.12] mt-3">
          {job.title}
        </h1>

        <div className="flex flex-wrap gap-x-3.5 gap-y-1 font-sans text-[13px] text-muted font-semibold mt-2 mb-4">
          <span>{job.area}</span>
          <span>{formatDate(job.date)}</span>
          <span className="text-ink">{job.budget ?? "Budget TBC"}</span>
        </div>

        {poster && (
          <p className="font-sans text-sm text-muted mb-4">
            Posted by{" "}
            <Link
              href={`/u/${poster.handle}`}
              className="font-semibold text-accent"
            >
              {poster.display_name}
            </Link>
          </p>
        )}

        <div className="font-display text-xs font-bold uppercase tracking-[0.05em] text-faint mb-2">
          {job.roles.length === 1 ? "Who they need" : "Roles needed"}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.roles.map((r) => (
            <span
              key={r}
              className="font-sans text-[13px] font-semibold bg-chip px-3 py-1.5 rounded-lg"
            >
              {r}
            </span>
          ))}
        </div>

        {job.brief && (
          <>
            <div className="font-display text-xs font-bold uppercase tracking-[0.05em] text-faint mb-2">
              The brief
            </div>
            <p className="font-sans text-[15px] leading-[1.55] mb-6 whitespace-pre-wrap">
              {job.brief}
            </p>
          </>
        )}

        <div className="font-display text-xs font-bold uppercase tracking-[0.05em] text-faint mb-2.5">
          {responseCount ?? 0} responded
        </div>
        <div className="bg-card border border-dashed border-line rounded-panel px-4 py-5 text-center mb-5">
          <p className="font-sans text-sm text-muted leading-relaxed">
            {mine
              ? "No responses yet. Share the link to your scene to get the first ones in."
              : "Responding lands in the next milestone — the feed and one-tap respond are on the bench being built."}
          </p>
        </div>
      </div>
    </main>
  );
}
