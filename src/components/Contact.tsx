"use client";

import { useState, type FormEvent } from "react";
import type { SiteConfig } from "@/lib/types";
import {
  ArrowRight,
  ArrowUpRight,
  MailIcon,
  MapPinIcon,
  Spinner,
} from "@/components/icons";

interface ContactProps {
  site: SiteConfig;
}

interface FormState {
  name: string;
  email: string;
  message: string;
  website: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  message: "",
  website: "",
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

export const Contact = ({ site }: ContactProps) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setStatusMessage(
          result.error ?? "Something went wrong. Please try again later."
        );
        return;
      }

      setStatus("success");
      setStatusMessage(
        "Thank you! Your message has been sent. I'll get back to you within 24 hours."
      );
      setFormState(initialFormState);
    } catch {
      setStatus("error");
      setStatusMessage(
        "Network error. Please check your connection and try again."
      );
    }
  };

  const inputClasses =
    "w-full border-b border-neutral-20 bg-transparent py-3 font-body-16px-regular text-neutral-100 placeholder:text-neutral-50 outline-none transition-colors focus:border-neutral-100";

  return (
    <section
      id="contact"
      className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 border-t border-neutral-20 p-6 md:gap-[72px] md:p-[72px]"
      aria-labelledby="contact-call-to-action-heading"
    >
      <div className="flex w-full flex-col items-center gap-10 md:gap-[72px]">
        <div className="flex w-full max-w-[1056px] flex-col items-center gap-6 px-6 md:px-[136px]">
          <p className="mt-[-1px] w-full max-w-[518px] text-center font-body-28px-medium text-neutral-90">
            Have an idea?
          </p>
          <h2
            id="contact-call-to-action-heading"
            className="w-full max-w-[1056px] text-center font-heading-desktop-h1 text-neutral-100"
            style={{
              fontFamily:
                "var(--font-inter-tight), 'Inter Tight', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(44px, 8vw, 104px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="text-neutral-100">Let&apos;s rock </span>
            <span className="text-[#adb2ba]">with me</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 font-body-16px-medium text-neutral-60 transition-colors hover:text-neutral-100"
            >
              <MailIcon className="h-5 w-5" color="#6b7280" />
              {site.email}
            </a>
            <span className="inline-flex items-center gap-2 font-body-16px-medium text-neutral-60">
              <MapPinIcon className="h-5 w-5" color="#6b7280" />
              {site.location}
            </span>
            <span className="inline-flex items-center gap-2 font-body-16px-medium text-neutral-60">
              {site.responseTime}
            </span>
          </div>
        </div>

        <form
          className="flex w-full max-w-[640px] flex-col gap-6"
          onSubmit={handleSubmit}
          aria-label="Contact form"
        >
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formState.website}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  website: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className={inputClasses}
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Your email"
                className={inputClasses}
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="sr-only">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              minLength={10}
              placeholder="Tell me about your project..."
              className={`${inputClasses} resize-none`}
              value={formState.message}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  message: event.target.value,
                }))
              }
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex w-fit items-center justify-center gap-3 self-end rounded-[100px] bg-neutral-100 px-8 py-4 transition-all hover:scale-[1.02] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="whitespace-nowrap font-body-16px-semibold text-white">
              {status === "sending" ? "Sending..." : "Send Message"}
            </span>
            {status === "sending" ? (
              <Spinner className="!relative !h-5 !w-5 text-white" />
            ) : (
              <ArrowRight
                className="!relative !h-5 !w-5 text-white transition-transform group-hover:translate-x-1"
                color="white"
              />
            )}
          </button>
          <p
            className={`animate-fade-in font-body-16px-medium ${
              status === "error" ? "text-red-600" : "text-neutral-60"
            }`}
            role="status"
            aria-live="polite"
          >
            {status === "success" || status === "error"
              ? statusMessage
              : "\u00A0"}
          </p>
        </form>

        <div className="flex flex-col items-center gap-4">
          <h3 className="font-body-16px-medium uppercase tracking-widest text-neutral-50">
            Follow me
          </h3>
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {site.socials.map((socialLink) => (
              <li key={socialLink.label}>
                <a
                  className="inline-flex items-center gap-1.5 rounded-[100px] border border-neutral-20 px-4 py-2 font-body-16px-medium text-neutral-70 transition-colors hover:border-neutral-100 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
                  href={socialLink.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {socialLink.label}
                  <ArrowUpRight className="!relative !h-4 !w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};