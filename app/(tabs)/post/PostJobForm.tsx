"use client";

import { useActionState, useState } from "react";
import { postJob, type PostJobState } from "./actions";
import { JOB_ROLES } from "@/lib/jobs";
import {
  FieldLabel,
  TextInput,
  PrimaryButton,
  FormError,
} from "@/components/forms";

export function PostJobForm({
  defaultArea,
  defaultKind,
}: {
  defaultArea: string;
  defaultKind: "creative" | "client";
}) {
  const [state, formAction, pending] = useActionState<PostJobState, FormData>(
    postJob,
    {},
  );
  const [roles, setRoles] = useState<string[]>([]);
  const [kind, setKind] = useState<"creative" | "client">(defaultKind);

  const toggleRole = (r: string) =>
    setRoles((cur) =>
      cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r],
    );

  return (
    <form action={formAction} className="mt-2">
      <FieldLabel htmlFor="title">What do you need?</FieldLabel>
      <TextInput
        id="title"
        name="title"
        required
        maxLength={120}
        placeholder="e.g. Photos of my baked goods for Instagram"
      />

      <FieldLabel htmlFor="roles-group" hint="(pick one, or more for a crew)">
        Who do you need?
      </FieldLabel>
      <div id="roles-group" className="flex flex-wrap gap-2">
        {JOB_ROLES.map((r) => {
          const active = roles.includes(r);
          return (
            <button
              key={r}
              type="button"
              onClick={() => toggleRole(r)}
              aria-pressed={active}
              className={`font-sans text-xs font-semibold px-2.5 py-[5px] rounded-full border transition-colors ${
                active
                  ? "bg-accent border-accent text-white"
                  : "bg-card border-line text-ink"
              }`}
            >
              {r}
            </button>
          );
        })}
        {roles.map((r) => (
          <input key={r} type="hidden" name="roles" value={r} />
        ))}
      </div>

      <FieldLabel htmlFor="area">Area</FieldLabel>
      <TextInput
        id="area"
        name="area"
        required
        maxLength={80}
        defaultValue={defaultArea}
        placeholder="e.g. Westboro, Ottawa"
      />

      <FieldLabel htmlFor="budget" hint="(optional)">
        Budget
      </FieldLabel>
      <TextInput
        id="budget"
        name="budget"
        maxLength={60}
        placeholder="e.g. $120 flat"
      />

      <FieldLabel htmlFor="date" hint="(optional)">
        When
      </FieldLabel>
      <TextInput id="date" name="date" type="date" />

      <FieldLabel htmlFor="brief" hint="(optional but helps — a sentence or two)">
        The brief
      </FieldLabel>
      <textarea
        id="brief"
        name="brief"
        maxLength={2000}
        rows={4}
        placeholder="What’s the job, what’s the vibe, anything worth knowing."
        className="w-full font-sans text-[15px] px-[15px] py-[13px] rounded-field border border-line bg-card text-ink placeholder:text-faint resize-none"
      />

      <FieldLabel htmlFor="poster-kind">Posting as</FieldLabel>
      <div id="poster-kind" className="flex bg-chip rounded-[12px] p-1 gap-1">
        {(
          [
            ["client", "A client"],
            ["creative", "A creative"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            aria-pressed={kind === value}
            className={`flex-1 font-display text-sm font-bold py-2 rounded-[9px] transition-all ${
              kind === value ? "bg-card text-ink shadow-sm" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <input type="hidden" name="poster_kind" value={kind} />
      <p className="font-sans text-xs text-faint mt-2 leading-relaxed">
        “A client” = you’re hiring for yourself or your business. “A creative”
        = you’re crewing up for a shoot you’re running.
      </p>

      <FormError>{state.error}</FormError>
      <div className="mt-6">
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Posting…" : "Post job"}
        </PrimaryButton>
      </div>
    </form>
  );
}
