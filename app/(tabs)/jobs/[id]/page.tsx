import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";
import { AvatarCircle } from "@/components/Avatar";
import { formatJobDate } from "@/components/jobs/JobCard";
import { RespondButton } from "./RespondButton";

type ResponderRow = {
  responder_id: string;
  profiles: {
    display_name: string;
    handle: string;
    role_title: string;
    avatar_url: string | null;
  } | null;
};

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

  const [{ data: poster }, { data: responderRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, handle")
      .eq("id", job.poster_id)
      .maybeSingle<{ display_name: string; handle: string }>(),
    supabase
      .from("responses")
      .select(
        "responder_id, profiles!responses_responder_id_fkey(display_name, handle, role_title, avatar_url)",
      )
      .eq("job_id", job.id)
      .order("created_at")
      .returns<ResponderRow[]>(),
  ]);

  const responders = responderRows ?? [];
  const mine = user?.id === job.poster_id;
  const alreadyResponded = Boolean(
    user && responders.some((r) => r.responder_id === user.id),
  );
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
          <span>{formatJobDate(job.date)}</span>
          <span className="text-ink">{job.budget ?? "Budget TBC"}</span>
        </div>

        {poster && !mine && (
          <p className="font-sans text-sm text-muted mb-4">
            Posted by{" "}
            <Link
              href={`/u/${poster.handle}?job=${job.id}`}
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
          {responders.length} responded
        </div>
        <div className="flex flex-col gap-2 mb-5">
          {responders.map((r) =>
            r.profiles ? (
              <Link
                key={r.responder_id}
                href={`/u/${r.profiles.handle}?job=${job.id}`}
                className="flex items-center gap-3 bg-card border border-line rounded-panel p-3"
              >
                <AvatarCircle
                  name={r.profiles.display_name}
                  seed={r.responder_id}
                  imageUrl={r.profiles.avatar_url}
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-sans text-sm font-bold">
                    {user?.id === r.responder_id
                      ? "You"
                      : r.profiles.display_name}
                  </span>
                  <span className="block font-sans text-xs text-muted truncate">
                    {r.profiles.role_title}
                  </span>
                </span>
                <span className="font-sans text-xs font-bold text-accent">
                  View →
                </span>
              </Link>
            ) : null,
          )}
          {responders.length === 0 && (
            <div className="bg-card border border-dashed border-line rounded-panel px-4 py-5 text-center">
              <p className="font-sans text-sm text-muted">
                {mine
                  ? "No responses yet. Share the link to your scene to get the first ones in."
                  : "No responses yet — be the first."}
              </p>
            </div>
          )}
        </div>

        {!mine && user && job.status === "open" && poster && (
          <RespondButton
            jobId={job.id}
            posterFirstName={poster.display_name.split(" ")[0]}
            alreadyResponded={alreadyResponded}
          />
        )}
      </div>
    </main>
  );
}
