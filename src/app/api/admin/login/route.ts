import { NextResponse } from "next/server";
import { clearAuthCookie, createAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set in .env.local" },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body.password || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Wrong password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", createAuthCookie());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearAuthCookie());
  return response;
}