"use client";

import { useRef, useState, type FormEvent } from "react";
import type { SiteConfig } from "@/lib/types";
import { ArrowUpRight, Logo, Spinner } from "@/components/icons";

interface FooterProps {
  site: SiteConfig;
}

export const Footer = ({ site }: FooterProps) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || isSubscribing) {
      return;
    }

    setIsSubscribing(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
      setIsSubscribed(true);
      timerRef.current = setTimeout(() => setIsSubscribed(false), 5000);
    }, 600);
  };

  return (
    <footer className="flex w-full flex-col items-center gap-[72px] bg-neutral-100 px-[72px] pb-12 pt-[72px]">
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-[72px]">
        <section
          className="flex w-full max-w-[1056px] flex-col items-start gap-16"
          aria-label="Footer introduction and social links"
        >
          <div className="flex flex-col items-start gap-6">
            <a
              href="#top"
              aria-label="Back to top"
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0"
            >
              <Logo className="h-12 w-[240px]" color="#ffffff" />
            </a>
            <p className="w-full max-w-[1056px] font-body-22px-regular text-neutral-40">
              {site.headline}
            </p>
          </div>
          <nav
            className="flex w-full max-w-[1056px] flex-wrap items-start gap-4"
            aria-label="Social media"
          >
            {site.socials.map((socialLink) => (
              <a
                key={socialLink.label}
                className="inline-flex flex-1 grow items-center justify-center gap-2 rounded-[100px] border border-solid border-neutral-60 px-5 py-2 transition-colors hover:border-neutral-0 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0"
                href={socialLink.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="whitespace-nowrap font-body-16px-medium text-neutral-0">
                  {socialLink.label}
                </span>
              </a>
            ))}
          </nav>
        </section>

        <div className="flex w-full max-w-[1056px] flex-col items-start gap-12 lg:flex-row lg:items-start lg:gap-4">
          <nav
            className="flex flex-1 grow flex-col items-start justify-center gap-8"
            aria-label="Page list"
          >
            <h2 className="font-body-22px-semibold text-neutral-40">
              Page List
            </h2>
            <div className="flex w-full flex-col gap-8 sm:flex-row sm:gap-[88px]">
              {site.footerColumns.map((column, columnIndex) => (
                <ul
                  key={`page-column-${columnIndex}`}
                  className="flex list-none flex-col items-start gap-4 p-0"
                >
                  {column.map((page) => (
                    <li key={page.label}>
                      <a
                        className="font-body-16px-medium text-neutral-0 transition-colors hover:text-neutral-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0"
                        href={page.href}
                      >
                        {page.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </nav>

          <section
            className="flex w-full max-w-[364px] flex-col items-start justify-center gap-8"
            aria-labelledby="newsletter-title"
          >
            <h2
              id="newsletter-title"
              className="font-body-22px-semibold text-neutral-40"
            >
              Stay connected w/ me.
            </h2>
            <form
              className="flex w-full items-start gap-3 self-stretch border-b border-neutral-0 pb-5 pt-0"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="footer-email">
                Enter your email
              </label>
              <input
                id="footer-email"
                className="flex-1 bg-transparent font-body-16px-regular text-neutral-0 outline-none placeholder:text-neutral-60"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
              <button
                className="flex h-6 w-6 flex-[0_0_auto] items-center justify-center transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0 disabled:cursor-wait disabled:opacity-70"
                type="submit"
                aria-label="Subscribe with email"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <Spinner className="!relative !h-5 !w-5 text-white" />
                ) : (
                  <ArrowUpRight
                    className="!relative !h-6 !w-6"
                    color="white"
                  />
                )}
              </button>
            </form>
            <p
              className="animate-fade-in font-body-14px-medium text-neutral-40 opacity-0"
              role="status"
              aria-live="polite"
              style={isSubscribed ? { opacity: 1 } : undefined}
            >
              {isSubscribed
                ? "Thanks for subscribing!"
                : "Get updates on new projects and insights."}
            </p>
          </section>
        </div>

        <p className="font-body-16px-regular text-neutral-60">
          ©{new Date().getFullYear()} All Rights Reserved. Crafted with 🤍 by{" "}
          {site.name}
        </p>
      </div>
    </footer>
  );
};