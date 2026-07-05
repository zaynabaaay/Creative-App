import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listCreatives } from "@/lib/data/creatives";
import { FindScreen } from "./FindScreen";

export default async function FindPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/find");

  const creatives = await listCreatives(user.id);

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto w-full">
        <div className="px-5 pt-4 pb-3">
          <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">
            Find creatives
          </h1>
        </div>
        <FindScreen creatives={creatives} />
      </div>
    </main>
  );
}
