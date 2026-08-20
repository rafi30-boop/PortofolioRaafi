"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { PortfolioContent } from "@/lib/types";
import { Field } from "@/components/admin/Field";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { ObjectListEditor } from "@/components/admin/ObjectListEditor";

type Tab =
  | "site"
  | "specialties"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certificates";

const TABS: { id: Tab; label: string }[] = [
  { id: "site", label: "Site & Profile" },
  { id: "specialties", label: "Specialties" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
];

const socialFields = [
  { key: "label", label: "Label", type: "text" as const },
  { key: "href", label: "URL", type: "text" as const },
];

const linkFields = [
  { key: "label", label: "Label", type: "text" as const },
  { key: "href", label: "URL (href)", type: "text" as const },
];

const skillFields = [
  { key: "name", label: "Nama skill", type: "text" as const },
  { key: "level", label: "Level (0-100)", type: "text" as const },
];

const projectFields = [
  { key: "slug", label: "Slug (URL)", type: "text" as const },
  { key: "title", label: "Judul", type: "text" as const },
  { key: "category", label: "Kategori", type: "text" as const },
  { key: "year", label: "Tahun", type: "text" as const },
  { key: "description", label: "Deskripsi singkat", type: "textarea" as const, rows: 2 },
  { key: "image", label: "Gambar (opsional)", type: "image" as const },
  { key: "gradient", label: "Warna fallback (gradient CSS)", type: "textarea" as const, rows: 1 },
  { key: "tech", label: "Teknologi", type: "stringlist" as const, placeholder: "Tambahkan teknologi" },
  { key: "details", label: "Paragraf detail halaman", type: "stringlist" as const, placeholder: "Tambahkan paragraf" },
];

const experienceFields = [
  { key: "role", label: "Posisi", type: "text" as const },
  { key: "company", label: "Perusahaan", type: "text" as const },
  { key: "period", label: "Periode", type: "text" as const },
  { key: "description", label: "Deskripsi", type: "textarea" as const },
];

const educationFields = [
  { key: "degree", label: "Gelar / Jurusan", type: "text" as const },
  { key: "school", label: "Sekolah / Kampus", type: "text" as const },
  { key: "period", label: "Periode", type: "text" as const },
  { key: "description", label: "Deskripsi", type: "textarea" as const },
];

const certificateFields = [
  { key: "slug", label: "Slug (URL)", type: "text" as const },
  { key: "title", label: "Judul", type: "text" as const },
  { key: "issuer", label: "Penerbit", type: "text" as const },
  { key: "year", label: "Tahun", type: "text" as const },
  { key: "description", label: "Deskripsi singkat", type: "textarea" as const, rows: 2 },
  { key: "credentialUrl", label: "URL credential (opsional)", type: "text" as const },
  { key: "image", label: "Gambar (opsional)", type: "image" as const },
  { key: "gradient", label: "Warna fallback (gradient CSS)", type: "textarea" as const, rows: 1 },
  { key: "skills", label: "Skill yang didapat", type: "stringlist" as const, placeholder: "Tambahkan skill" },
  { key: "details", label: "Paragraf detail halaman", type: "stringlist" as const, placeholder: "Tambahkan paragraf" },
];

const initialContent = (): PortfolioContent => ({
  site: {
    name: "",
    firstName: "",
    role: "",
    title: "",
    headline: "",
    description: "",
    email: "",
    location: "",
    url: "",
    responseTime: "",
    socials: [],
    footerColumns: [[], [], []],
  },
  specialties: [],
  skills: [],
  projects: [],
  experiences: [],
  educations: [],
  certificates: [],
});

export default function AdminPage() {
  const [authState, setAuthState] = useState<"loading" | "guest" | "admin">(
    "loading"
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [content, setContent] = useState<PortfolioContent>(initialContent);
  const [activeTab, setActiveTab] = useState<Tab>("site");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [saveNote, setSaveNote] = useState("");

  const loadContent = useCallback(async () => {
    const response = await fetch("/api/content");
    if (response.status === 401) {
      setAuthState("guest");
      return;
    }
    if (response.ok) {
      setContent((await response.json()) as PortfolioContent);
      setAuthState("admin");
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setLoginError(result.error ?? "Login failed.");
        setLoginLoading(false);
        return;
      }

      setPassword("");
      await loadContent();
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthState("guest");
    setContent(initialContent());
  };

  const handleSave = async () => {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = (await response.json()) as {
        error?: string;
        note?: string;
      };

      if (!response.ok) {
        setSaveState("error");
        setSaveMessage(result.error ?? "Gagal menyimpan.");
        return;
      }

      setSaveState("done");
      setSaveMessage("Berhasil disimpan!");
      setSaveNote(result.note ?? "");
    } catch {
      setSaveState("error");
      setSaveMessage("Network error. Gagal menyimpan.");
    }
  };

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-neutral-20 border-t-neutral-100" />
      </div>
    );
  }

  if (authState === "guest") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-10 px-6">
        <div className="w-full max-w-[420px] rounded-3xl border border-neutral-20 bg-white p-10">
          <h1 className="font-heading-desktop-h5 text-neutral-100">Admin</h1>
          <p className="mt-2 font-body-16px-regular text-neutral-60">
            Masukkan password untuk mengelola konten portfolio.
          </p>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleLogin}
          >
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="rounded-xl border border-neutral-20 bg-white px-4 py-3 font-body-16px-regular text-neutral-100 outline-none transition-colors focus:border-neutral-100"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {loginError && (
              <p className="font-body-14px-medium text-red-600" role="alert">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="rounded-xl bg-neutral-100 px-6 py-3 font-body-16px-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loginLoading ? "Checking..." : "Login"}
            </button>
          </form>
          <p className="mt-6 font-body-14px-regular text-neutral-50">
            Password diatur lewat variabel <code>ADMIN_PASSWORD</code> di{" "}
            <code>.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-10">
      <aside className="flex w-full max-w-[260px] shrink-0 flex-col border-r border-neutral-20 bg-white">
        <div className="border-b border-neutral-20 px-6 py-5">
          <h1 className="font-heading-desktop-h6 text-neutral-100">Admin</h1>
          <p className="font-body-14px-medium text-neutral-50">
            Kelola konten portfolio
          </p>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Admin sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`rounded-xl px-4 py-2.5 text-left font-body-16px-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 ${
                activeTab === tab.id
                  ? "bg-neutral-100 text-white"
                  : "text-neutral-60 hover:bg-neutral-10 hover:text-neutral-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-neutral-20 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-neutral-20 px-4 py-2.5 text-center font-body-16px-semibold text-neutral-100 transition-colors hover:border-neutral-100"
          >
            Lihat situs
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl px-4 py-2.5 text-center font-body-16px-medium text-neutral-50 transition-colors hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="sticky top-0 z-10 -mx-8 mb-8 flex items-center justify-between border-b border-neutral-20 bg-neutral-10/90 px-8 py-4 backdrop-blur-sm">
          <h2 className="font-heading-desktop-h5 text-neutral-100">
            {TABS.find((tab) => tab.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <div className="flex flex-col items-end gap-1">
                <p
                  className={`font-body-14px-medium ${
                    saveState === "error" ? "text-red-600" : "text-neutral-60"
                  }`}
                  role="status"
                >
                  {saveMessage}
                </p>
                {saveNote && saveState === "done" && (
                  <p className="font-body-14px-regular text-neutral-50">
                    {saveNote}
                  </p>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="inline-flex items-center gap-2 rounded-[100px] bg-neutral-100 px-6 py-3 font-body-16px-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saveState === "saving" && (
                <span className="animate-spin h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
              )}
              {saveState === "saving" ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[900px] flex-col gap-8">
          {activeTab === "site" && (
            <>
              <div className="rounded-2xl border border-neutral-20 bg-white p-6">
                <h3 className="mb-4 font-body-22px-semibold text-neutral-100">
                  Profil
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label="Nama lengkap"
                    value={content.site.name}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, name: value },
                      }))
                    }
                  />
                  <Field
                    label="Nama panggilan"
                    value={content.site.firstName}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, firstName: value },
                      }))
                    }
                  />
                  <Field
                    label="Role"
                    value={content.site.role}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, role: value },
                      }))
                    }
                  />
                  <Field
                    label="Title"
                    value={content.site.title}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, title: value },
                      }))
                    }
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Headline (hero)"
                      textarea
                      rows={2}
                      value={content.site.headline}
                      onChange={(value) =>
                        setContent((prev) => ({
                          ...prev,
                          site: { ...prev.site, headline: value },
                        }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Deskripsi (SEO)"
                      textarea
                      rows={2}
                      value={content.site.description}
                      onChange={(value) =>
                        setContent((prev) => ({
                          ...prev,
                          site: { ...prev.site, description: value },
                        }))
                      }
                    />
                  </div>
                  <Field
                    label="Email"
                    value={content.site.email}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, email: value },
                      }))
                    }
                  />
                  <Field
                    label="Lokasi"
                    value={content.site.location}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, location: value },
                      }))
                    }
                  />
                  <Field
                    label="URL situs"
                    value={content.site.url}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, url: value },
                      }))
                    }
                  />
                  <Field
                    label="Waktu respons"
                    value={content.site.responseTime}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        site: { ...prev.site, responseTime: value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-20 bg-white p-6">
                <h3 className="mb-4 font-body-22px-semibold text-neutral-100">
                  Social media
                </h3>
                <ObjectListEditor
                  label="Link sosial"
                  items={content.site.socials as unknown as Record<string, unknown>[]}
                  fields={socialFields}
                  onChange={(items) =>
                    setContent((prev) => ({
                      ...prev,
                      site: {
                        ...prev.site,
                        socials: items as unknown as { label: string; href: string }[],
                      },
                    }))
                  }
                />
              </div>

              <div className="rounded-2xl border border-neutral-20 bg-white p-6">
                <h3 className="mb-4 font-body-22px-semibold text-neutral-100">
                  Link footer (kolom)
                </h3>
                {content.site.footerColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="mb-6 last:mb-0">
                    <h4 className="mb-2 font-body-16px-semibold text-neutral-70">
                      Kolom {columnIndex + 1}
                    </h4>
                    <ObjectListEditor
                      label={`Link kolom ${columnIndex + 1}`}
                      items={column as unknown as Record<string, unknown>[]}
                      fields={linkFields}
                      onChange={(items) =>
                        setContent((prev) => ({
                          ...prev,
                          site: {
                            ...prev.site,
                            footerColumns: prev.site.footerColumns.map(
                              (col, index) =>
                                index === columnIndex
                                  ? (items as unknown as {
                                      label: string;
                                      href: string;
                                    }[])
                                  : col
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "specialties" && (
            <div className="rounded-2xl border border-neutral-20 bg-white p-6">
              <StringListEditor
                label="Specialties (teks marquee hero)"
                values={content.specialties}
                onChange={(values) =>
                  setContent((prev) => ({ ...prev, specialties: values }))
                }
                placeholder="Tambahkan specialty"
              />
            </div>
          )}

          {activeTab === "skills" && (
            <div className="rounded-2xl border border-neutral-20 bg-white p-6">
              <ObjectListEditor
                label="Skill"
                items={content.skills as unknown as Record<string, unknown>[]}
                fields={skillFields}
                onChange={(items) =>
                  setContent((prev) => ({
                    ...prev,
                    skills: items as unknown as { name: string; level: number }[],
                  }))
                }
              />
            </div>
          )}

          {activeTab === "projects" && (
            <div className="rounded-2xl border border-neutral-20 bg-white p-6">
              <ObjectListEditor
                label="Project"
                items={content.projects as unknown as Record<string, unknown>[]}
                fields={projectFields}
                onChange={(items) =>
                  setContent((prev) => ({
                    ...prev,
                    projects: items as unknown as typeof prev.projects,
                  }))
                }
              />
            </div>
          )}

          {activeTab === "experience" && (
            <div className="rounded-2xl border border-neutral-20 bg-white p-6">
              <ObjectListEditor
                label="Pengalaman"
                items={content.experiences as unknown as Record<string, unknown>[]}
                fields={experienceFields}
                onChange={(items) =>
                  setContent((prev) => ({
                    ...prev,
                    experiences: items as unknown as typeof prev.experiences,
                  }))
                }
              />
            </div>
          )}

          {activeTab === "education" && (
            <div className="rounded-2xl border border-neutral-20 bg-white p-6">
              <ObjectListEditor
                label="Pendidikan"
                items={content.educations as unknown as Record<string, unknown>[]}
                fields={educationFields}
                onChange={(items) =>
                  setContent((prev) => ({
                    ...prev,
                    educations: items as unknown as typeof prev.educations,
                  }))
                }
              />
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="rounded-2xl border border-neutral-20 bg-white p-6">
              <ObjectListEditor
                label="Sertifikat"
                items={content.certificates as unknown as Record<string, unknown>[]}
                fields={certificateFields}
                onChange={(items) =>
                  setContent((prev) => ({
                    ...prev,
                    certificates: items as unknown as typeof prev.certificates,
                  }))
                }
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}