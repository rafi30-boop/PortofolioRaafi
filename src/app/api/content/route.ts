import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { isAuthorized } from "@/lib/auth";
import type { PortfolioContent } from "@/lib/types";

export const runtime = "nodejs";

function clean(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

function validateContent(input: unknown): PortfolioContent {
  const content = input as PortfolioContent;

  if (!content || typeof content !== "object") {
    throw new Error("Invalid content.");
  }

  const site = content.site ?? {};
  const socials = Array.isArray(site.socials) ? site.socials : [];
  const footerColumns = Array.isArray(site.footerColumns)
    ? site.footerColumns
    : [];

  const siteConfig = {
    name: clean(String(site.name ?? "")) || "Raafi Fajar",
    firstName: clean(String(site.firstName ?? "")) || "Raafi",
    role: clean(String(site.role ?? "")),
    title: clean(String(site.title ?? "")),
    headline: clean(String(site.headline ?? "")),
    description: clean(String(site.description ?? "")),
    email: clean(String(site.email ?? "")),
    location: clean(String(site.location ?? "")),
    url: clean(String(site.url ?? "http://localhost:3000")),
    responseTime: clean(String(site.responseTime ?? "")),
    socials: socials
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const link = item as { label?: string; href?: string };
        return {
          label: clean(String(link.label ?? "")),
          href: clean(String(link.href ?? "")),
        };
      }),
    footerColumns: footerColumns.map((column: unknown[]) =>
      (Array.isArray(column) ? column : [])
        .filter((item) => item && typeof item === "object")
        .map((item) => {
          const link = item as { label?: string; href?: string };
          return {
            label: clean(String(link.label ?? "")),
            href: clean(String(link.href ?? "")),
          };
        })
    ),
  };

  return {
    site: siteConfig,
    specialties: (Array.isArray(content.specialties) ? content.specialties : [])
      .map((item) => clean(String(item ?? "")))
      .filter(Boolean),
    skills: (Array.isArray(content.skills) ? content.skills : [])
      .filter((item) => item && typeof item === "object")
      .map((item: { name?: string; level?: number }) => ({
        name: clean(String(item.name ?? "")),
        level: Math.min(100, Math.max(0, Number(item.level ?? 0) || 0)),
      })),
    projects: (Array.isArray(content.projects) ? content.projects : [])
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        slug: clean(String(item.slug ?? "")) || clean(String(item.title ?? "")).toLowerCase().replace(/\s+/g, "-"),
        title: clean(String(item.title ?? "")),
        category: clean(String(item.category ?? "")),
        description: clean(String(item.description ?? "")),
        year: clean(String(item.year ?? "")),
        image: clean(String(item.image ?? "")),
        gradient: clean(String(item.gradient ?? "")) || "linear-gradient(135deg, #030712 0%, #1e3a8a 100%)",
        tech: (Array.isArray(item.tech) ? item.tech : [])
          .map((tech) => clean(String(tech ?? "")))
          .filter(Boolean),
        details: (Array.isArray(item.details) ? item.details : [])
          .map((detail) => clean(String(detail ?? "")))
          .filter(Boolean),
      })),
    experiences: (Array.isArray(content.experiences) ? content.experiences : [])
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        role: clean(String(item.role ?? "")),
        company: clean(String(item.company ?? "")),
        period: clean(String(item.period ?? "")),
        description: clean(String(item.description ?? "")),
      })),
    educations: (Array.isArray(content.educations) ? content.educations : [])
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        degree: clean(String(item.degree ?? "")),
        school: clean(String(item.school ?? "")),
        period: clean(String(item.period ?? "")),
        description: clean(String(item.description ?? "")),
      })),
    certificates: (Array.isArray(content.certificates) ? content.certificates : [])
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        slug: clean(String(item.slug ?? "")) || clean(String(item.title ?? "")).toLowerCase().replace(/\s+/g, "-"),
        title: clean(String(item.title ?? "")),
        issuer: clean(String(item.issuer ?? "")),
        year: clean(String(item.year ?? "")),
        description: clean(String(item.description ?? "")),
        credentialUrl: clean(String(item.credentialUrl ?? "")),
        image: clean(String(item.image ?? "")),
        gradient: clean(String(item.gradient ?? "")) || "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
        details: (Array.isArray(item.details) ? item.details : [])
          .map((detail) => clean(String(detail ?? "")))
          .filter(Boolean),
        skills: (Array.isArray(item.skills) ? item.skills : [])
          .map((skill) => clean(String(skill ?? "")))
          .filter(Boolean),
      })),
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const content = validateContent(input);
    await saveContent(content);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid content." },
      { status: 400 }
    );
  }
}