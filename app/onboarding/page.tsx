"use client";

import { useActionState } from "react";
import { createProfile, type OnboardingState } from "../(auth)/actions";
import {
  FieldLabel,
  TextInput,
  PrimaryButton,
  FormError,
} from "@/components/forms";

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState<
    OnboardingState,
    FormData
  >(createProfile, {});

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-paper px-5 py-10">
      <div className="w-full max-w-[400px]">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">
          Who are you here?
        </h1>
        <p className="font-sans text-sm text-muted mt-1">
          Just the basics — you can add your portfolio and the rest any time.
        </p>

        <form action={formAction} className="mt-4">
          <FieldLabel htmlFor="display_name">Your name</FieldLabel>
          <TextInput
            id="display_name"
            name="display_name"
            required
            maxLength={80}
            placeholder="e.g. Maya Okonkwo"
          />
          <FieldLabel htmlFor="handle">Handle</FieldLabel>
          <TextInput
            id="handle"
            name="handle"
            required
            placeholder="e.g. maya.shoots"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <FieldLabel htmlFor="role_title" hint="(optional — skip if you’re just hiring)">
            What you do
          </FieldLabel>
          <TextInput
            id="role_title"
            name="role_title"
            maxLength={120}
            placeholder="e.g. Portrait photographer"
          />
          <FieldLabel htmlFor="area" hint="(optional)">
            Area
          </FieldLabel>
          <TextInput
            id="area"
            name="area"
            maxLength={80}
            placeholder="e.g. Hintonburg, Ottawa"
          />
          <FormError>{state.error}</FormError>
          <div className="mt-6">
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? "Setting up…" : "Let’s go"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  );
}
