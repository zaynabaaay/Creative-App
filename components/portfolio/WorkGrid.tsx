"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioItem } from "@/lib/types";

export function WorkGrid({
  items,
  editable = false,
}: {
  items: PortfolioItem[];
  editable?: boolean;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(item: PortfolioItem) {
    if (!confirm("Remove this image from your portfolio?")) return;
    setBusyId(item.id);
    const supabase = createClient();
    await supabase.from("portfolio_items").delete().eq("id", item.id);
    // Also remove the file itself so storage doesn't fill with orphans.
    const path = item.image_url.split("/public/portfolio/")[1];
    if (path) await supabase.storage.from("portfolio").remove([path]);
    setBusyId(null);
    router.refresh();
  }

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-[3px]">
      {items.map((item, i) => (
        <div key={item.id} className="relative aspect-square">
          <Image
            src={item.image_url}
            alt={item.caption || `Work ${i + 1}`}
            fill
            sizes="(max-width: 480px) 33vw, 160px"
            className={`object-cover ${i === 0 ? "rounded-tl-[10px]" : ""} ${
              i === 2 ? "rounded-tr-[10px]" : ""
            } ${busyId === item.id ? "opacity-40" : ""}`}
          />
          {editable && (
            <button
              onClick={() => remove(item)}
              disabled={busyId === item.id}
              aria-label="Remove image"
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-ink/70 text-white text-sm font-bold flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
