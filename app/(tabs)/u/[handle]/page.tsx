import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProfileBundle } from "@/lib/data/profiles";
import { AvatarCircle } from "@/components/Avatar";
import { StatCards } from "@/components/StatCards";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const bundle = await getProfileBundle({ handle });
  if (!bundle) notFound();
  const { profile, items, stats } = bundle;

  return (
    <main className="flex-1 bg-paper">
      <div className="max-w-[480px] mx-auto pb-10">
        <div className="px-3 py-2.5 border-b border-line flex items-center gap-1">
          <Link
            href="/find"
            aria-label="Back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink text-xl"
          >
            ‹
          </Link>
          <span className="font-display text-base font-bold">Portfolio</span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-3 gap-[3px]">
            {items.map((item) => (
              <div key={item.id} className="relative aspect-square">
                <Image
                  src={item.image_url}
                  alt={item.caption || `Work by ${profile.display_name}`}
                  fill
                  sizes="(max-width: 480px) 33vw, 160px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-5 mt-4 bg-card border border-dashed border-line rounded-panel px-4 py-6 text-center">
            <p className="font-sans text-sm text-muted">
              No work uploaded yet.
            </p>
          </div>
        )}

        <div className="px-5 pt-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
                {profile.display_name}
              </h1>
              <div className="font-sans text-sm text-muted mt-0.5">
                @{profile.handle}
              </div>
            </div>
            <AvatarCircle
              name={profile.display_name}
              seed={profile.id}
              imageUrl={profile.avatar_url}
              size={52}
            />
          </div>

          {profile.role_title && (
            <p className="font-sans text-[15px] font-semibold mt-3">
              {profile.role_title}
            </p>
          )}
          {(profile.area || profile.rate) && (
            <div className="font-sans text-[13.5px] text-muted font-semibold mt-1">
              {[profile.area, profile.rate].filter(Boolean).join(" · ")}
            </div>
          )}
          {profile.bio && (
            <p className="font-sans text-[15px] leading-relaxed mt-3">
              {profile.bio}
            </p>
          )}

          <div className="mt-5">
            <StatCards
              collabs={stats.collabs_count}
              vouches={stats.vouches_count}
            />
          </div>

          {profile.disciplines.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {profile.disciplines.map((d) => (
                <span
                  key={d}
                  className="font-sans text-[12.5px] font-semibold bg-chip px-2.5 py-1 rounded-[7px]"
                >
                  {d}
                </span>
              ))}
            </div>
          )}

          {/* Messaging lands in a later milestone; the button shows the
              shape of the screen without pretending to work. */}
          <button
            disabled
            className="w-full font-display text-base font-bold py-[15px] rounded-panel bg-chip text-faint"
          >
            Message {profile.display_name.split(" ")[0]} — coming soon
          </button>
        </div>
      </div>
    </main>
  );
}
