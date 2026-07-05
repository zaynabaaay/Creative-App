export function StatCards({
  collabs,
  vouches,
  ownProfile = false,
}: {
  collabs: number;
  vouches: number;
  ownProfile?: boolean;
}) {
  if (collabs === 0 && vouches === 0 && !ownProfile) {
    return (
      <div className="bg-accent-soft rounded-panel px-4 py-3.5 mb-4">
        <div className="font-display text-[13px] font-extrabold uppercase tracking-[0.05em] text-accent mb-1">
          New here
        </div>
        <p className="font-sans text-[13.5px] text-ink/85 leading-relaxed">
          No collabs on the app yet. Be their first — it’s how track records
          start.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 mb-4">
      <div className="flex-1 bg-card border border-line rounded-panel px-3.5 py-3">
        <div className="font-display text-[22px] font-extrabold text-ink">
          {collabs}
        </div>
        <div className="font-sans text-xs font-semibold text-muted">
          collabs on here
        </div>
      </div>
      <div className="flex-1 bg-card border border-line rounded-panel px-3.5 py-3">
        <div className="font-display text-[22px] font-extrabold text-accent">
          ♥ {vouches}
        </div>
        <div className="font-sans text-xs font-semibold text-muted">
          vouched by
        </div>
      </div>
    </div>
  );
}
