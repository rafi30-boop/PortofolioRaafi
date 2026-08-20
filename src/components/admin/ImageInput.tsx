"use client";

import { useRef, useState } from "react";

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ImageInput = ({ label, value, onChange }: ImageInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        setUploadError(result.error ?? "Upload failed.");
        return;
      }

      onChange(result.url);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="font-body-14px-medium text-neutral-60">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="w-full flex-1 rounded-xl border border-neutral-20 bg-white px-4 py-2 font-body-16px-regular text-neutral-100 outline-none transition-colors focus:border-neutral-100"
          value={value}
          placeholder="/uploads/nama-file.png (atau URL gambar)"
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          id={`file-${label}`}
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-20 px-4 py-2 font-body-16px-semibold text-neutral-100 transition-colors hover:border-neutral-100"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Preview"
            className="h-12 w-20 rounded-lg border border-neutral-20 object-cover"
          />
        )}
      </div>
      {uploadError && (
        <span className="font-body-14px-medium text-red-600">
          {uploadError}
        </span>
      )}
    </div>
  );
};