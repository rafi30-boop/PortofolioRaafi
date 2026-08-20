"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}

export const Field = ({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  rows = 3,
  placeholder = "",
}: FieldProps) => {
  const baseClasses =
    "w-full rounded-xl border border-neutral-20 bg-white px-4 py-2.5 font-body-16px-regular text-neutral-100 outline-none transition-colors focus:border-neutral-100";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body-14px-medium text-neutral-60">{label}</span>
      {textarea ? (
        <textarea
          className={`${baseClasses} resize-y`}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={baseClasses}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
};