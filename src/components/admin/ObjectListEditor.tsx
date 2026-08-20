"use client";

import { useState } from "react";
import { Field } from "./Field";
import { StringListEditor } from "./StringListEditor";
import { ImageInput } from "./ImageInput";

export type FieldSpec =
  | { key: string; label: string; type: "text" }
  | { key: string; label: string; type: "textarea"; rows?: number }
  | { key: string; label: string; type: "stringlist"; placeholder?: string }
  | { key: string; label: string; type: "image" };

interface ObjectListEditorProps {
  label: string;
  items: Record<string, unknown>[];
  fields: FieldSpec[];
  onChange: (items: Record<string, unknown>[]) => void;
}

function createEmpty(fields: FieldSpec[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const field of fields) {
    item[field.key] = field.type === "stringlist" ? [] : "";
  }
  return item;
}

export const ObjectListEditor = ({
  label,
  items,
  fields,
  onChange,
}: ObjectListEditorProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const updateItem = (index: number, key: string, value: unknown) => {
    const next = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item
    );
    onChange(next);
  };

  const addItem = () => {
    const next = [...items, createEmpty(fields)];
    onChange(next);
    setOpenIndex(next.length - 1);
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
    setOpenIndex(null);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) {
      return;
    }
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex(target);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-body-14px-medium text-neutral-60">{label}</span>
        <button
          type="button"
          className="rounded-xl bg-neutral-100 px-4 py-2 font-body-16px-semibold text-white transition-opacity hover:opacity-90"
          onClick={addItem}
        >
          + Add {label}
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-neutral-20 bg-neutral-10"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              className="flex-1 truncate text-left font-body-16px-semibold text-neutral-100"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              aria-expanded={openIndex === index}
            >
              {String(item.title ?? item.role ?? item.degree ?? item.name ?? `Item ${index + 1}`)}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-20 px-2.5 py-1 font-body-14px-medium text-neutral-60 transition-colors hover:border-neutral-100 disabled:opacity-30"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                aria-label="Move up"
              >
                &uarr;
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-20 px-2.5 py-1 font-body-14px-medium text-neutral-60 transition-colors hover:border-neutral-100 disabled:opacity-30"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                aria-label="Move down"
              >
                &darr;
              </button>
              <button
                type="button"
                className="rounded-lg px-2.5 py-1 font-body-14px-medium text-red-600 transition-colors hover:bg-red-50"
                onClick={() => removeItem(index)}
                aria-label={`Delete item ${index + 1}`}
              >
                Delete
              </button>
            </div>
          </div>

          {openIndex === index && (
            <div className="grid grid-cols-1 gap-4 border-t border-neutral-20 p-4 md:grid-cols-2">
              {fields.map((field) => {
                const value = item[field.key];
                const stringValue = String(value ?? "");
                const listValue = Array.isArray(value)
                  ? (value as string[])
                  : stringValue
                    ? [stringValue]
                    : [];

                if (field.type === "stringlist") {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <StringListEditor
                        label={field.label}
                        values={listValue}
                        onChange={(values) =>
                          updateItem(index, field.key, values)
                        }
                        placeholder={field.placeholder}
                      />
                    </div>
                  );
                }

                if (field.type === "image") {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <ImageInput
                        label={field.label}
                        value={stringValue}
                        onChange={(value) => updateItem(index, field.key, value)}
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.key}>
                    <Field
                      label={field.label}
                      textarea={field.type === "textarea"}
                      rows={field.type === "textarea" ? field.rows : 3}
                      value={stringValue}
                      onChange={(value) => updateItem(index, field.key, value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};