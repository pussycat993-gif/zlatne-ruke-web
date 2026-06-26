import type { ReactNode } from "react";

const labelClass =
  "mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-pink-dark";
const controlClass =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-pink-dark outline-none placeholder:text-ink-soft focus:border-pink";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function TextField(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  const { label, className, ...rest } = props;
  return (
    <Field label={label}>
      <input className={`${controlClass} ${className ?? ""}`} {...rest} />
    </Field>
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string },
) {
  const { label, className, ...rest } = props;
  return (
    <Field label={label}>
      <textarea
        className={`${controlClass} resize-y ${className ?? ""}`}
        {...rest}
      />
    </Field>
  );
}

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: { value: string; label: string }[];
  },
) {
  const { label, options, className, ...rest } = props;
  return (
    <Field label={label}>
      <select className={`${controlClass} ${className ?? ""}`} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
