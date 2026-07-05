import { TabBar } from "@/components/TabBar";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let signedIn = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 flex flex-col">{children}</div>
      {signedIn && <TabBar />}
    </div>
  );
}
