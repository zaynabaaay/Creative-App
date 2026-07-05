import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FindPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto px-5 pt-4">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em] mb-3">
          Find creatives
        </h1>
        <div className="text-center px-7 py-12">
          <div className="w-[60px] h-[60px] rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
            <span aria-hidden className="text-accent text-2xl">⌕</span>
          </div>
          <h3 className="font-display text-[19px] font-extrabold tracking-[-0.01em] mb-2">
            Search is coming
          </h3>
          <p className="font-sans text-[14.5px] text-muted leading-relaxed">
            Browse and search every creative in the scene — landing in an
            upcoming milestone.
          </p>
        </div>
      </div>
    </main>
  );
}
