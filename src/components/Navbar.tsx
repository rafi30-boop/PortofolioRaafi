"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SiteConfig } from "@/lib/types";
import {
  ArrowRight,
  ArrowUpRight,
  CloseIcon,
  Logo,
  MenuIcon,
  Spinner,
} from "@/components/icons";

interface NavbarProps {
  site: SiteConfig;
}

const navigationItems = [
  { label: "Home", number: "(01)", href: "#top" },
  { label: "About Me", number: "(02)", href: "#about" },
  { label: "Works", number: "(03)", href: "#projects" },
  { label: "Skills", number: "(04)", href: "#skills" },
  { label: "Experience", number: "(05)", href: "#experience" },
  { label: "Education", number: "(06)", href: "#education" },
  { label: "Certificates", number: "(07)", href: "#certificates" },
];

export const Navbar = ({ site }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || isSubscribing) {
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
    }, 600);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-all duration-300 md:px-[72px] ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-[0_1px_0_0_var(--neutral-20)]"
            : "bg-transparent"
        }`}
      >
        <a
          className="relative flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100"
          href="#top"
          aria-label={`${site.name} home`}
        >
          <Logo className="h-6 w-[140px]" />
        </a>

        <div className="inline-flex items-start gap-4">
          <a
            className="group hidden h-12 items-center justify-center gap-3 rounded-[100px] border border-solid border-neutral-100 px-5 py-3 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 sm:inline-flex"
            href="#contact"
          >
            <span className="whitespace-nowrap font-body-16px-semibold text-neutral-100 transition-colors group-hover:text-white">
              Let&apos;s Talk
            </span>
            <ArrowRight className="!relative !h-5 !w-5" />
          </a>
          <button
            className="inline-flex h-12 items-center gap-3 rounded-[100px] border border-solid border-neutral-100 px-6 py-3 transition-colors hover:bg-neutral-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="!relative !h-5 !w-5" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-[60] flex min-h-screen flex-col overflow-y-auto bg-neutral-100"
          role="dialog"
          aria-modal="true"
          aria-label="Website navigation menu"
        >
          <header className="flex w-full max-w-[1200px] items-center justify-between self-center px-6 py-6 md:px-[72px]">
            <a
              className="relative flex items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-0"
              href="#top"
              aria-label={`${site.name} home`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Logo className="h-6 w-[140px]" color="#ffffff" />
            </a>
            <div className="inline-flex items-start gap-4">
              <a
                className="hidden h-12 items-center justify-center gap-3 rounded-[100px] border border-solid border-neutral-0 px-5 py-3 transition-colors hover:bg-neutral-0 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0 sm:inline-flex"
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="whitespace-nowrap font-body-16px-semibold text-neutral-0 transition-colors hover:text-neutral-100">
                  Let&apos;s Talk
                </span>
                <ArrowRight className="!relative !h-5 !w-5 text-neutral-0" />
              </a>
              <button
                className="inline-flex h-12 items-center gap-3 rounded-[100px] border border-solid border-neutral-0 px-6 py-3 transition-colors hover:bg-neutral-0 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0"
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <CloseIcon className="!relative !h-5 !w-5 text-neutral-0" />
              </button>
            </div>
          </header>

          <section
            className="flex w-full max-w-[1200px] flex-col items-start gap-10 self-center px-6 pb-[72px] md:px-[72px]"
            aria-label="Website navigation"
          >
            <div className="h-px w-full bg-neutral-60" aria-hidden="true" />

            <nav
              className="flex w-full flex-col items-start gap-8 self-stretch"
              aria-label="Primary navigation"
            >
              {navigationItems.map((item, index) => (
                <a
                  key={item.label}
                  className="group animate-fade-up flex w-full items-start justify-between self-stretch rounded-sm opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-0"
                  href={item.href}
                  style={{ animationDelay: `${index * 80}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="inline-flex items-baseline gap-4">
                    <span
                      className="whitespace-nowrap font-heading-desktop-h2 text-neutral-0 transition-colors group-hover:text-neutral-40"
                      style={{
                        fontSize: "clamp(32px, 6.5vw, 72px)",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.label}
                    </span>
                    <span className="whitespace-nowrap font-body-22px-regular text-neutral-50">
                      {item.number}
                    </span>
                  </span>
                  <span className="hidden flex-[0_0_auto] items-start gap-2 rounded-[100px] border border-solid border-neutral-0 px-7 py-4 transition-colors group-hover:bg-neutral-0 group-hover:text-neutral-100 sm:inline-flex">
                    <ArrowRight className="!relative !h-6 !w-6 text-neutral-0 transition-colors group-hover:text-neutral-100" />
                  </span>
                </a>
              ))}
            </nav>

            <div className="h-px w-full bg-neutral-60" aria-hidden="true" />

            <section
              className="flex w-full flex-col items-start gap-14 md:flex-row md:items-start"
              aria-label="Social links and newsletter"
            >
              <div className="flex flex-1 grow flex-col items-start justify-between gap-6">
                <h2 className="font-body-22px-semibold text-neutral-50">
                  Follow me.
                </h2>
                <div className="flex flex-wrap items-start gap-10">
                  {site.socials.map((link) => (
                    <a
                      key={link.label}
                      className="inline-flex items-start gap-3 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-0"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${link.label} profile`}
                    >
                      <span className="whitespace-nowrap font-body-16px-medium text-neutral-0">
                        {link.label.toUpperCase()}
                      </span>
                      <ArrowUpRight className="!relative !h-6 !w-6 text-neutral-0" />
                    </a>
                  ))}
                </div>
              </div>
              <form
                className="flex w-full max-w-[364px] flex-col items-start justify-center gap-8"
                onSubmit={handleSubscribe}
              >
                <h2 className="whitespace-nowrap font-body-22px-semibold text-neutral-50">
                  Stay connected w/ me.
                </h2>
                <div className="flex w-full items-start gap-3 self-stretch border-b border-neutral-0 pb-5 pt-0 focus-within:border-neutral-50">
                  <label className="sr-only" htmlFor="menu-newsletter-email">
                    Email address
                  </label>
                  <input
                    className="flex-1 bg-transparent font-body-14px-regular text-neutral-0 outline-none placeholder:text-neutral-50"
                    id="menu-newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                  <button
                    className="rounded-sm transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0 disabled:cursor-wait disabled:opacity-70"
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? (
                      <Spinner className="!relative !h-5 !w-5 text-neutral-0" />
                    ) : (
                      <ArrowUpRight className="!relative !h-6 !w-6 text-neutral-0" />
                    )}
                  </button>
                </div>
              </form>
            </section>
          </section>
        </div>
      )}
    </>
  );
};