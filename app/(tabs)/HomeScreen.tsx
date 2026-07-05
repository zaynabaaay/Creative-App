"use client";

import { useState } from "react";
import Link from "next/link";
import type { JobWithCount } from "@/lib/data/jobs";
import { JobCard } from "@/components/jobs/JobCard";

const FILTERS = ["All", "Photo", "Video", "MUA", "Lighting", "Styling"];

function EmptyState({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="text-center px-7 py-12">
      <div className="w-[60px] h-[60px] rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
        <span aria-hidden className="text-accent text-2xl">✦</span>
      </div>
      <h3 className="font-display text-[19px] font-extrabold tracking-[-0.01em] mb-2">
        {title}
      </h3>
      <p className="font-sans text-[14.5px] text-muted leading-relaxed mb-5">
        {body}
      </p>
      <Link
        href={href}
        className="inline-block font-display text-[15px] font-bold px-5 py-3 rounded-panel bg-accent text-white"
      >
        {cta}
      </Link>
    </div>
  );
}

export function HomeScreen({
  openJobs,
  myJobs,
  area,
}: {
  openJobs: JobWithCount[];
  myJobs: JobWithCount[];
  area: string;
}) {
  const [mode, setMode] = useState<"working" | "hiring">("working");
  const [filter, setFilter] = useState("All");

  const feed =
    filter === "All"
      ? openJobs
      : openJobs.filter((j) => j.disciplines.includes(filter));

  return (
    <div className="max-w-[480px] mx-auto w-full pb-6">
      <div className="px-5 pt-4 pb-3.5">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em] mb-3">
          {mode === "working" ? "Find work" : "Your jobs"}
        </h1>
        <div className="flex bg-chip rounded-[12px] p-1 gap-1" role="tablist">
          {(
            [
              ["working", "I’m working"],
              ["hiring", "I’m hiring"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={`flex-1 font-display text-sm font-bold py-[9px] rounded-[9px] transition-all ${
                mode === value ? "bg-card text-ink shadow-sm" : "text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "working" ? (
        <>
          <p className="font-sans text-sm text-muted px-5 mb-3">
            {area && <span className="font-semibold">{area} · </span>}
            {feed.length === 0
              ? "Nothing open here yet"
              : `${feed.length} job${feed.length === 1 ? "" : "s"} open — from single gigs to full crews`}
          </p>
          <div className="flex gap-2 overflow-x-auto px-5 pb-3.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`font-sans text-[13px] font-semibold px-3.5 py-[7px] rounded-full border whitespace-nowrap transition-colors ${
                  filter === f
                    ? "bg-accent border-accent text-white"
                    : "bg-card border-line text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {feed.length === 0 ? (
            <EmptyState
              title="No open jobs in your area"
              body="The fix isn’t more browsing — it’s the first few real jobs. Post one, whether you need a single photographer or a whole crew, and creatives start showing up."
              cta="Post the first job"
              href="/post"
            />
          ) : (
            <div className="flex flex-col gap-3 px-4">
              {feed.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="font-sans text-sm text-muted px-5 mb-3.5">
            {myJobs.length === 0
              ? "You haven’t posted anything yet"
              : `${myJobs.length} job${myJobs.length === 1 ? "" : "s"} you’ve posted`}
          </p>
          {myJobs.length === 0 ? (
            <EmptyState
              title="Post your first job"
              body="Tell people what you need — one photographer for your baked goods, or a whole crew for a shoot. The right creatives respond and you review them here."
              cta="Post a job"
              href="/post"
            />
          ) : (
            <div className="flex flex-col gap-3 px-4">
              {myJobs.map((j) => (
                <JobCard key={j.id} job={j} mine />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
