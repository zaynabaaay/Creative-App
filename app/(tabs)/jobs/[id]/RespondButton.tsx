"use client";

import { useActionState } from "react";
import Link from "next/link";
import { respondToJob, type RespondState } from "./actions";

export function RespondButton({
  jobId,
  posterFirstName,
  alreadyResponded,
}: {
  jobId: string;
  posterFirstName: string;
  alreadyResponded: boolean;
}) {
  const [state, formAction, pending] = useActionState<RespondState, FormData>(
    () => respondToJob(jobId),
    {},
  );

  if (alreadyResponded || state.done) {
    return (
      <div className="w-full font-display text-base font-bold py-[15px] rounded-panel bg-[#E8F3EC] text-[#2E7D48] text-center">
        ✓ You responded — profile shared
      </div>
    );
  }

  if (state.needsPortfolio) {
    return (
      <div className="bg-accent-soft rounded-panel px-4 py-4 text-center">
        <p className="font-sans text-sm text-ink leading-relaxed mb-3">
          Your portfolio is what gets shared when you respond — add at least
          one piece of work first.
        </p>
        <Link
          href="/you"
          className="inline-block font-display text-sm font-bold px-4 py-2.5 rounded-panel bg-accent text-white"
        >
          Add work to your portfolio
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="w-full font-display text-base font-bold py-[15px] rounded-panel bg-accent text-white disabled:opacity-70"
      >
        {pending ? "Sending…" : "✦ Respond to this job"}
      </button>
      {state.error && (
        <p className="font-sans text-sm text-[#B4382E] text-center mt-2">
          {state.error}
        </p>
      )}
      <p className="font-sans text-[12.5px] text-faint text-center mt-2.5 leading-snug">
        Responding shares your portfolio with {posterFirstName}.
      </p>
    </form>
  );
}
