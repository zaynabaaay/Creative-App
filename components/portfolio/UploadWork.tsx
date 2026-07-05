"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";

export function UploadWork({
  userId,
  itemCount,
}: {
  userId: string;
  itemCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const supabase = createClient();
    const list = Array.from(files).slice(0, 10);

    for (let i = 0; i < list.length; i++) {
      setStatus(
        list.length > 1 ? `Uploading ${i + 1} of ${list.length}…` : "Uploading…",
      );
      try {
        const blob = await compressImage(list[i]);
        const path = `${userId}/${crypto.randomUUID()}.webp`;
        const { error: upErr } = await supabase.storage
          .from("portfolio")
          .upload(path, blob, { contentType: "image/webp" });
        if (upErr) throw upErr;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(path);

        const { error: dbErr } = await supabase.from("portfolio_items").insert({
          profile_id: userId,
          image_url: publicUrl,
          sort_order: itemCount + i,
        });
        if (dbErr) throw dbErr;
      } catch (e) {
        setStatus(
          e instanceof Error ? `Upload failed: ${e.message}` : "Upload failed.",
        );
        router.refresh();
        return;
      }
    }
    setStatus(null);
    router.refresh();
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status !== null && !status.startsWith("Upload failed")}
        className="w-full font-display text-[15px] font-bold py-3.5 rounded-panel border border-line bg-card text-ink disabled:text-faint"
      >
        {status ?? (itemCount === 0 ? "Add your first work" : "Add work")}
      </button>
    </>
  );
}
