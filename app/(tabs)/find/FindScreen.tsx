"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CreativeCard } from "@/lib/data/creatives";
import { AvatarCircle } from "@/components/Avatar";

const FILTERS = ["All", "Photo", "Video", "MUA", "Lighting", "Styling"];

export function FindScreen({ creatives }: { creatives: CreativeCard[] }) {
  const [q, setQ] = useState("");
  const [disc, setDisc] = useState("All");

  const needle = q.trim().toLowerCase();
  const list = creatives.filter(
    (c) =>
      (disc === "All" || c.disciplines.includes(disc)) &&
      (needle === "" ||
        c.display_name.toLowerCase().includes(needle) ||
        c.role_title.toLowerCase().includes(needle) ||
        c.area.toLowerCase().includes(needle)),
  );

  return (
    <div className="px-5 pb-6">
      <label className="flex items-center gap-2 bg-card border border-line rounded-full px-4 py-[11px] mb-3">
        <span aria-hidden className="text-muted">⌕</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, role, city…"
          aria-label="Search creatives"
          className="flex-1 font-sans text-[15px] bg-transparent outline-none placeholder:text-faint"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setDisc(f)}
            aria-pressed={disc === f}
            className={`font-sans text-[13px] font-semibold px-3.5 py-[7px] rounded-full border whitespace-nowrap transition-colors ${
              disc === f
                ? "bg-accent border-accent text-white"
                : "bg-card border-line text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/u/${c.handle}`}
            className="flex items-center gap-3 bg-card border border-line rounded-2xl p-3"
          >
            {c.thumbs.length > 0 ? (
              <span
                className={`grid gap-[2px] w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 ${
                  c.thumbs.length >= 4 ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {(c.thumbs.length >= 4 ? c.thumbs : c.thumbs.slice(0, 1)).map((t, i) => (
                  <span key={i} className="relative block">
                    <Image
                      src={t}
                      alt=""
                      fill
                      sizes="26px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </span>
            ) : (
              <AvatarCircle
                name={c.display_name}
                seed={c.id}
                imageUrl={c.avatar_url}
                size={52}
              />
            )}
            <span className="flex-1 min-w-0">
              <span className="block font-sans text-[15px] font-bold">
                {c.display_name}
              </span>
              <span className="block font-sans text-[12.5px] text-muted truncate">
                {c.role_title}
              </span>
              <span className="block font-sans text-xs text-accent font-semibold mt-[3px]">
                {c.area || "Somewhere near you"}
                {c.collabs_count > 0
                  ? ` · ${c.collabs_count} collabs`
                  : " · new here"}
              </span>
            </span>
          </Link>
        ))}
        {list.length === 0 && (
          <p className="font-sans text-sm text-muted text-center py-6">
            {creatives.length === 0
              ? "No creatives here yet — invite your scene and this page fills up."
              : "No one matches yet. Try a different filter."}
          </p>
        )}
      </div>
    </div>
  );
}
