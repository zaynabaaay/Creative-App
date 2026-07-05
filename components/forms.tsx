import type {
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-display text-xs font-bold uppercase tracking-[0.05em] text-faint mt-4 mb-2"
    >
      {children}
      {hint && (
        <span className="normal-case font-medium text-faint"> {hint}</span>
      )}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full font-sans text-[15px] px-[15px] py-[13px] rounded-field border border-line bg-card text-ink placeholder:text-faint ${props.className ?? ""}`}
    />
  );
}

export function PrimaryButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full font-display text-base font-bold py-[15px] rounded-panel bg-accent text-white disabled:bg-chip disabled:text-faint transition-colors ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="font-sans text-sm text-[#B4382E] bg-[#FBEAE8] rounded-panel px-4 py-3 mt-4"
    >
      {children}
    </p>
  );
}
