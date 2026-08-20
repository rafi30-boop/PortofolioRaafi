"use client";

import { useState } from "react";

interface StringListEditorProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const StringListEditor = ({
  label,
  values,
  onChange,
  placeholder = "Add item",
}: StringListEditorProps) => {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    if (draft.trim()) {
      onChange([...values, draft.trim()]);
      setDraft("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="font-body-14px-medium text-neutral-60">{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-20 bg-neutral-10 px-3 py-1.5 font-body-14px-medium text-neutral-70"
          >
            {value}
            <button
              type="button"
              className="text-neutral-50 transition-colors hover:text-red-600"
              aria-label={`Remove ${value}`}
              onClick={() =>
                onChange(values.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          className="w-full min-w-[140px] flex-1 rounded-xl border border-neutral-20 bg-white px-4 py-2 font-body-16px-regular text-neutral-100 outline-none transition-colors focus:border-neutral-100"
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
        />
        <button
          type="button"
          className="rounded-xl bg-neutral-100 px-4 py-2 font-body-16px-semibold text-white transition-opacity hover:opacity-90"
          onClick={addItem}
        >
          Add
        </button>
      </div>
    </div>
  );
};