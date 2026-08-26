import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { site } = await getContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#030712",
            }}
          />
          <span style={{ fontSize: 32, fontWeight: 700, color: "#030712" }}>
            {site.name}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: "#030712",
          }}
        >
          <span>
            {site.role} crafting{" "}
            <span style={{ color: "#9ca3af" }}>digital</span>
          </span>
          <span>experiences.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#4b5563",
          }}
        >
          <span>{site.location}</span>
          <span>{site.email}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}