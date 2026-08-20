import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthorized } from "@/lib/auth";
import { commitFile, githubEnabled } from "@/lib/github";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || !file.size) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    const extension = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: "File type not allowed. Use PNG, JPG, WEBP, GIF, or SVG." },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (githubEnabled()) {
      await commitFile(
        `public/uploads/${filename}`,
        buffer,
        "Upload image via admin"
      );
      return NextResponse.json({
        url: `/uploads/${filename}`,
        note: "Gambar sudah di-commit ke GitHub. Akan tampil setelah deploy selesai (±1 menit).",
      });
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "GITHUB_TOKEN, GITHUB_OWNER, dan GITHUB_REPO belum diset di Environment Variables Vercel.",
        },
        { status: 500 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed. Please try again.",
      },
      { status: 500 }
    );
  }
}