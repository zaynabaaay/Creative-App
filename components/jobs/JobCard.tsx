import Link from "next/link";
import type { JobWithCount } from "@/lib/data/jobs";

export function formatJobDate(iso: string | null) {
  if (!iso) return "Soon";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    day: "numeric",
    month: "short",
  });
}

export function JobCard({
  job,
  mine = false,
}: {
  job: JobWithCount;
  mine?: boolean;
}) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block text-left bg-card border border-line rounded-card p-4"
    >
      {!mine && (
        <div className="flex justify-between items-start gap-2.5">
          <span
            className={`font-display text-[11px] font-bold uppercase tracking-[0.04em] px-2 py-[3px] rounded-md ${
              job.poster_kind === "client"
                ? "text-[#9C7A2E] bg-[#FBF3DD]"
                : "text-accent bg-accent-soft"
            }`}
          >
            {job.poster_kind} posting
          </span>
          <span className="font-sans text-xs text-faint font-semibold whitespace-nowrap">
            {formatJobDate(job.date)}
          </span>
        </div>
      )}
      <h3 className="font-display text-lg font-bold tracking-[-0.01em] leading-tight mt-2.5 mb-2">
        {job.title}
      </h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.roles.map((r) => (
          <span
            key={r}
            className="font-sans text-xs font-semibold bg-chip px-2 py-1 rounded-[7px]"
          >
            {r}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center border-t border-line-soft pt-2.5">
        <span className="font-sans text-[13px] text-muted font-semibold">
          {job.area} · {job.budget ?? "Budget TBC"}
        </span>
        <span
          className={`font-sans text-[13px] font-bold ${
            job.response_count ? "text-accent" : "text-faint"
          }`}
        >
          {mine
            ? job.response_count
              ? `${job.response_count} responded`
              : "Waiting…"
            : `⌾ ${job.response_count}`}
        </span>
      </div>
    </Link>
  );
}
