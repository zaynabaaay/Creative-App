"use client";

import { useActionState, useState } from "react";
import { updateProfile, type EditState } from "./actions";
import type { Profile } from "@/lib/types";
import { DISCIPLINES } from "@/lib/types";
import {
  FieldLabel,
  TextInput,
  PrimaryButton,
  FormError,
} from "@/components/forms";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState<EditState, FormData>(
    updateProfile,
    {},
  );
  const [selected, setSelected] = useState<string[]>(profile.disciplines);

  const toggle = (d: string) =>
    setSelected((cur) =>
      cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
    );

  return (
    <form action={formAction} className="mt-2">
      <FieldLabel htmlFor="display_name">Your name</FieldLabel>
      <TextInput
        id="display_name"
        name="display_name"
        required
        maxLength={80}
        defaultValue={profile.display_name}
      />

      <FieldLabel htmlFor="role_title" hint="(what you do, in your words)">
        Role title
      </FieldLabel>
      <TextInput
        id="role_title"
        name="role_title"
        maxLength={120}
        defaultValue={profile.role_title}
        placeholder="e.g. Portrait photographer — natural light"
      />

      <FieldLabel htmlFor="bio">Bio</FieldLabel>
      <textarea
        id="bio"
        name="bio"
        maxLength={600}
        rows={4}
        defaultValue={profile.bio}
        placeholder="What you shoot, how you work, what you care about."
        className="w-full font-sans text-[15px] px-[15px] py-[13px] rounded-field border border-line bg-card text-ink placeholder:text-faint resize-none"
      />

      <FieldLabel htmlFor="area">Area</FieldLabel>
      <TextInput
        id="area"
        name="area"
        maxLength={80}
        defaultValue={profile.area}
        placeholder="e.g. Hintonburg, Ottawa"
      />

      <FieldLabel htmlFor="rate" hint="(optional — shown on your profile)">
        Rate
      </FieldLabel>
      <TextInput
        id="rate"
        name="rate"
        maxLength={60}
        defaultValue={profile.rate}
        placeholder="e.g. $250–350 / day"
      />

      <FieldLabel htmlFor="disciplines-group">Disciplines</FieldLabel>
      <div id="disciplines-group" className="flex flex-wrap gap-2">
        {DISCIPLINES.map((d) => {
          const active = selected.includes(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              aria-pressed={active}
              className={`font-sans text-[12.5px] font-semibold px-3 py-[6px] rounded-full border transition-colors ${
                active
                  ? "bg-accent border-accent text-white"
                  : "bg-card border-line text-ink"
              }`}
            >
              {d}
            </button>
          );
        })}
        {selected.map((d) => (
          <input key={d} type="hidden" name="disciplines" value={d} />
        ))}
      </div>

      <label className="flex items-center gap-2.5 mt-5 font-sans text-sm font-semibold text-ink">
        <input
          type="checkbox"
          name="is_available"
          defaultChecked={profile.is_available}
          className="w-4 h-4 accent-[#2743E8]"
        />
        Open to work right now
      </label>

      <FormError>{state.error}</FormError>
      <div className="mt-6">
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </PrimaryButton>
      </div>
    </form>
  );
}
