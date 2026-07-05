export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-frame p-4">
      <div className="w-full max-w-[400px] bg-paper rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)] px-7 py-12 flex flex-col gap-6">
        <div>
          <span className="inline-block font-display text-[11px] font-bold uppercase tracking-[0.06em] text-accent bg-accent-soft px-2 py-1 rounded-md">
            It’s alive
          </span>
          <h1 className="font-display text-[34px] font-extrabold tracking-[-0.02em] leading-[1.08] mt-4">
            Creative Hub
          </h1>
          <p className="font-sans text-[15px] leading-relaxed text-muted mt-3">
            Post what you need — one person or a whole crew. A hiring hub for
            photographers, videographers, and the creatives around them.
          </p>
        </div>

        <div className="border-t border-line pt-5 flex flex-col gap-3">
          <div className="font-display text-xs font-bold uppercase tracking-[0.05em] text-faint">
            Being built, step by step
          </div>
          <ul className="flex flex-col gap-2">
            {[
              ["Foundation deployed", true],
              ["Sign up & log in", false],
              ["Your portfolio", false],
              ["Post a job & respond", false],
              ["Messages", false],
            ].map(([label, done]) => (
              <li
                key={label as string}
                className="flex items-center gap-2.5 font-sans text-sm"
              >
                <span
                  className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] font-bold ${
                    done
                      ? "bg-accent text-white"
                      : "border border-line text-transparent"
                  }`}
                  aria-hidden
                >
                  ✓
                </span>
                <span className={done ? "text-ink font-semibold" : "text-muted"}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-sans text-[12.5px] text-faint leading-relaxed">
          You’re looking at the very first deploy — the design foundation and
          nothing else. Everything above lands here as it’s built.
        </p>
      </div>
    </main>
  );
}
