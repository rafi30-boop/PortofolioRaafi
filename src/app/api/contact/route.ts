import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getContent } from "@/lib/content";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string;
}

function sanitize(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

function validate(payload: ContactPayload): string | null {
  if (!payload.name || payload.name.length < 2) {
    return "Name must be at least 2 characters long.";
  }
  if (!payload.email || !EMAIL_PATTERN.test(payload.email)) {
    return "Please provide a valid email address.";
  }
  if (!payload.message || payload.message.length < 10) {
    return "Message must be at least 10 characters long.";
  }
  if (payload.name.length > 100 || payload.message.length > 5000) {
    return "Message is too long.";
  }
  return null;
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed." },
      { status: 405 }
    );
  }

  const { site } = await getContent();

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.EMAIL_TO;

  if (!apiKey || !emailFrom || !emailTo) {
    console.error(
      "Contact API is not configured. Missing RESEND_API_KEY, EMAIL_FROM, or EMAIL_TO."
    );
    return NextResponse.json(
      {
        error:
          "The contact form is not configured yet. Please set RESEND_API_KEY, EMAIL_FROM, and EMAIL_TO in .env.local.",
      },
      { status: 500 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (payload.website && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const name = sanitize(payload.name);
  const email = sanitize(payload.email).toLowerCase();
  const message = sanitize(payload.message);

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `${site.name} Portfolio <${emailFrom}>`,
      to: [emailTo],
      replyTo: email,
      subject: `New message from ${name} via portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
          <h2 style="margin: 0 0 16px; font-size: 20px; color: #030712;">New message from ${name}</h2>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 14px;">
            Received via the contact form on ${site.name}&apos;s portfolio.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 90px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; color: #030712; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 90px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; color: #030712;">
                <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 90px; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; color: #030712; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}